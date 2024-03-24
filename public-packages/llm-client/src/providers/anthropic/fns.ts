interface FunctionCall {
  functionName: string
  args: Record<string, unknown>
}

export function extractFunctionCalls(text: string): Array<FunctionCall> {
  const functionCalls: FunctionCall[] = []
  const invokeRegex = /<invoke>(.*)/gs
  const matches = text.match(invokeRegex)

  if (matches) {
    for (const match of matches) {
      const invokeXml = match.slice(8)
      const functionNameRegex = /<tool_name>(.*?)<\/tool_name>/
      const functionNameMatch = invokeXml.match(functionNameRegex)
      const functionName = functionNameMatch ? functionNameMatch[1] : ""

      const parameterRegex = /<parameters>(.*)/s
      const parameterMatch = invokeXml.match(parameterRegex)
      const parameterXml = parameterMatch ? parameterMatch[1] : ""

      const parameterPattern = /<(.*?)>(.*?)<\/\1>/gs
      const parameters: Record<string, unknown> = {}

      let paramMatch
      while ((paramMatch = parameterPattern.exec(parameterXml)) !== null) {
        const parameterName = paramMatch[1]
        const parameterValue = paramMatch[2]
        parameters[parameterName] = parameterValue
      }

      const existingFunctionCall = functionCalls.find(fc => fc.functionName === functionName)
      if (existingFunctionCall) {
        existingFunctionCall.args = {
          ...existingFunctionCall.args,
          ...parameters
        }
      } else {
        functionCalls.push({ functionName, args: parameters })
      }
    }
  }

  return functionCalls
}

export function formatFunctionResults(functionName: string, result: string): string {
  return `<function_results>
    <result>
      <tool_name>${functionName}</tool_name>
      <stdout>${result}</stdout>
    </result>
  </function_results>`
}
