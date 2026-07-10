import type * as z4 from "zod/v4/core"

export type Zod3Schema = {
  readonly _def: unknown
  readonly _input: unknown
  readonly _output: unknown
}

export type Zod3ObjectSchema = Zod3Schema & {
  readonly shape: Readonly<Record<string, Zod3Schema>>
}

export type ZodSchema = Zod3Schema | z4.$ZodType
export type ZodObjectSchema = Zod3ObjectSchema | z4.$ZodObject

export type SchemaInput<TSchema extends ZodSchema> = TSchema extends {
  _zod: z4.$ZodType["_zod"]
}
  ? z4.input<TSchema & z4.$ZodType>
  : TSchema extends Zod3Schema
    ? TSchema["_input"]
    : never

export type SchemaStreamValue<TValue> = unknown extends TValue
  ? unknown
  : TValue extends readonly (infer TItem)[]
    ? SchemaStreamValue<TItem>[]
    : TValue extends Record<PropertyKey, unknown>
      ? { [TKey in keyof TValue]?: SchemaStreamValue<TValue[TKey]> }
      : TValue | null

export type SchemaStreamChunk<TSchema extends ZodObjectSchema> = SchemaStreamValue<
  SchemaInput<TSchema>
>

export type SchemaStreamDefaultData<TSchema extends ZodObjectSchema> = Partial<
  SchemaStreamChunk<TSchema>
>

type ZodShape = Readonly<Record<string, ZodSchema>>

type Zod3Definition = {
  typeName?: string
  defaultValue?: () => unknown
  getter?: () => ZodSchema
  in?: ZodSchema
  innerType?: ZodSchema
  schema?: ZodSchema
  shape?: () => ZodShape
}

type TraversableZod3Schema = Zod3Schema & { _def: Zod3Definition }

type SchemaDefinition =
  | {
      major: 3
      type: string
      definition: Zod3Definition
    }
  | {
      major: 4
      type: z4.$ZodTypes["_zod"]["def"]["type"]
      definition: z4.$ZodTypes["_zod"]["def"]
    }

export function isZod4Schema(schema: ZodSchema): schema is z4.$ZodType {
  return "_zod" in schema
}

function getSchemaDefinition(schema: ZodSchema): SchemaDefinition {
  if (isZod4Schema(schema)) {
    const definition = (schema as z4.$ZodTypes)._zod.def

    return {
      major: 4,
      type: definition.type,
      definition
    }
  }

  const definition = (schema as TraversableZod3Schema)._def

  return {
    major: 3,
    type: definition.typeName?.replace(/^Zod/, "").toLowerCase() ?? "unknown",
    definition
  }
}

export function getObjectShape(schema: ZodObjectSchema): ZodShape {
  const schemaDefinition = getSchemaDefinition(schema)

  if (schemaDefinition.major === 4 && schemaDefinition.definition.type === "object") {
    return schemaDefinition.definition.shape
  }

  if (schemaDefinition.major === 3 && schemaDefinition.type === "object") {
    return schemaDefinition.definition.shape?.() ?? {}
  }

  return {}
}

export type SchemaNode =
  | { type: "array" | "boolean" | "enum" | "null" | "number" | "record" | "string" }
  | { type: "default" | "prefault"; value: unknown }
  | { type: "object"; shape: ZodShape }
  | { type: "transparent"; innerType: ZodSchema }
  | { type: "unknown"; name: string }

/**
 * Normalizes the documented Zod 4 Core definition contract and the legacy Zod 3
 * definition layout into the small set of schema operations SchemaStream needs.
 */
export function getSchemaNode(schema: ZodSchema): SchemaNode {
  const schemaDefinition = getSchemaDefinition(schema)

  if (schemaDefinition.major === 4) {
    const definition = schemaDefinition.definition

    switch (definition.type) {
      case "array":
      case "boolean":
      case "enum":
      case "null":
      case "number":
      case "record":
      case "string":
        return { type: definition.type }
      case "default":
      case "prefault":
        return { type: definition.type, value: definition.defaultValue }
      case "object":
        return { type: "object", shape: definition.shape }
      case "catch":
      case "nonoptional":
      case "nullable":
      case "optional":
      case "readonly":
        return definition.type === "nullable"
          ? { type: "null" }
          : { type: "transparent", innerType: definition.innerType }
      case "lazy":
        return { type: "transparent", innerType: definition.getter() }
      case "pipe":
        return { type: "transparent", innerType: definition.in }
      default:
        return { type: "unknown", name: definition.type }
    }
  }

  const definition = schemaDefinition.definition

  switch (schemaDefinition.type) {
    case "array":
    case "boolean":
    case "enum":
    case "nativeenum":
    case "null":
    case "number":
    case "record":
    case "string":
      return { type: schemaDefinition.type === "nativeenum" ? "enum" : schemaDefinition.type }
    case "default":
      return { type: "default", value: definition.defaultValue?.() }
    case "object":
      return { type: "object", shape: definition.shape?.() ?? {} }
    case "nullable":
      return { type: "null" }
    case "branded":
    case "catch":
    case "effects":
    case "optional":
    case "pipeline":
    case "readonly": {
      const innerType =
        definition.innerType ?? definition.schema ?? definition.in ?? definition.getter?.()

      return innerType
        ? { type: "transparent", innerType }
        : { type: "unknown", name: schemaDefinition.type }
    }
    case "lazy": {
      const innerType = definition.getter?.()

      return innerType
        ? { type: "transparent", innerType }
        : { type: "unknown", name: schemaDefinition.type }
    }
    default:
      return { type: "unknown", name: schemaDefinition.type }
  }
}
