import { LogTransport } from "@/types"

export const consoleTransport: LogTransport = (level, message, timestamp, prefix) => {
  const log = {
    ["debug"]: console.debug,
    ["info"]: console.info,
    ["warn"]: console.warn,
    ["error"]: console.error
  }[level]

  log(`LLM-CLIENT--${prefix} ${timestamp}: ${message}`)
}
