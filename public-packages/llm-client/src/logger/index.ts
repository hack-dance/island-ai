import type { LogLevel, LogTransport } from "@/types"

export default class ProviderLogger {
  private _transports: LogTransport[] = []
  private _prefix: string

  constructor(prefix?: string) {
    this._prefix = prefix ?? ""
  }

  public log(logLevel: LogLevel, message: string | Error) {
    this._logToTransports(logLevel, this._prefix, message)
  }

  public debug(message: string) {
    this._logToTransports("debug", this._prefix, message)
  }

  public info(message: string) {
    this._logToTransports("info", this._prefix, message)
  }

  public warn(message: string) {
    this._logToTransports("warn", this._prefix, message)
  }

  public error(message: string | Error) {
    this._logToTransports("error", this._prefix, message)
  }

  public addTransport(transport: LogTransport) {
    this._transports.push(transport)

    return () => {
      this._transports.splice(this._transports.indexOf(transport), 1)
    }
  }

  private _logToTransports(level: LogLevel, prefix: string, message: string | Error) {
    const timestamp = new Date().toTimeString().split(" ")[0]

    for (const transport of this._transports) {
      transport(level, message, timestamp, prefix)
    }
  }
}
