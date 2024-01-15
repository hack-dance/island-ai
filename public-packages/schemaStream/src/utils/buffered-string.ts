/**
 * This file has been modified -  but the majority pulled directly from
 *  https://www.npmjs.com/package/@streamparser/json
 *  https://github.com/juanjoDiaz/streamparser-json
 *
 *  Copyright (c) 2020 Juanjo Diaz
 *  https://github.com/juanjoDiaz
 *
 */

export interface StringBuilder {
  byteLength: number
  appendChar: (char: number) => void
  appendBuf: (buf: Uint8Array, start?: number, end?: number) => void
  reset: () => void
  toString: () => string
}

export class NonBufferedString implements StringBuilder {
  private decoder = new TextDecoder("utf-8")
  private strings: Array<string> = []
  private onIncrementalString?: (str: string) => void

  public byteLength = 0

  constructor({ onIncrementalString }: { onIncrementalString?: (str: string) => void }) {
    this.onIncrementalString = onIncrementalString ?? undefined
  }

  public appendChar(char: number): void {
    this.strings.push(String.fromCharCode(char))
    this.byteLength += 1
    this.update()
  }

  public appendBuf(buf: Uint8Array, start = 0, end: number = buf.length): void {
    this.strings.push(this.decoder.decode(buf.subarray(start, end)))
    this.byteLength += end - start
    this.update()
  }

  private update(): void {
    if (this.onIncrementalString) this.onIncrementalString(this.toString())
  }

  public reset(): void {
    this.strings = []
    this.byteLength = 0
  }

  public toString(): string {
    return this.strings.join("")
  }
}

export class BufferedString implements StringBuilder {
  private decoder = new TextDecoder("utf-8")
  private buffer: Uint8Array
  private bufferOffset = 0
  private string = ""
  private onIncrementalString?: (str: string) => void

  public byteLength = 0

  public constructor(bufferSize: number, onIncrementalString?: (str: string) => void) {
    this.buffer = new Uint8Array(bufferSize)
    this.onIncrementalString = onIncrementalString ?? undefined
  }

  public appendChar(char: number): void {
    if (this.bufferOffset >= this.buffer.length) this.flushStringBuffer()
    this.buffer[this.bufferOffset++] = char
    this.byteLength += 1
  }

  public appendBuf(buf: Uint8Array, start = 0, end: number = buf.length): void {
    const size = end - start
    if (this.bufferOffset + size > this.buffer.length) this.flushStringBuffer()

    this.buffer.set(buf.subarray(start, end), this.bufferOffset)
    this.bufferOffset += size
    this.byteLength += size
  }

  private flushStringBuffer(): void {
    this.string += this.decoder.decode(this.buffer.subarray(0, this.bufferOffset))
    this.bufferOffset = 0
    this.update()
  }

  private update(): void {
    if (this.onIncrementalString) this.onIncrementalString(this.toString())
  }

  public reset(): void {
    this.string = ""
    this.bufferOffset = 0
    this.byteLength = 0
  }
  public toString(): string {
    this.flushStringBuffer()
    return this.string
  }
}
