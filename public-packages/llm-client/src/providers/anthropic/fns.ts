import { JSONSchema7 } from "json-schema"

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

  private parseParameters(parametersBlock: string): Record<string, unknown> {
    const args: Record<string, unknown> = {}
    const parameterRegex = /<(\w+)>([\s\S]*?)<\/\1>/g
    let paramMatch

    while ((paramMatch = parameterRegex.exec(parametersBlock))) {
      const [_, paramName, paramValue] = paramMatch

      if (paramValue.includes("<")) {
        args[paramName] = this.parseParameters(paramValue)
      } else {
        args[paramName] = paramValue
      }

      this.currentArgs = args
      // this.updateFunctions()
    }

    return args
  }
}

export type JSONSchema7Object = JSONSchema7 & {
  properties?: { [key: string]: JSONSchema7Definition }
}

export type JSONSchema7Array = JSONSchema7 & {
  items: JSONSchema7Definition | JSONSchema7Definition[]
}

export type JSONSchema7Definition = JSONSchema7Object | JSONSchema7Array | JSONSchema7 | boolean

function renderObjectSchema(schema: JSONSchema7Object, indent: number): string {
  const indentStr = "  ".repeat(indent)
  const properties = schema.properties || {}
  const propertyXML = Object.entries(properties)
    .map(
      ([name, propertySchema]) =>
        `${indentStr}<parameter>\n${indentStr}  <name>${name}</name>\n${renderParameter(propertySchema, indent + 2)}\n${indentStr}</parameter>`
    )
    .join("\n")
  return `${indentStr}<type>object</type>\n${propertyXML}`
}

function renderArraySchema(schema: JSONSchema7Array, indent: number): string {
  const indentStr = "  ".repeat(indent)
  const items = Array.isArray(schema.items) ? schema.items : [schema.items]
  const itemsXML = items
    .map(
      itemSchema =>
        `${indentStr}  <item>\n${renderParameter(itemSchema, indent + 2)}\n${indentStr}  </item>`
    )
    .join("\n")
  return `${indentStr}<type>array</type>\n${itemsXML}`
}

function renderBasicSchema(schema: JSONSchema7 | boolean, indent: number): string {
  const indentStr = "  ".repeat(indent)
  if (typeof schema === "boolean") {
    return `${indentStr}<type>boolean</type>`
  }

  return `${indentStr}<type>${schema.type}</type>\n${schema.description ? `${indentStr}<description>${schema.description}</description>` : ""}`
}

export function renderParameter(schema: JSONSchema7Definition, indent = 0): string {
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
