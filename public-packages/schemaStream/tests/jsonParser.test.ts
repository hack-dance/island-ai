import { SchemaStream } from "@/utils/streaming-json-parser"
import { describe, expect, test } from "bun:test"
import { lensPath, view } from "ramda"
import { z, ZodObject, ZodRawShape } from "zod"

const checkPathValue = (obj, path) => {
  const lens = lensPath(path)
  const value = view(lens, obj)

  //should check against schema type
  return !!value
}

async function runTest<T extends ZodRawShape>(schema: ZodObject<T>, jsonData: object) {
  let completed: (string | number | undefined)[][] = []

  const parser = new SchemaStream(schema, {
    onKeyComplete({ completedPaths }) {
      completed = completedPaths
    }
  })

  const stream = parser.parse()
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()

  const readableStream = new ReadableStream({
    start(controller) {
      const jsonDataString = JSON.stringify(jsonData)
      const chunkSize = 10
      let position = 0

      function enqueueNextChunk() {
        if (position >= jsonDataString.length) {
          controller.close()
          return
        }

        const chunk = jsonDataString.slice(position, position + chunkSize)
        controller.enqueue(encoder.encode(chunk))
        position += chunkSize

        setTimeout(enqueueNextChunk, 10)
      }

      enqueueNextChunk()
    }
  })

  readableStream.pipeThrough(stream)

  const reader = stream.readable.getReader()

  let result = null
  let done = false
  while (!done) {
    const { value, done: doneReading } = await reader.read()
    if (doneReading) {
      done = true
      break
    }

    result = value
  }

  return { result: JSON.parse(decoder.decode(result)), completed }
}

describe("SchemaStream", () => {
  test("should parse valid JSON correctly - single layer primitives", async () => {
    const schema = z.object({
      someString: z.string().default("default string"),
      someNumber: z.number().default(420),
      someBoolean: z.boolean().default(true)
    })

    const data = {}

    const { result } = await runTest(schema, data)
    console.log(result)
    expect(result).toEqual({
      someString: "default string",
      someNumber: 420,
      someBoolean: true
    })
  })

  test("should parse valid JSON correctly - single layer primitives", async () => {
    const schema = z.object({
      someString: z.string().refine(val => val === "test", { params: { message: "not test" } }),
      someNumber: z.number(),
      someBoolean: z.boolean(),
      longString: z.string()
    })

    const data = {
      someString: "test",
      someNumber: 123,
      someBoolean: true,
      longString:
        "this is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long stringthis is a long string"
    }

    const { result, completed } = await runTest(schema, data)

    expect(result).toEqual(data)

    completed.forEach(path => {
      expect(checkPathValue(data, path)).toBe(true)
    })
  })

  test("should parse valid JSON correctly - single layer primitives", async () => {
    const schema = z.object({
      someString: z.string().refine(val => val === "test", { params: { message: "not test" } }),
      someNumber: z.number(),
      someBoolean: z.boolean()
    })

    const data = {
      someString: "test",
      someNumber: 123,
      someBoolean: true
    }

    const { result, completed } = await runTest(schema, data)

    expect(result).toEqual(data)

    completed.forEach(path => {
      expect(checkPathValue(data, path)).toBe(true)
    })
  })

  // Test for nested json - up to 5 layers deep
  test("should parse valid JSON correctly - multi-layer object nesting", async () => {
    const schema = z.object({
      layer1: z.object({
        layer2: z.object({
          yo: z.string(),
          layer3: z.object({
            layer4: z.object({
              layer5: z.string()
            })
          })
        })
      })
    })

    const data = {
      layer1: {
        layer2: {
          yo: "test",
          layer3: {
            layer4: {
              layer5: "test"
            }
          }
        }
      }
    }

    const { result } = await runTest(schema, data)

    expect(result).toEqual(data)
  })

  // Test for object arrays - single layer deep for now on the objects in those arrays
  test("should parse valid JSON correctly - single layer object array nesting", async () => {
    const schema = z.object({
      someArray: z.array(
        z.object({
          someString: z.string(),
          someNumber: z.number()
        })
      )
    })

    const data = {
      someArray: [
        {
          someString: "test",
          someNumber: 123
        },
        {
          someString: "test2",
          someNumber: 456
        }
      ]
    }

    const { result } = await runTest(schema, data)

    expect(result).toEqual(data)
  })

  // Test for arrays of strings with things like commas braces and brackets
  test("should parse valid JSON correctly - arrays of strings with special characters", async () => {
    const schema = z.object({
      someArray: z.array(z.string())
    })

    const data = {
      someArray: ["test]", "{test2", "[test2", "test2}", "test2,", ":test2"]
    }

    await runTest(schema, data)
  })

  // Test for any other string value for objects or straight strings with those types of characters
  test("should parse valid JSON correctly - strings with special characters", async () => {
    const schema = z.object({
      someString: z.string(),
      someString2: z.string(),
      someString3: z.string(),
      someString4: z.string(),
      someString5: z.string(),
      someString6: z.string()
    })

    const data = {
      someString: "test]",
      someString2: "{test2",
      someString3: "[test2",
      someString4: "test2}",
      someString5: "test2,",
      someString6: ":test2"
    }

    const { result } = await runTest(schema, data)

    expect(result).toEqual(data)
  })
})
