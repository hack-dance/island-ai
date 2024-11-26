import { SchemaStream } from "@/utils/streaming-json-parser"
import { describe, expect, test } from "bun:test"
import { lensPath, view } from "ramda"
import { z, ZodObject, ZodRawShape } from "zod"
import type { ZodIssue } from "zod"

const checkPathValue = (obj: object, path: (string | number)[]) => {
  const lens = lensPath(path)
  const value = view(lens, obj)

  //should check against schema type
  return !!value
}

async function runTest<T extends ZodRawShape>(schema: ZodObject<T>, jsonData: object) {
  let completed: (string | number)[][] = []
  let errors: ZodIssue[] = []

  const parser = new SchemaStream(schema, {
    onKeyComplete({ completedPaths }) {
      completed = completedPaths as (string | number)[][]
    }
  })

  const stream = parser.parse({
    onSchemaInvalid: zodError => {
      errors = zodError.errors
    }
  })

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

  return { result: JSON.parse(decoder.decode(result)), errors, completed }
}

describe("schema stream types", () => {
  test("primitive types validate correctly", async () => {
    const schema = z.object({
      someString: z.string(),
      someNumber: z.number(),
      someBoolean: z.boolean(),
      someObject: z.object({
        someString: z.string()
      }),
      someArray: z.array(z.string())
    })

    const data = {
      someString: "default string",
      someNumber: 420,
      someBoolean: true,
      someObject: {
        someString: "default string"
      },
      someArray: ["a"]
    }

    const { result } = await runTest(schema, data)

    expect(result).toEqual(data)
  })

  test("zod with no explicit defaults", async () => {
    const schema = z.object({
      someString: z.string(),
      someNumber: z.number(),
      someBoolean: z.boolean(),
      someEnum: z.enum(["a", "b", "c"]),
      someObject: z.object({
        someString: z.string()
      }),
      someArray: z.array(z.string())
    })

    const data = {}

    const { result, completed } = await runTest(schema, data)

    expect(result).toEqual({
      someString: null,
      someNumber: null,
      someBoolean: null,
      someEnum: null,
      someObject: {
        someString: null
      },
      someArray: []
    })

    completed.forEach(path => {
      expect(checkPathValue(data, path)).toBe(true)
    })
  })

  test("zod optionals", async () => {
    const schema = z.object({
      someString: z.string().optional(),
      someNumber: z.number().optional(),
      someBoolean: z.boolean().optional(),
      someEnum: z.enum(["a", "b", "c"]).optional(),
      someObject: z
        .object({
          someString: z.string().optional()
        })
        .optional(),
      someArray: z.array(z.string())
    })

    const data = {}

    const { result, completed } = await runTest(schema, data)

    expect(result).toEqual({
      someString: null,
      someNumber: null,
      someBoolean: null,
      someEnum: null,
      someObject: {
        someString: null
      },
      someArray: []
    })

    completed.forEach(path => {
      expect(checkPathValue(data, path)).toBe(true)
    })
  })

  test("zod with explicit defaults", async () => {
    const schema = z.object({
      someString: z.string().default("test"),
      someNumber: z.number().default(420),
      someBoolean: z.boolean().default(true),
      someEnum: z.enum(["a", "b", "c"]).default("a"),
      someObject: z
        .object({
          someString: z.string()
        })
        .default({ someString: "default string" }),
      someArray: z.array(z.string()).default(["a", "b", "c"])
    })

    const data = {}

    const { result, completed } = await runTest(schema, data)

    expect(result).toEqual({
      someString: "test",
      someNumber: 420,
      someBoolean: true,
      someEnum: "a",
      someObject: {
        someString: "default string"
      },
      someArray: ["a", "b", "c"]
    })

    completed.forEach(path => {
      expect(checkPathValue(data, path)).toBe(true)
    })
  })

  test("zod with incorrect schema", async () => {
    const schema = z
      .object({
        someString: z.string().default("test"),
        someNumber: z.number().default(420)
      })
      .strict()

    const data = {
      cats: 48
    }

    const { errors } = await runTest(schema, data)
    expect(errors).not.toBeEmpty()
  })
})
