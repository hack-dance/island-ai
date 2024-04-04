import { JSONSchema7 } from "json-schema"

export type JSONSchema7Object = JSONSchema7["properties"] & {
  properties: JSONSchema7["properties"]
}

export type JSONSchema7Array = JSONSchema7 & {
  items: JSONSchema7["items"]
}

export type JSONSchema7Definition = JSONSchema7Object | JSONSchema7Array | JSONSchema7 | boolean

function isJSONSchema7(schema?: JSONSchema7Definition): schema is JSONSchema7 {
  return (
    typeof schema === "object" && schema !== null && schema !== undefined && !Array.isArray(schema)
  )
}

type FunctionCall = {
  functionName: string
  args: Record<string, unknown>
}

export class FunctionCallExtractor {
  private functionCalls: FunctionCall[] = []
  private buffer: string = ""
  private currentFunctionName: string | undefined
  private currentArgs: Record<string, unknown> = {}
  // private isInInvokeBlock: boolean = false
  private currentParameterName: string | undefined
  private schema?: JSONSchema7Object

  constructor(schema?: JSONSchema7Object) {
    this.schema = schema
  }

  extractFunctionCalls(chunk: string): FunctionCall[] {
    this.buffer += chunk
    this.processFunctionCalls()
    const extractedCalls = this.functionCalls
    this.functionCalls = []

    return extractedCalls
  }

  private processFunctionCalls() {
    //TODO: need to start processing before we get to the end of this block
    const invokeRegex = /<invoke>([\s\S]*?)<\/invoke>/g
    let invokeMatch

    while ((invokeMatch = invokeRegex.exec(this.buffer))) {
      const invokeBlock = invokeMatch[1]
      this.processInvokeBlock(invokeBlock)
    }
  }

  private processInvokeBlock(invokeBlock: string) {
    const toolNameMatch = /<tool_name>(.*?)<\/tool_name>/.exec(invokeBlock)
    const newFunctionName = toolNameMatch ? toolNameMatch[1] : undefined

    if (this.currentFunctionName !== newFunctionName) {
      // this.finishCurrentFunctionCall()
      this.currentFunctionName = newFunctionName
      this.currentArgs = {}
      // this.isInInvokeBlock = true
      this.currentParameterName = undefined
    }

    const parameterRegex = /<(\w+)>([\s\S]*?)<\/\1>/g
    let paramMatch

    while ((paramMatch = parameterRegex.exec(invokeBlock))) {
      const [_, paramName, paramValue] = paramMatch
      this.processParameter(paramName, paramValue)
    }

    // this.isInInvokeBlock = false
    this.finishCurrentFunctionCall()
  }

  private processParameter(paramName: string, paramValue: string) {
    if (!this.currentFunctionName) return

    if (this.currentParameterName !== paramName) {
      this.finishCurrentParameter()
      this.currentParameterName = paramName
    }

    if (paramName === "parameters") {
      const args = this.parseParameters(paramValue)
      this.currentArgs = args
    }
  }

  private finishCurrentParameter() {
    if (this.currentParameterName) {
      this.currentParameterName = undefined
    }
  }

  private updateFunctions() {
    if (this.currentFunctionName) {
      const existingFunctionCall = this.functionCalls.find(
        call => call.functionName === this.currentFunctionName
      )

      if (existingFunctionCall) {
        existingFunctionCall.args = {
          ...existingFunctionCall.args,
          ...this.currentArgs
        }
      } else {
        this.functionCalls.push({
          functionName: this.currentFunctionName,
          args: this.currentArgs
        })
      }
    }
  }

  private finishCurrentFunctionCall() {
    this.updateFunctions()
    this.currentFunctionName = undefined
    this.currentArgs = {}
    this.currentParameterName = undefined
  }

  private parseParameters(
    parametersBlock: string,
    schema: JSONSchema7Definition | undefined = this.schema
  ): Record<string, unknown> {
    const args: Record<string, unknown> = {}
    const parameterRegex = /<(\w+)>([\s\S]*?)<\/\1>/g

    let paramMatch

    while ((paramMatch = parameterRegex.exec(parametersBlock))) {
      const [_, paramName, paramValueRaw] = paramMatch
      const paramValue = cleanRawFunctionArgs(paramValueRaw)

      if (isJSONSchema7(schema)) {
        if (schema.properties && schema.properties[paramName]) {
          const propertySchema = schema.properties[paramName]
          if (isJSONSchema7(propertySchema)) {
            if (propertySchema.type === "array") {
              args[paramName] = this.parseArrayParameter(
                paramValue,
                propertySchema as JSONSchema7Array
              )
            } else if (propertySchema.type === "object") {
              args[paramName] = this.parseParameters(
                paramValue,
                propertySchema as JSONSchema7Object
              )
            } else if (propertySchema.type === "number") {
              args[paramName] = parseFloat(`${paramValue}`) ?? paramValue
            } else {
              args[paramName] = paramValue
            }
          }
        } else {
          args[paramName] = paramValue
        }
      }

      this.currentArgs = args
    }

    return args
  }

  private parseArrayParameter(parameterBlock: string, schema: JSONSchema7Array): unknown[] {
    const arrayItems: unknown[] = []
    const itemSchema = Array.isArray(schema.items) ? schema.items[0] : schema.items
    const tagRegex = /<([^>]+)>([\s\S]*?)<\/\1>/g
    let itemMatch

    while ((itemMatch = tagRegex.exec(parameterBlock))) {
      const [_, _tagName, itemValue] = itemMatch
      if (isJSONSchema7(itemSchema) && itemSchema.type === "object") {
        arrayItems.push(this.parseParameters(itemValue, itemSchema as JSONSchema7Object))
      } else {
        arrayItems.push(itemValue)
      }
    }

    return arrayItems
  }
}

function renderObjectSchema(schema: JSONSchema7Object, indent: number): string {
  const indentStr = "  ".repeat(indent)
  const properties = schema.properties || {}
  const propertyXML = Object.entries(properties)
    .map(([name, propertySchema]) => {
      if (typeof propertySchema === "boolean") return ""
      return `${indentStr}<parameter>\n${indentStr} <name>${name}</name>\n${renderParameter(propertySchema, indent + 2)}\n${indentStr}</parameter>`
    })
    .join("\n")

  return `${indentStr}<type>object</type>\n<properties>${propertyXML}</properties>`
}

function renderArraySchema(schema: JSONSchema7Array, indent: number): string {
  const indentStr = "  ".repeat(indent)
  const items = Array.isArray(schema.items) ? schema.items : [schema.items]
  const firstItemSchema = items[0] || {}

  return `${indentStr}<type>array</type><description>${schema?.description ?? " "}</description>\n${indentStr}<$INDEX>\n${renderParameter(firstItemSchema as JSONSchema7, indent + 2)}\n${indentStr}</$INDEX>`
}

function renderBasicSchema(schema: JSONSchema7 | boolean, indent: number): string {
  const indentStr = "  ".repeat(indent)
  if (typeof schema === "boolean") {
    return `${indentStr}<type>boolean</type>`
  }

  return `${indentStr}<type>${schema.type}</type>\n${schema.description ? `${indentStr}<description>${schema.description}</description>` : ""}`
}

export function renderParameter(schema?: JSONSchema7, indent = 0): string {
  if (typeof schema === "object" && schema !== null) {
    if ("properties" in schema && schema.properties !== undefined) {
      return renderObjectSchema(schema as JSONSchema7Object, indent)
    } else if ("items" in schema) {
      return renderArraySchema(schema as JSONSchema7Array, indent)
    }
  }

  return renderBasicSchema(schema as JSONSchema7 | boolean, indent)
}

export function formatFunctionResults(functionName: string, result: string): string {
  return `<function_results>
    <result>
      <tool_name>${functionName}</tool_name>
      <stdout>${result}</stdout>
    </result>
  </function_results>`
}

export function cleanRawFunctionArgs(rawArgs: string): string {
  // remove control characters
  const cleanedArgs = rawArgs.replace(/[\x00-\x1F\x7F-\x9F]/g, "")

  return cleanedArgs
}
