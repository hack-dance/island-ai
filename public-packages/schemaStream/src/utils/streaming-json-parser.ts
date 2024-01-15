import { lensPath, set, view } from "ramda"
import { z, ZodObject, ZodOptional, ZodRawShape, ZodTypeAny } from "zod"

import JSONParser from "./json-parser"
import { ParsedTokenInfo, StackElement, TokenParserMode, TokenParserState } from "./token-parser"

type SchemaType<T extends ZodRawShape = ZodRawShape> = ZodObject<T>
type TypeDefaults = {
  string?: string | null | undefined
  number?: number | null | undefined
  boolean?: boolean | null | undefined
}

type NestedValue = string | number | boolean | NestedObject | NestedValue[]
type NestedObject = { [key: string]: NestedValue } & { [key: number]: NestedValue }

type OnKeyCompleteCallbackParams = {
  activePath: (string | number | undefined)[]
  completedPaths: (string | number | undefined)[][]
}

type OnKeyCompleteCallback = (data: OnKeyCompleteCallbackParams) => void | undefined

/**
 * `SchemaStream` is a utility for parsing streams of json and
 * providing a safe-to-read-from stubbed version of the data before the stream
 * has fully completed.
 *
 * It uses Zod for schema validation and the Streamparser library for
 * parsing JSON from an input stream.
 *
 * @example
 * ```typescript
 * const schema = z.object({
 *   someString: z.string(),
 *   someNumber: z.number()
 * })
 *
 * const response = await getSomeStreamOfJson()
 * const parser = new SchemaStream(schema)
 * const streamParser = parser.parse()
 *
 * response.body?.pipeThrough(parser)
 *
 * const reader = streamParser.readable.getReader()
 *
 * const decoder = new TextDecoder()
 * let result = {}
 * while (!done) {
 *   const { value, done: doneReading } = await reader.read()
 *   done = doneReading
 *
 *   if (done) {
 *     console.log(result)
 *     break
 *   }
 *
 *   const chunkValue = decoder.decode(value)
 *   result = JSON.parse(chunkValue)
 * }
 * ```
 *
 * @public
 */

export class SchemaStream {
  private schemaInstance: NestedObject
  private activePath: (string | number | undefined)[] = []
  private completedPaths: (string | number | undefined)[][] = []
  private onKeyComplete?: OnKeyCompleteCallback

  /**
   * Constructs a new instance of the `SchemaStream` class.
   *
   * @param schema - The Zod schema to use for validation.
   */
  constructor(
    schema: SchemaType,
    opts: {
      defaultData?: NestedObject
      typeDefaults?: TypeDefaults
      onKeyComplete?: OnKeyCompleteCallback
    } = {}
  ) {
    const { defaultData, onKeyComplete, typeDefaults } = opts

    this.schemaInstance = this.createBlankObject(schema, defaultData, typeDefaults)
    this.onKeyComplete = onKeyComplete
  }

  /**
   * Gets the default value for a given Zod type.
   *
   * @param type - The Zod type.
   * @returns The default value for the type.
   */
  private getDefaultValue(type: ZodTypeAny, typeDefaults?: TypeDefaults): unknown {
    switch (type._def.typeName) {
      case "ZodString":
        return typeDefaults?.hasOwnProperty("string") ? typeDefaults.string : ""
      case "ZodNumber":
        return typeDefaults?.hasOwnProperty("number") ? typeDefaults.number : 0
      case "ZodBoolean":
        return typeDefaults?.hasOwnProperty("boolean") ? typeDefaults.boolean : false
      case "ZodArray":
        return []
      case "ZodRecord":
        return {}
      case "ZodObject":
        return this.createBlankObject(type as SchemaType)
      case "ZodOptional":
        //eslint-disable-next-line
        return this.getDefaultValue((type as ZodOptional<any>).unwrap())
      case "ZodEffects":
        return this.getDefaultValue(type._def.schema)
      case "ZodNullable":
        return null
      default:
        throw new Error(`Unsupported type: ${type._def.typeName}`)
    }
  }

  private createBlankObject<T extends ZodRawShape>(
    schema: SchemaType<T>,
    defaultData?: NestedObject,
    typeDefaults?: TypeDefaults
  ): NestedObject {
    const obj: NestedObject = {}

    for (const key in schema.shape) {
      const type = schema.shape[key]
      if (defaultData && defaultData?.[key as unknown as keyof NestedObject]) {
        obj[key] = defaultData?.[key as unknown as keyof NestedObject]
      } else {
        obj[key] = this.getDefaultValue(type, typeDefaults) as NestedValue
      }
    }

    return obj
  }

  private getPathFromStack(
    stack: StackElement[] = [],
    key: string | number | undefined
  ): (string | number)[] {
    const valuePath = [...stack.map(({ key }) => key), key]
    valuePath.shift()

    // first item is undefined as root - we remove wiht shift t oavoid the full filter
    // thats why we cast here
    return valuePath as (string | number)[]
  }

  private handleToken({
    parser: { key, stack },
    tokenizer: { token, value, partial }
  }: {
    parser: {
      state: TokenParserState
      key: string | number | undefined
      mode: TokenParserMode
      stack: StackElement[]
    }
    tokenizer: ParsedTokenInfo
  }): void {
    if (this.activePath !== this.getPathFromStack(stack, key) || this.activePath.length === 0) {
      this.activePath = this.getPathFromStack(stack, key)
      !partial && this.completedPaths.push(this.activePath)
      this.onKeyComplete &&
        this.onKeyComplete({
          activePath: this.activePath,
          completedPaths: this.completedPaths
        })
    }

    try {
      const valuePath = this.getPathFromStack(stack, key)
      const lens = lensPath(valuePath)

      if (partial) {
        let currentValue = view(lens, value) ?? ""
        const updatedValue = `${currentValue}${value}`
        const updatedSchemaInstance = set(lens, updatedValue, this.schemaInstance)
        this.schemaInstance = updatedSchemaInstance
      } else {
        const updatedSchemaInstance = set(lens, value, this.schemaInstance)
        this.schemaInstance = updatedSchemaInstance
      }
    } catch (e) {
      console.error(`Error in the json parser onToken handler: token ${token} value ${value}`, e)
    }
  }

  public getSchemaStub<T extends ZodRawShape>(
    schema: SchemaType<T>,
    defaultData?: NestedObject
  ): z.infer<typeof schema> {
    return this.createBlankObject(schema, defaultData) as z.infer<typeof schema>
  }

  /**
   * Parses the JSON stream.
   *
   * @param {Object} opts - The options for parsing the JSON stream.
   * @returns A `TransformStream` that can be used to process the JSON data.
   */
  public parse(
    opts: {
      stringBufferSize?: number
      handleUnescapedNewLines?: boolean
    } = { stringBufferSize: 0, handleUnescapedNewLines: true }
  ) {
    const textEncoder = new TextEncoder()
    const parser = new JSONParser({
      stringBufferSize: opts.stringBufferSize ?? 0,
      handleUnescapedNewLines: opts.handleUnescapedNewLines ?? true
    })

    parser.onToken = this.handleToken.bind(this)
    parser.onValue = () => void 0

    const stream = new TransformStream({
      transform: async (chunk, controller): Promise<void> => {
        try {
          parser.write(chunk)
          controller.enqueue(textEncoder.encode(JSON.stringify(this.schemaInstance)))
        } catch (e) {
          console.error(`Error in the json parser transform stream: parsing chunk`, e, chunk)
        }
      },
      flush: () => {
        this.onKeyComplete &&
          this.onKeyComplete({
            completedPaths: this.completedPaths,
            activePath: []
          })

        this.activePath = []
      }
    })

    return stream
  }
}
