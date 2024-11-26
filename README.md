<div align="center">
  <img src="https://island.hack.dance/island_light.svg" alt="Island AI" width="200" style="margin: 0 auto 24px; display: block;" />
</div>
<br />

<p align="center"><i>> A TypeScript toolkit for building structured LLM data handling pipelines</i></p>
<br />

<div align="center">
  <a aria-label="Docs" href="https://island.hack.dance">
    <img alt="docs" src="https://img.shields.io/badge/DOCS-000000.svg?style=flat-square&labelColor=000000&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMTQuNjkgMjU5LjI0Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjZmZmOwogICAgICAgIHN0cm9rZS13aWR0aDogMHB4OwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTEwMC42MSwxNzguNDVoMTMuOTd2LTE5LjYyaC0xMy45N3YxOS42MlptMC0xMDguOTZ2MjMuNzJoMTMuOTd2LTIzLjcyaC0xMy45N1ptLTIuNzksMTg5Ljc1aDE5LjU2bC0yLjc5LTI4LjkyaC0xMy45N2wtMi43OSwyOC45MlptMi43OS0xMzcuNjJoMTMuOTd2LTE5LjYyaC0xMy45N3YxOS42MlptMCwyOC40MWgxMy45N3YtMTkuNjJoLTEzLjk3djE5LjYyWiIvPgogICAgICAgIDxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iOTQuNSIgY3k9IjY5LjExIiByPSIxNC4yNCIvPgogICAgICAgIDxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iMTIwLjE5IiBjeT0iNjkuMTEiIHI9IjE0LjI0Ii8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtMjE0LjI1LDYyLjU5Yy0uNzktLjc1LTE4Ljc1LTE3LjQ4LTQ5LjQ2LTE5LjA0bDE1Ljc1LTUuODhjLTEuNjctMi40Ni00LjAxLTQuMTgtNi4zNS02LS4yMy0uMTgtLjAzLS41OC4yMy0uNTcsMy40NS4xNyw2LjgyLDEuNzUsMTAuMTIsMi42OCwxLjA2LjMsMi4wOS43MiwzLjA4LDEuMjRsMTkuNDUtNy4yNmMuNTMtLjIuOS0uNzEuOTEtMS4yOHMtLjMyLTEuMDktLjg1LTEuMzJjLTEuMDQtLjQ0LTI1Ljk2LTEwLjc2LTU3LjM1Ljk2LTEuMTkuNDQtMi4zNy45MS0zLjU0LDEuNDFsMTMuNTEtMTMuMTNjLTIuMTgtLjY3LTQuNC0uOTUtNi42My0xLjQ0LS4zOC0uMDgtLjQxLS43NSwwLS44MSwzLjEyLS40NCw2LjU0LS45OCw5Ljg3LS45MWw5LjEzLTguODdjLjQxLS40LjUzLTEuMDEuMzItMS41My0uMjItLjUzLS44LS43OS0xLjMxLS44Ny0uOTYuMDEtMjMuNy40OS00My45NiwyMC4xOCwwLDAsMCwwLDAsMGwtMjAuMDcsMTkuNzYtMTkuNTgtMTkuNzZDNjcuMjUuNDksNDQuNTEuMDEsNDMuNTUsMGMtLjU2LjA1LTEuMDkuMzQtMS4zMS44Ny0uMjIuNTMtLjA5LDEuMTQuMzIsMS41M2w1LjY3LDUuNTFjNS4xLjIyLDEwLjE0LjcxLDE0LjQzLDQsLjQyLjMyLjIsMS4xMi0uMzkuOTMtMi41OC0uODYtNi4wMi0uODctOS4zOS0uNGwxNS41NiwxNS4xMmMtMS4xNy0uNS0yLjM2LS45Ny0zLjU0LTEuNDEtMzEuNC0xMS43Mi01Ni4zLTEuNDEtNTcuMzUtLjk2LS41Mi4yMi0uODYuNzUtLjg1LDEuMzJzLjM3LDEuMDguOTEsMS4yOGwxMS4wNiw0LjEzYzQuNDYtMS40OCw4LjctMi4zOSwxMC40Mi0yLjU1LjU3LS4wNS41Ni43My4xMi45MS0xLjg2Ljc0LTMuNjEsMi4yOS01LjI3LDMuNjFsMjUuOTQsOS42OEMxOS4xOCw0NS4xMSwxLjIyLDYxLjg0LjQzLDYyLjU5Yy0uNDEuMzktLjU1LDEtLjM0LDEuNTMuMjEuNTMuNzMuODgsMS4zLjg4aDEzLjljLjE1LS4wOS4zMS0uMTkuNDUtLjI4LDUuNzktMy41OCwxMS45NC02LjE5LDE4LjE4LTguODcuNjgtLjI5LDEuMjguNjQuNiwxLjAzLTMuNTQsMi4wMy02LjU0LDUuMS05LjQ5LDguMTNoMTQuNTljNC4yNy0zLjExLDguODItNS43LDEzLjE2LTguNy41OS0uNDEsMS4yMi40OS43NS45Ny0yLjM1LDIuMzgtNC40NCw1LjA2LTYuNTMsNy43NGgxMTYuODNjLS45OS0zLjE5LTIuMDItNi4zNS00LjEzLTkuMDQtLjMzLS40Mi4xOC0uOTYuNTktLjU5LDMuMzYsMy4wMSw3LjM3LDYuMTUsMTEuMDIsOS42M2gxNS4zNGMtMS4zOC0zLjUyLTMuMDUtNi44Mi01LjcxLTguNjctLjU0LS4zNy0uMDgtMS4xNS41MS0uODcsNC40LDIuMDgsOC4yNyw1Ljg2LDExLjY1LDkuNTRoMjAuMmMuNTcsMCwxLjA5LS4zNSwxLjMtLjg4LjIxLS41My4wOC0xLjE0LS4zNC0xLjUzWiIvPgogICAgICA8L2c+CiAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTEwMS4wNiwyMjEuMzNoMTMuOTd2LTMzLjZoLTEzLjk3djMzLjZaIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=">
  </a>
  <a aria-label="NPM version" href="https://twitter.com/dimitrikennedy">
    <img alt="llm-polyglot" src="https://img.shields.io/twitter/follow/dimitrikennedy?style=social&labelColor=000000">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/zod-stream">
    <img alt="zod-stream" src="https://img.shields.io/npm/v/zod-stream.svg?style=flat-square&logo=npm&labelColor=000000&label=zod-stream">
  </a>
    <a aria-label="NPM version" href="https://www.npmjs.com/package/evalz">
    <img alt="evalz" src="https://img.shields.io/npm/v/evalz.svg?style=flat-square&logo=npm&labelColor=000000&label=evalz">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/stream-hooks">
    <img alt="stream-hooks" src="https://img.shields.io/npm/v/stream-hooks.svg?style=flat-square&logo=npm&labelColor=000000&label=stream-hooks">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/schema-stream">
    <img alt="schema-stream" src="https://img.shields.io/npm/v/schema-stream.svg?style=flat-square&logo=npm&labelColor=000000&label=schema-stream">
  </a>
  <a aria-label="Made by hack.dance" href="https://hack.dance">
    <img alt="docs" src="https://img.shields.io/badge/MADE%20BY%20HACK.DANCE-000000.svg?style=flat-square&labelColor=000000">
  </a>

</div>

## Overview

Island AI is a collection of low-level utilities and high-level tools for handling structured data streams from Large Language Models (LLMs). The packages range from basic JSON streaming parsers to complete LLM clients, giving you the flexibility to build custom solutions or use pre-built integrations.

## Core Packages vs Instructor

The core Island AI packages provide low-level utilities for building custom LLM clients and data handling pipelines. For a complete, ready-to-use solution, check out [Instructor](https://github.com/instructor-ai/instructor-js), which composes these tools into a full-featured client.

**When to use core packages:**

- You need direct access to the HTTP stream for custom transport (e.g., not using SSE/WebSockets)
- You want to build a custom LLM client
- You need fine-grained control over streaming and parsing
- You're implementing server-side streaming with client-side parsing

**When to use Instructor:**

- You want a complete solution for structured extraction
- You're using WebSocket-based streaming from server to client
- You're requests are only on the server
- You need the full async generator pattern for progressive object updates
- You want OpenAI SDK compatibility out of the box

## Core Packages

### 1. schema-stream

A foundational streaming JSON parser that enables immediate data access through structured stubs.

**Key Features:**

- Streaming JSON parser with typed outputs
- Default value support
- Path completion tracking
- Nested object and array support

```typescript
import { SchemaStream } from "schema-stream";
import { z } from "zod";

// Define complex nested schemas
const schema = z.object({
  layer1: z.object({
    layer2: z.object({
      value: z.string(),
      layer3: z.object({
        layer4: z.object({
          layer5: z.string()
        })
      })
    })
  }),
  someArray: z.array(z.object({
    someString: z.string(),
    someNumber: z.number()
  }))
});

// Get a readable stream of json (from an api or otherwise)
async function getSomeStreamOfJson(
  jsonString: string
): Promise<{ body: ReadableStream }> {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      const jsonBytes = encoder.encode(jsonString)

      for (let i = 0; i < jsonBytes.length; ) {
        const chunkSize = Math.floor(Math.random() * 5) + 2
        const chunk = jsonBytes.slice(i, i + chunkSize)
        controller.enqueue(chunk)
        i += chunkSize
      }
      controller.close()
    },
  })

  return { body: stream }
}


// Create parser with completion tracking
const parser = new SchemaStream(schema, {
  onKeyComplete({ completedPaths }) {
    console.log('Completed paths:', completedPaths);
  }
});

// Get the readabale stream to parse
const readableStream = await getSomeStreamOfJson(
  `{"someString": "Hello schema-stream", "someNumber": 42000000}`
)

// Parse streaming data
const stream = parser.parse();
readableStream.pipeThrough(stream);

// Get typed results
const reader = stream.readable.getReader();
const decoder = new TextDecoder()
let result = {}
let complete = false

while (true) {
  const { value, done } = await reader.read();
  complete = done
  
  if (complete) break;
  
  result = JSON.parse(decoder.decode(value));
  // result is fully typed based on schema
}
```

### 2. zod-stream

Extends schema-stream with OpenAI integration and Zod-specific features.

**Key Features:**

- OpenAI completion streaming
- Multiple response modes (TOOLS, FUNCTIONS, JSON, etc.)
- Schema validation during streaming

```typescript
import { OAIStream } from "zod-stream";
import { withResponseModel } from "zod-stream";
import { z } from "zod";

// Define extraction schema
const ExtractionSchema = z.object({
  users: z.array(z.object({
    name: z.string(),
    handle: z.string(),
    twitter: z.string()
  })).min(3),
  location: z.string(),
  budget: z.number()
});

// Configure OpenAI params with schema
const params = withResponseModel({
  response_model: { 
    schema: ExtractionSchema, 
    name: "Extract" 
  },
  params: {
    messages: [{ role: "user", content: textBlock }],
    model: "gpt-4"
  },
  mode: "TOOLS"
});

// Stream completions
const stream = OAIStream({ 
  res: await oai.chat.completions.create({
    ...params,
    stream: true
  })
});

// Process results
const client = new ZodStream();
const extractionStream = await client.create({
  completionPromise: () => stream,
  response_model: { 
    schema: ExtractionSchema, 
    name: "Extract" 
  }
});

for await (const data of extractionStream) {
  console.log('Progressive update:', data);
}
```

### 3. stream-hooks

React hooks for consuming streaming JSON data with Zod schema validation.

**Key Features:**

- Ready-to-use React hooks
- Automatic schema validation
- Progress tracking
- Error handling

```typescript
import { useJsonStream } from "stream-hooks";

function DataViewer() {
  const { loading, startStream, data, error } = useJsonStream({
    schema: ExtractionSchema,
    onReceive: (update) => {
      console.log('Progressive update:', update);
    },
  });

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
      <button onClick={() => startStream({
        url: "/api/extract",
        method: "POST",
        body: { text: "..." }
      })}>
        Start Extraction
      </button>
    </div>
  );
}
```

### 4. llm-polyglot

A universal LLM client that extends the OpenAI SDK to provide consistent interfaces across different providers that may not follow the OpenAI API specification.

**Native API Support Status:**

| Provider API | Status | Chat | Basic Stream | Functions/Tool calling | Function streaming | Notes |
|-------------|---------|------|--------------|---------------------|-----------------|--------|
| OpenAI | ✅ | ✅ | ✅ | ✅ | ✅ | Direct SDK proxy |
| Anthropic | ✅ | ✅ | ✅ | ❌ | ❌ | Claude models |
| Google | ✅ | ✅ | ✅ | ✅ | ❌ | Gemini models + context caching |
| Azure | 🚧 | ✅ | ✅ | ❌ | ❌ | OpenAI model hosting |
| Cohere | ❌ | - | - | - | - | Not supported |
| AI21 | ❌ | - | - | - | - | Not supported |

Stream Types:

- **Basic Stream**: Simple text streaming
- **Partial JSON Stream**: Progressive JSON object construction during streaming
- **Function Stream**: Streaming function/tool calls and their results

<br />

**OpenAI-Compatible Hosting Providers:**

These providers use the OpenAI SDK format, so they work directly with the OpenAI client configuration:

| Provider | How to Use | Available Models |
|----------|------------|------------------|
| Together | Use OpenAI client with Together base URL | Mixtral, Llama, OpenChat, Yi, others |
| Anyscale | Use OpenAI client with Anyscale base URL | Mistral, Llama, others |
| Perplexity | Use OpenAI client with Perplexity base URL | pplx-* models |
| Replicate | Use OpenAI client with Replicate base URL | Various open models |

**Key Features:**

- OpenAI-compatible interface for non-OpenAI providers
- Support for major providers:
  - OpenAI (direct SDK proxy)
  - Anthropic (Claude models)
  - Google (Gemini models)
  - Together
  - Microsoft/Azure
  - Anyscale
- Streaming support across providers
- Function/tool calling compatibility
- Context caching for Gemini
- Structured output support

#### Basic OpenAI-Style Usage

```typescript
import { createLLMClient } from "llm-polyglot";

// Create provider-specific client
const anthropicClient = createLLMClient({
  provider: "anthropic"
});

// Use consistent OpenAI-style API
const completion = await anthropicClient.chat.completions.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1000,
  messages: [{ role: "user", content: "Extract data..." }]
});
```

#### Streaming with Different Providers

```typescript
// Anthropic Streaming
const stream = await anthropicClient.chat.completions.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1000,
  stream: true,
  messages: [{ role: "user", content: "Stream some content..." }]
});

let content = "";
for await (const chunk of stream) {
  content += chunk.choices?.[0]?.delta?.content ?? "";
}

// Google/Gemini with Context Caching
const googleClient = createLLMClient({
  provider: "google"
});

// Create a context cache
const cache = await googleClient.cacheManager.create({
  model: "gemini-1.5-flash-8b",
  messages: [{ 
    role: "user", 
    content: "What is the capital of Montana?" 
  }],
  ttlSeconds: 3600, // Cache for 1 hour
  max_tokens: 1000
});

// Use cached context in new completion
const completion = await googleClient.chat.completions.create({
  model: "gemini-1.5-flash-8b",
  messages: [{ 
    role: "user", 
    content: "What state is it in?" 
  }],
  additionalProperties: {
    cacheName: cache.name
  },
  max_tokens: 1000
});
```

#### Function/Tool Calling

```typescript
const completion = await anthropicClient.chat.completions.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1000,
  messages: [{ 
    role: "user", 
    content: "Extract user information..." 
  }],
  tool_choice: {
    type: "function",
    function: { name: "extract_user" }
  },
  tools: [{
    type: "function",
    function: {
      name: "extract_user",
      description: "Extract user information",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" }
        },
        required: ["name", "age"]
      }
    }
  }]
});
```

// Using with OpenAI-compatible providers:

```typescript
const client = createLLMClient({
  provider: "openai",
  apiKey: "your_api_key",
  baseURL: "https://api.together.xyz/v1",  // or other provider URLs
});
```

#### Provider-Specific Features

1. **Anthropic (Claude)**
   - Full function/tool calling support
   - Message streaming
   - OpenAI-compatible responses

2. **Google (Gemini)**
   - Context caching for token optimization
   - Streaming support
   - Function calling
   - Optional OpenAI compatibility mode

3. **OpenAI**
   - Direct SDK proxy
   - All native OpenAI features supported

## Transport Patterns

### Direct HTTP Streaming

For cases where you need direct control over the HTTP stream, you can use the core packages to build your own streaming endpoints:

```typescript
import { OAIStream } from "zod-stream";
import { withResponseModel } from "zod-stream";
import OpenAI from "openai";
import { z } from "zod";

const oai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID
});

// Define your schema
const schema = z.object({
  content: z.string(),
  users: z.array(z.object({
    name: z.string(),
  })),
});

// API Route Example (Next.js)
export async function POST(request: Request) {
  const { messages } = await request.json();

  // Configure OpenAI parameters with schema
  const params = withResponseModel({
    response_model: { 
      schema: schema, 
      name: "Users extraction and message" 
    },
    params: {
      messages,
      model: "gpt-4",
    },
    mode: "TOOLS",
  });

  // Create streaming completion
  const extractionStream = await oai.chat.completions.create({
    ...params,
    stream: true,
  });

  // Return streaming response
  return new Response(
    OAIStream({ res: extractionStream })
  );
}

// Client-side consumption
async function consumeStream() {
  const response = await fetch('/api/extract', {
    method: 'POST',
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Your prompt here' }]
    })
  });

  const parser = new SchemaStream(schema);
  const stream = parser.parse();

  response.body
    ?.pipeThrough(stream)
    .pipeTo(new WritableStream({
      write(chunk) {
        const data = JSON.parse(new TextDecoder().decode(chunk));
        // Use partial data as it arrives
        console.log('Partial data:', data);
      }
    }));
}
```

### Using Instructor

  <a aria-label="NPM version" href="https://www.npmjs.com/package/@instructor-ai/instructor" target="_blank">
    <img alt="schema-stream" src="https://img.shields.io/npm/v/@instructor-ai/instructor.svg?style=flat-square&logo=npm&labelColor=000000&label=@instructor-ai/instructor">
  </a>
  <a aria-label="Github Repo" href="https://github.com/instructor-ai/instructor-js" target="_blank">
    <img alt="instructor-js" src="https://img.shields.io/github/stars/instructor-ai/instructor-js?style=flat-square&logo=github&labelColor=000000&label=instructor-ai/instructor-js">
  </a>

[Instructor](https://github.com/instructor-ai/instructor-js) provides a high-level client that composes Island AI's core packages into a complete solution for structured extraction. It extends the OpenAI client with streaming and schema validation capabilities.

```typescript
import Instructor from "@instructor-ai/instructor";
import OpenAI from "openai";
import { z } from "zod";

// Define your extraction schema
const ExtractionSchema = z.object({
  users: z.array(
    z.object({
      name: z.string(),
      handle: z.string(),
      twitter: z.string()
    })
  ).min(3),
  location: z.string(),
  budget: z.number()
});

type Extraction = Partial<z.infer<typeof ExtractionSchema>>;

// Initialize OpenAI client with Instructor
const oai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID
});

const client = Instructor({
  client: oai,
  mode: "TOOLS"
});

// Stream completions with structured output
const extractionStream = await client.chat.completions.create({
  messages: [{ 
    role: "user", 
    content: "Your text content here..." 
  }],
  model: "gpt-4",
  response_model: { 
    schema: ExtractionSchema, 
    name: "Extract" 
  },
  max_retries: 3,
  stream: true,
  stream_options: {
    include_usage: true
  }
});

// Process streaming results
let extraction: Extraction = {};
for await (const result of extractionStream) {
  extraction = result;
  console.log('Progressive update:', result);
}

console.log('Final extraction:', extraction);
```

## Key Differences

1. **Instructor**
   - Provides a complete solution built on top of the OpenAI SDK
   - Handles retries, validation, and streaming automatically
   - Returns an async generator for progressive updates
   - Ideal for WebSocket-based streaming from server to client
   - Simpler integration when you don't need low-level control

2. **Direct HTTP Streaming**
   - Gives you direct access to the HTTP stream
   - Allows custom transport mechanisms
   - Enables server-side streaming with client-side parsing
   - More flexible for custom implementations
   - Better for scenarios where you need to minimize server processing

## Contributing

We welcome contributions! Check out our issues labeled as `good-first-issue` or `help-wanted`.

## Documentation

For detailed documentation, visit [https://island.hack.dance](https://island.hack.dance)

## License

MIT License - see LICENSE file for details.
