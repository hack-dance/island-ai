<div align="center">
  <h1>schema-stream</h1>
</div>
<br />

<p align="center"><i>> Type-safe JSON streaming parser with progressive data access</i></p>
<br />

<div align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/schema-stream">
    <img alt="schema-stream" src="https://img.shields.io/npm/v/schema-stream.svg?style=flat-square&logo=npm&labelColor=000000&label=schema-stream">
  </a>
   <a aria-label="Island AI" href="https://github.com/hack-dance/island-ai">
    <img alt="Island AI" src="https://img.shields.io/badge/Part of Island AI-000000.svg?style=flat-square&labelColor=000000&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMTQuNjkgMjU5LjI0Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjZmZmOwogICAgICAgIHN0cm9rZS13aWR0aDogMHB4OwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTEwMC42MSwxNzguNDVoMTMuOTd2LTE5LjYyaC0xMy45N3YxOS42MlptMC0xMDguOTZ2MjMuNzJoMTMuOTd2LTIzLjcyaC0xMy45N1ptLTIuNzksMTg5Ljc1aDE5LjU2bC0yLjc5LTI4LjkyaC0xMy45N2wtMi43OSwyOC45MlptMi43OS0xMzcuNjJoMTMuOTd2LTE5LjYyaC0xMy45N3YxOS42MlptMCwyOC40MWgxMy45N3YtMTkuNjJoLTEzLjk3djE5LjYyWiIvPgogICAgICAgIDxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iOTQuNSIgY3k9IjY5LjExIiByPSIxNC4yNCIvPgogICAgICAgIDxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iMTIwLjE5IiBjeT0iNjkuMTEiIHI9IjE0LjI0Ii8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtMjE0LjI1LDYyLjU5Yy0uNzktLjc1LTE4Ljc1LTE3LjQ4LTQ5LjQ2LTE5LjA0bDE1Ljc1LTUuODhjLTEuNjctMi40Ni00LjAxLTQuMTgtNi4zNS02LS4yMy0uMTgtLjAzLS41OC4yMy0uNTcsMy40NS4xNyw2LjgyLDEuNzUsMTAuMTIsMi42OCwxLjA2LjMsMi4wOS43MiwzLjA4LDEuMjRsMTkuNDUtNy4yNmMuNTMtLjIuOS0uNzEuOTEtMS4yOHMtLjMyLTEuMDktLjg1LTEuMzJjLTEuMDQtLjQ0LTI1Ljk2LTEwLjc2LTU3LjM1Ljk2LTEuMTkuNDQtMi4zNy45MS0zLjU0LDEuNDFsMTMuNTEtMTMuMTNjLTIuMTgtLjY3LTQuNC0uOTUtNi42My0xLjQ0LS4zOC0uMDgtLjQxLS43NSwwLS44MSwzLjEyLS40NCw2LjU0LS45OCw5Ljg3LS45MWw5LjEzLTguODdjLjQxLS40LjUzLTEuMDEuMzItMS41My0uMjItLjUzLS44LS43OS0xLjMxLS44Ny0uOTYuMDEtMjMuNy40OS00My45NiwyMC4xOCwwLDAsMCwwLDAsMGwtMjAuMDcsMTkuNzYtMTkuNTgtMTkuNzZDNjcuMjUuNDksNDQuNTEuMDEsNDMuNTUsMGMtLjU2LjA1LTEuMDkuMzQtMS4zMS44Ny0uMjIuNTMtLjA5LDEuMTQuMzIsMS41M2w1LjY3LDUuNTFjNS4xLjIyLDEwLjE0LjcxLDE0LjQzLDQsLjQyLjMyLjIsMS4xMi0uMzkuOTMtMi41OC0uODYtNi4wMi0uODctOS4zOS0uNGwxNS41NiwxNS4xMmMtMS4xNy0uNS0yLjM2LS45Ny0zLjU0LTEuNDEtMzEuNC0xMS43Mi01Ni4zLTEuNDEtNTcuMzUtLjk2LS41Mi4yMi0uODYuNzUtLjg1LDEuMzJzLjM3LDEuMDguOTEsMS4yOGwxMS4wNiw0LjEzYzQuNDYtMS40OCw4LjctMi4zOSwxMC40Mi0yLjU1LjU3LS4wNS41Ni43My4xMi45MS0xLjg2Ljc0LTMuNjEsMi4yOS01LjI3LDMuNjFsMjUuOTQsOS42OEMxOS4xOCw0NS4xMSwxLjIyLDYxLjg0LjQzLDYyLjU5Yy0uNDEuMzktLjU1LDEtLjM0LDEuNTMuMjEuNTMuNzMuODgsMS4zLjg4aDEzLjljLjE1LS4wOS4zMS0uMTkuNDUtLjI4LDUuNzktMy41OCwxMS45NC02LjE5LDE4LjE4LTguODcuNjgtLjI5LDEuMjguNjQuNiwxLjAzLTMuNTQsMi4wMy02LjU0LDUuMS05LjQ5LDguMTNoMTQuNTljNC4yNy0zLjExLDguODItNS43LDEzLjE2LTguNy41OS0uNDEsMS4yMi40OS43NS45Ny0yLjM1LDIuMzgtNC40NCw1LjA2LTYuNTMsNy43NGgxMTYuODNjLS45OS0zLjE5LTIuMDItNi4zNS00LjEzLTkuMDQtLjMzLS40Mi4xOC0uOTYuNTktLjU5LDMuMzYsMy4wMSw3LjM3LDYuMTUsMTEuMDIsOS42M2gxNS4zNGMtMS4zOC0zLjUyLTMuMDUtNi44Mi01LjcxLTguNjctLjU0LS4zNy0uMDgtMS4xNS41MS0uODcsNC40LDIuMDgsOC4yNyw1Ljg2LDExLjY1LDkuNTRoMjAuMmMuNTcsMCwxLjA5LS4zNSwxLjMtLjg4LjIxLS41My4wOC0xLjE0LS4zNC0xLjUzWiIvPgogICAgICA8L2c+CiAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTEwMS4wNiwyMjEuMzNoMTMuOTd2LTMzLjZoLTEzLjk3djMzLjZaIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=">
  </a>
  <a aria-label="Made by hack.dance" href="https://hack.dance">
    <img alt="docs" src="https://img.shields.io/badge/MADE%20BY%20HACK.DANCE-000000.svg?style=flat-square&labelColor=000000">
  </a>
  <a aria-label="Twitter" href="https://twitter.com/dimitrikennedy">
    <img alt="follow" src="https://img.shields.io/twitter/follow/dimitrikennedy?style=social&labelColor=000000">
  </a>
</div>

`schema-stream` is a foundational streaming JSON parser that emits schema-shaped partial values as JSON arrives. It uses Zod schemas to derive typed stubs and path metadata, but intentionally leaves validation to the consumer.

## Key Features

- 🔄 Stream JSON data with immediate access to partial results
- 🔑 Path completion tracking for complex objects
- 📝 Default value support via schema or explicit defaults
- 🌳 Deep nested object and array support
- ⚡ Zero dependencies except Zod
- 🔍 TypeScript types inferred from schema
- 🔌 Direct async iteration over Web streams and async iterables

## Zod compatibility

- Zod 4 Classic and Zod Mini: `zod@^4.0.0`
- Zod 3: `zod@^3.25.0`

Zod 3.25 is the minimum supported v3 release because it provides the permanent `zod/v3` and `zod/v4/core` compatibility subpaths used by library tooling. `schema-stream` traverses Zod 4 through the documented Core definition contract and keeps its Zod 3 adapter isolated for compatibility.

SDK adapters are structural and add no runtime dependency or peer requirement. Release fixtures compile against `@openai/agents@0.13.1` and the latest stable AI SDK 7 release, `ai@7.0.19`, in a clean packed consumer.

Schema-derived stubs cover objects, arrays, records, strings, numbers, booleans, enums, defaults, prefaults, optionals, nullables, readonly/catch wrappers, lazy schemas, and transform/pipe inputs. Ambiguous or non-JSON schema nodes such as unions, intersections, maps, sets, dates, and custom schemas start as `null`; streamed JSON still replaces those placeholders normally. Completion callbacks report completed scalar leaf paths, including array indexes, and emit one final callback with an empty `activePath` when the input closes.

## Installation

```bash
# npm
npm install schema-stream zod

# pnpm
pnpm add schema-stream zod

# bun
bun add schema-stream zod
```

## Basic Usage

```typescript
import { SchemaStream, type SchemaStreamChunk } from "schema-stream"
import { z } from "zod"

// Define your schema
const schema = z.object({
  users: z.array(
    z.object({
      name: z.string(),
      age: z.number()
    })
  ),
  metadata: z.object({
    total: z.number(),
    page: z.number()
  })
})

// Create parser with optional defaults
const parser = new SchemaStream(schema, {
  defaultData: {
    metadata: { total: 0, page: 1 }
  },
  onKeyComplete({ completedPaths }) {
    console.log("Completed:", completedPaths)
  }
})

// Consume string or Uint8Array chunks with backpressure.
for await (const partial of parser.iterate(response.body)) {
  // partial is SchemaStreamChunk<typeof schema> and is safe to retain or mutate;
  // every emission is an independent snapshot.
  console.log(partial)
}
```

`iterate()` accepts `ReadableStream<string | Uint8Array>` and `AsyncIterable<string | Uint8Array>`. Source errors and parser errors reject iteration. Ending iteration early cancels a Web stream or calls `return()` on an async iterator.

### OpenAI Agents SDK

The Agents SDK text stream can be passed directly to `iterate()` without stream casts, manual readers, decoding, or `JSON.parse`:

```typescript
import { Agent, run } from "@openai/agents"
import { SchemaStream } from "schema-stream"
import { z } from "zod"

const outputSchema = z.object({
  summary: z.string(),
  details: z.object({ score: z.number() }),
  tags: z.array(z.string())
})

const agent = new Agent({
  name: "Analyst",
  model: "gpt-5.5",
  instructions: "Return a structured analysis.",
  outputType: outputSchema
})
const result = await run(agent, input, { stream: true })
const parser = new SchemaStream(outputSchema)

for await (const partial of parser.iterate(result.toTextStream())) {
  renderProgress(partial)
}

await result.completed
const finalOutput = result.finalOutput
```

Use SchemaStream chunks for progressive UX. After `completed` resolves, `finalOutput` is the Agents SDK's authoritative, schema-validated result and may be `undefined` if the run did not produce a final output.

### Vercel AI SDK 7

Pass `streamText().textStream` to SchemaStream to retain schema-derived stubs and fine-grained nested and in-progress string updates from the raw JSON text:

```typescript
import { Output, streamText } from "ai"
import { SchemaStream } from "schema-stream"
import { z } from "zod"

const outputSchema = z.object({
  summary: z.string(),
  details: z.object({ score: z.number() }),
  tags: z.array(z.string())
})

const result = streamText({
  model: "openai/gpt-5.5",
  output: Output.object({ schema: outputSchema }),
  prompt: input
})
const parser = new SchemaStream(outputSchema)

for await (const partial of parser.iterate(result.textStream)) {
  renderProgress(partial)
}

const finalOutput = await result.output
```

AI SDK's `partialOutputStream` is useful when its partial-object semantics are sufficient. SchemaStream intentionally consumes the raw `textStream`, so it can emit schema-shaped defaults and updates inside incomplete strings and nested values on each text chunk. `result.output` remains the authoritative final, AI SDK-validated value.

### Low-level byte transform

`parse()` remains available for stream pipelines that need serialized JSON snapshots:

```typescript
const transform = parser.parse()
const readable = response.body.pipeThrough(transform)

for await (const bytes of readable) {
  const partial = JSON.parse(new TextDecoder().decode(bytes)) as SchemaStreamChunk<typeof schema>
  console.log(partial)
}
```

## Validation and Error Handling

`schema-stream` focuses solely on streaming JSON parsing with type stubs - it intentionally does not perform full Zod schema validation during parsing. This design choice enables:

1. Faster parsing without validation overhead
2. Immediate access to partial data
3. Flexibility for downstream validation

For full schema validation and error handling, consider using:

- [`zod-stream`](https://www.npmjs.com/package/zod-stream): Adds validation, OpenAI integration, and structured error handling
- [`instructor`](https://www.npmjs.com/package/@instructor-ai/instructor): Complete solution for validated LLM extraction

Example of `schema-stream` being used by `zod-stream`:

```typescript
const streamParser = new SchemaStream(response_model.schema, {
  typeDefaults: {
    string: null,
    number: null,
    boolean: null
  },
  onKeyComplete: ({ activePath, completedPaths }) => {
    _activePath = activePath;
    _completedPaths = completedPaths;
  }
});

// Create parser with validation stream
const parser = streamParser.parse({
  handleUnescapedNewLines: true
});

// Add validation in transform stream
const validationStream = new TransformStream({
  transform: async (chunk, controller) => {
    try {
      const parsedChunk = JSON.parse(decoder.decode(chunk));
      const validation = await schema.safeParseAsync(parsedChunk);
      
      controller.enqueue(encoder.encode(JSON.stringify({
        ...parsedChunk,
        _meta: {
          _isValid: validation.success,
          _activePath,
          _completedPaths
        }
      })));
    } catch (e) {
      controller.error(e);
    }
  }
});

// Chain streams
stream
  .pipeThrough(parser)
  .pipeThrough(validationStream);
```

## Real-World Examples

### Progressive UI Updates

```typescript
const schema = z.object({
  analysis: z.object({
    sentiment: z.string(),
    keywords: z.array(z.string()),
    summary: z.string()
  }),
  metadata: z.object({
    processedAt: z.string(),
    wordCount: z.number()
  })
});

const parser = new SchemaStream(schema, {
  // Show loading states initially
  defaultData: {
    analysis: {
      sentiment: "analyzing...",
      keywords: ["loading..."],
      summary: "generating summary..."
    }
  },
  onKeyComplete({ activePath, completedPaths }) {
    // Update UI loading states based on completion
    updateLoadingStates(activePath, completedPaths);
  }
});
```

### Nested Data Processing

```typescript
const schema = z.object({
  users: z.array(z.object({
    id: z.string(),
    profile: z.object({
      name: z.string(),
      email: z.string(),
      preferences: z.object({
        theme: z.string(),
        notifications: z.boolean()
      })
    }),
    activity: z.array(z.object({
      timestamp: z.string(),
      action: z.string()
    }))
  }))
});

const parser = new SchemaStream(schema, {
  onKeyComplete({ activePath }) {
    const path = activePath.join('.');

    // Process a profile when its final field completes
    if (path.match(/users\.\d+\.profile\.email$/)) {
      processUserProfile(/* ... */);
    }

    // Process an activity item when its final field completes
    if (path.match(/users\.\d+\.activity\.\d+\.action$/)) {
      batchActivityLog(/* ... */);
    }
  }
});
```

## API Reference

### `SchemaStream`

```typescript
class SchemaStream<TSchema extends ZodObjectSchema> {
  constructor(schema: TSchema, options?: SchemaStreamOptions<TSchema>)

  // Create a stub instance of the schema with defaults
  getSchemaStub<TStubSchema extends ZodObjectSchema>(
    schema: TStubSchema,
    defaultData?: SchemaStreamDefaultData<TStubSchema>
  ): SchemaStreamChunk<TStubSchema>

  // Parse streaming JSON data
  parse(options?: {
    stringBufferSize?: number
    handleUnescapedNewLines?: boolean
  }): TransformStream<Uint8Array, Uint8Array>

  // Iterate typed snapshots from SDK or application streams
  iterate<TChunk extends string | Uint8Array>(
    source: ReadableStream<TChunk> | AsyncIterable<TChunk>,
    options?: {
      stringBufferSize?: number
      handleUnescapedNewLines?: boolean
    }
  ): AsyncGenerator<SchemaStreamChunk<TSchema>, void, void>
}
```

`SchemaStreamChunk<TSchema>` is recursively partial and includes `null` at primitive leaves because schema stubs and in-flight JSON are not necessarily valid schema outputs. It is based on the schema input type so transforms and codecs are represented honestly. Validate the completed value with `schema.parse` or `schema.safeParse` to obtain the schema output type.

### Constructor Options

- `schema`: Zod schema defining the structure of your data
- `options`:
  - `defaultData`: Initial values for schema properties
  - `typeDefaults`: Default values for primitive types
  - `onKeyComplete`: Callback for tracking parsing progress

## Working with Defaults

There are two ways to provide default values in schema-stream:

### 1. Via Zod Schema

```typescript
const schema = z.object({
  // Default via schema
  count: z.number().default(0),
  status: z.string().default('pending'),
  settings: z.object({
    enabled: z.boolean().default(true)
  }),
  tags: z.array(z.string()).default(['default'])
});

const parser = new SchemaStream(schema);
```

### 2. Via Constructor Options

```typescript
// Global type defaults
const parser = new SchemaStream(schema, {
  typeDefaults: {
    string: "",      // Default for all strings
    number: 0,       // Default for all numbers
    boolean: false   // Default for all booleans
  }
});

// Specific property defaults
const parser = new SchemaStream(schema, {
  defaultData: {
    count: 100,
    status: 'ready',
    settings: {
      enabled: true
    }
  }
});
```

Priority order:

1. Explicit `defaultData` values
2. Zod schema defaults
3. Global `typeDefaults`
4. `null` (if no other default is found)

### Completion Tracking

Track the progress of parsing with path information:

```typescript
const parser = new SchemaStream(schema, {
  onKeyComplete({ activePath, completedPaths }) {
    // activePath: Current path being processed
    // completedPaths: Array of all completed paths
    console.log('Currently parsing:', activePath);
    console.log('Completed paths:', completedPaths);
  }
});
```

### Parse Options

- `stringBufferSize`: Size of the buffer for string values (default: 0)
- `handleUnescapedNewLines`: Handle unescaped newlines in JSON (default: true)

### Schema Stub Utility

Create a typed stub of your schema with defaults:

```typescript
const schema = z.object({
  users: z.array(z.object({
    name: z.string(),
    age: z.number()
  }))
});

const parser = new SchemaStream(schema);
const stub = parser.getSchemaStub(schema, {
  users: [{ name: "default", age: 0 }]
});
// stub is typed as SchemaStreamChunk<typeof schema>
```

## Integration with Island AI

`schema-stream` is designed as a foundational package that other tools build upon:

- [`zod-stream`](https://www.npmjs.com/package/zod-stream): Adds Zod 4 validation, native JSON Schema conversion, and OpenAI integration. Use `schema-stream` directly when a Zod 3 boundary is required.

  ```typescript
  // Example of zod-stream using schema-stream
  const zodStream = new ZodStream();
  const extraction = await zodStream.create({
    completionPromise: stream,
    response_model: { 
      schema: yourSchema,
      name: "Extract" 
    }
  });
  ```

- [`instructor`](https://www.npmjs.com/package/@instructor-ai/instructor): High-level extraction

  ```typescript
  const client = Instructor({
    client: oai,
    mode: "TOOLS"
  });
  
  const result = await client.chat.completions.create({
    response_model: { schema: yourSchema }
    // ...
  });
  ```

- [`stream-hooks`](https://www.npmjs.com/package/stream-hooks): React hooks for JSON streams
- [`llm-polyglot`](https://www.npmjs.com/package/llm-polyglot): Universal LLM client
- [`evalz`](https://www.npmjs.com/package/evalz): LLM output evaluation

## Contributing

We welcome contributions! Check out:

- [Island AI Documentation](https://island.hack.dance)
- [GitHub Issues](https://github.com/hack-dance/island-ai/issues)
- [Twitter](https://twitter.com/dimitrikennedy)

> Credits: Internal JSON parser logic adapted from [streamparser-json](https://github.com/juanjoDiaz/streamparser-json).

## License

MIT © [hack.dance](https://hack.dance)
