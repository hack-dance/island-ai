import JSONParser from "./json-parser"
import type {
  ParsedTokenInfo,
  StackElement,
  TokenParserMode,
  TokenParserState
} from "./token-parser"
import {
  getObjectShape,
  getSchemaNode,
  type SchemaStreamChunk,
  type SchemaStreamDefaultData,
  type ZodObjectSchema,
  type ZodSchema
} from "./zod-compat"

export type TypeDefaults = {
  string?: string | null | undefined
  number?: number | null | undefined
  boolean?: boolean | null | undefined
}

export type SchemaPath = (string | number | undefined)[]

export type OnKeyCompleteCallbackParams = {
  activePath: SchemaPath
  completedPaths: SchemaPath[]
}

export type OnKeyCompleteCallback = (data: OnKeyCompleteCallbackParams) => void

export type SchemaStreamOptions<TSchema extends ZodObjectSchema> = {
  defaultData?: SchemaStreamDefaultData<TSchema>
  typeDefaults?: TypeDefaults
  onKeyComplete?: OnKeyCompleteCallback
}

export type SchemaStreamParseOptions = {
  stringBufferSize?: number
  handleUnescapedNewLines?: boolean
}

type JsonContainer = Record<string | number, unknown>

function hasOwn(value: object, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(value, key)
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function setPathValue(target: Record<string, unknown>, path: SchemaPath, value: unknown): void {
  if (path.length === 0) {
    return
  }

  let current: JsonContainer = target

  for (let index = 0; index < path.length - 1; index += 1) {
    const segment = path[index]
    const nextSegment = path[index + 1]

    if (segment === undefined) {
      continue
    }

    const existing = current[segment]
    if (typeof existing === "object" && existing !== null) {
      current = existing as JsonContainer
      continue
    }

    const nextValue = (typeof nextSegment === "number" ? [] : {}) as JsonContainer
    current[segment] = nextValue
    current = nextValue
  }

  const finalSegment = path[path.length - 1]
  if (finalSegment !== undefined) {
    current[finalSegment] = value
  }
}

function pathsEqual(left: SchemaPath, right: SchemaPath): boolean {
  return left.length === right.length && left.every((segment, index) => segment === right[index])
}

/**
 * Parses chunked JSON into schema-shaped intermediate values. SchemaStream does not
 * validate chunks; consumers should validate the final value with their Zod schema.
 */
export class SchemaStream<TSchema extends ZodObjectSchema> {
  private schemaInstance: Record<string, unknown>
  private activePath: SchemaPath = []
  private completedPaths: SchemaPath[] = []
  private readonly onKeyComplete?: OnKeyCompleteCallback
  private readonly typeDefaults?: TypeDefaults

  public constructor(schema: TSchema, options: SchemaStreamOptions<TSchema> = {}) {
    this.typeDefaults = options.typeDefaults
    this.schemaInstance = this.createBlankObject(
      schema,
      options.defaultData as Record<string, unknown> | undefined
    )
    this.onKeyComplete = options.onKeyComplete
  }

  private getTypeDefault(type: keyof TypeDefaults): unknown {
    return this.typeDefaults && hasOwn(this.typeDefaults, type) ? this.typeDefaults[type] : null
  }

  private createStubValue(
    schema: ZodSchema,
    explicitDefault: unknown,
    hasExplicitDefault: boolean,
    ancestors: ReadonlySet<ZodSchema>
  ): unknown {
    if (ancestors.has(schema)) {
      return null
    }

    const nextAncestors = new Set(ancestors).add(schema)
    const node = getSchemaNode(schema)

    if (node.type === "transparent") {
      return this.createStubValue(
        node.innerType,
        explicitDefault,
        hasExplicitDefault,
        nextAncestors
      )
    }

    if (hasExplicitDefault) {
      if (node.type === "object" && isObject(explicitDefault)) {
        return this.createBlankObjectFromShape(node.shape, explicitDefault, nextAncestors)
      }

      return explicitDefault
    }

    switch (node.type) {
      case "default":
      case "prefault":
        return node.value
      case "string":
      case "number":
      case "boolean":
        return this.getTypeDefault(node.type)
      case "array":
        return []
      case "record":
        return {}
      case "object":
        return this.createBlankObjectFromShape(node.shape, undefined, nextAncestors)
      case "enum":
      case "null":
      case "unknown":
        return null
    }
  }

  private createBlankObjectFromShape(
    shape: Readonly<Record<string, ZodSchema>>,
    defaultData?: Record<string, unknown>,
    ancestors: ReadonlySet<ZodSchema> = new Set()
  ): Record<string, unknown> {
    const object: Record<string, unknown> = {}

    for (const [key, schema] of Object.entries(shape)) {
      const hasExplicitDefault = defaultData !== undefined && hasOwn(defaultData, key)
      object[key] = this.createStubValue(schema, defaultData?.[key], hasExplicitDefault, ancestors)
    }

    return object
  }

  private createBlankObject(
    schema: ZodObjectSchema,
    defaultData?: Record<string, unknown>
  ): Record<string, unknown> {
    return this.createBlankObjectFromShape(getObjectShape(schema), defaultData, new Set([schema]))
  }

  private getPathFromStack(
    stack: StackElement[] = [],
    key: string | number | undefined
  ): SchemaPath {
    return [...stack.map(element => element.key), key].slice(1)
  }

  private emitCompletion(): void {
    this.onKeyComplete?.({
      activePath: [...this.activePath],
      completedPaths: this.completedPaths.map(path => [...path])
    })
  }

  private handleToken({
    parser: { key, stack },
    tokenizer: { value, partial }
  }: {
    parser: {
      state: TokenParserState
      key: string | number | undefined
      mode: TokenParserMode | undefined
      stack: StackElement[]
    }
    tokenizer: ParsedTokenInfo
  }): void {
    const valuePath = this.getPathFromStack(stack, key)
    this.activePath = valuePath

    if (
      !partial &&
      valuePath.length > 0 &&
      !this.completedPaths.some(completedPath => pathsEqual(completedPath, valuePath))
    ) {
      this.completedPaths.push([...valuePath])
    }

    setPathValue(this.schemaInstance, valuePath, value)

    this.emitCompletion()
  }

  /** Returns a new schema-derived stub using this instance's primitive defaults. */
  public getSchemaStub<TStubSchema extends ZodObjectSchema>(
    schema: TStubSchema,
    defaultData?: SchemaStreamDefaultData<TStubSchema>
  ): SchemaStreamChunk<TStubSchema> {
    return this.createBlankObject(
      schema,
      defaultData as Record<string, unknown> | undefined
    ) as SchemaStreamChunk<TStubSchema>
  }

  /** Creates a transform that emits the current schema-shaped JSON after every input chunk. */
  public parse(options: SchemaStreamParseOptions = {}): TransformStream<Uint8Array, Uint8Array> {
    const textEncoder = new TextEncoder()
    const parser = new JSONParser({
      stringBufferSize: options.stringBufferSize ?? 0,
      handleUnescapedNewLines: options.handleUnescapedNewLines ?? true
    })

    parser.onToken = this.handleToken.bind(this)
    parser.onValue = () => undefined

    return new TransformStream<Uint8Array, Uint8Array>({
      transform: (chunk, controller): void => {
        try {
          if (!parser.isEnded) {
            parser.write(chunk)
          }
          controller.enqueue(textEncoder.encode(JSON.stringify(this.schemaInstance)))
        } catch (error) {
          controller.error(error)
        }
      },
      flush: (): void => {
        this.activePath = []
        this.emitCompletion()
      }
    })
  }
}
