import { AnyZodObject, z, ZodTypeAny } from "zod"

type JsonValue = string | number | boolean | bigint | JsonArray | JsonObject | null
interface JsonArray extends Array<JsonValue> {}
interface JsonObject {
  [key: string]: JsonValue
}

const typeMap = new Map<string, () => ZodTypeAny>([
  ["string", () => z.string()],
  ["number", () => z.number()],
  ["bigint", () => z.bigint()],
  ["boolean", () => z.boolean()],
  ["undefined", () => z.undefined()],
  ["function", () => z.function()],
  ["symbol", () => z.unknown()],
  ["object-null", () => z.null()]
])

export const jsonToZod = (jsonString: string): AnyZodObject | Error => {
  let obj: JsonValue
  try {
    obj = JSON.parse(jsonString)
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return new Error("Invalid JSON input")
  }

  const parse = (obj: JsonValue, seen: JsonObject[]): ZodTypeAny | Error => {
    if (obj === null) {
      return z.null()
    }

    const type = typeof obj
    const zodSchema = typeMap.get(type)

    if (zodSchema) {
      return zodSchema()
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return z.array(z.unknown())
      } else {
        const itemType = parse(obj[0], seen)
        if (itemType instanceof Error) {
          return itemType
        }
        return z.array(itemType)
      }
    }

    if (typeof obj === "object") {
      if (seen.includes(obj)) {
        return new Error("Circular objects are not supported")
      }
      seen.push(obj)

      const objectSchema = Object.entries(obj).reduce(
        (acc, [key, value]) => {
          const parsedValue = parse(value, seen)
          if (parsedValue instanceof Error) {
            return parsedValue
          }
          acc[key] = parsedValue
          return acc
        },
        {} as { [key: string]: ZodTypeAny }
      )

      if (Object.values(objectSchema).some(v => v instanceof Error)) {
        return new Error("Error in object schema generation")
      }

      return z.object(objectSchema)
    }

    return z.unknown()
  }

  const result = parse(obj, [])
  if (result instanceof Error) {
    console.error("Error generating Zod schema:", result)
  }
  return result
}

// Example usage
// const result = jsonToZod('{"users": [{"name": "John", "email": "john@example.com"}]}');
// if (result instanceof Error) {
//   console.error(result);
// } else {
//
