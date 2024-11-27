# stream-hooks

<div align="center">
  <a aria-label="NPM version" href="https://twitter.com/dimitrikennedy">
    <img alt="stream-hooks" src="https://img.shields.io/twitter/follow/dimitrikennedy?style=social&labelColor=000000">
  </a>
  <a aria-label="GH Issues" href="https://www.npmjs.com/package/stream-hooks">
    <img alt="stream-hooks" src="https://img.shields.io/github/issues/hack-dance/island-ai.svg?style=flat-square&labelColor=000000">
  </a>
  <a aria-label="Docs" href="https://island.hack.dance">
    <img alt="docs" src="https://img.shields.io/badge/DOCS-000000.svg?style=flat-square&labelColor=000000&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMTQuNjkgMjU5LjI0Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjZmZmOwogICAgICAgIHN0cm9rZS13aWR0aDogMHB4OwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTEwMC42MSwxNzguNDVoMTMuOTd2LTE5LjYyaC0xMy45N3YxOS42MlptMC0xMDguOTZ2MjMuNzJoMTMuOTd2LTIzLjcyaC0xMy45N1ptLTIuNzksMTg5Ljc1aDE5LjU2bC0yLjc5LTI4LjkyaC0xMy45N2wtMi43OSwyOC45MlptMi43OS0xMzcuNjJoMTMuOTd2LTE5LjYyaC0xMy45N3YxOS42MlptMCwyOC40MWgxMy45N3YtMTkuNjJoLTEzLjk3djE5LjYyWiIvPgogICAgICAgIDxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iOTQuNSIgY3k9IjY5LjExIiByPSIxNC4yNCIvPgogICAgICAgIDxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iMTIwLjE5IiBjeT0iNjkuMTEiIHI9IjE0LjI0Ii8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtMjE0LjI1LDYyLjU5Yy0uNzktLjc1LTE4Ljc1LTE3LjQ4LTQ5LjQ2LTE5LjA0bDE1Ljc1LTUuODhjLTEuNjctMi40Ni00LjAxLTQuMTgtNi4zNS02LS4yMy0uMTgtLjAzLS41OC4yMy0uNTcsMy40NS4xNyw2LjgyLDEuNzUsMTAuMTIsMi42OCwxLjA2LjMsMi4wOS43MiwzLjA4LDEuMjRsMTkuNDUtNy4yNmMuNTMtLjIuOS0uNzEuOTEtMS4yOHMtLjMyLTEuMDktLjg1LTEuMzJjLTEuMDQtLjQ0LTI1Ljk2LTEwLjc2LTU3LjM1Ljk2LTEuMTkuNDQtMi4zNy45MS0zLjU0LDEuNDFsMTMuNTEtMTMuMTNjLTIuMTgtLjY3LTQuNC0uOTUtNi42My0xLjQ0LS4zOC0uMDgtLjQxLS43NSwwLS44MSwzLjEyLS40NCw2LjU0LS45OCw5Ljg3LS45MWw5LjEzLTguODdjLjQxLS40LjUzLTEuMDEuMzItMS41My0uMjItLjUzLS44LS43OS0xLjMxLS44Ny0uOTYuMDEtMjMuNy40OS00My45NiwyMC4xOCwwLDAsMCwwLDAsMGwtMjAuMDcsMTkuNzYtMTkuNTgtMTkuNzZDNjcuMjUuNDksNDQuNTEuMDEsNDMuNTUsMGMtLjU2LjA1LTEuMDkuMzQtMS4zMS44Ny0uMjIuNTMtLjA5LDEuMTQuMzIsMS41M2w1LjY3LDUuNTFjNS4xLjIyLDEwLjE0LjcxLDE0LjQzLDQsLjQyLjMyLjIsMS4xMi0uMzkuOTMtMi41OC0uODYtNi4wMi0uODctOS4zOS0uNGwxNS41NiwxNS4xMmMtMS4xNy0uNS0yLjM2LS45Ny0zLjU0LTEuNDEtMzEuNC0xMS43Mi01Ni4zLTEuNDEtNTcuMzUtLjk2LS41Mi4yMi0uODYuNzUtLjg1LDEuMzJzLjM3LDEuMDguOTEsMS4yOGwxMS4wNiw0LjEzYzQuNDYtMS40OCw4LjctMi4zOSwxMC40Mi0yLjU1LjU3LS4wNS41Ni43My4xMi45MS0xLjg2Ljc0LTMuNjEsMi4yOS01LjI3LDMuNjFsMjUuOTQsOS42OEMxOS4xOCw0NS4xMSwxLjIyLDYxLjg0LjQzLDYyLjU5Yy0uNDEuMzktLjU1LDEtLjM0LDEuNTMuMjEuNTMuNzMuODgsMS4zLjg4aDEzLjljLjE1LS4wOS4zMS0uMTkuNDUtLjI4LDUuNzktMy41OCwxMS45NC02LjE5LDE4LjE4LTguODcuNjgtLjI5LDEuMjguNjQuNiwxLjAzLTMuNTQsMi4wMy02LjU0LDUuMS05LjQ5LDguMTNoMTQuNTljNC4yNy0zLjExLDguODItNS43LDEzLjE2LTguNy41OS0uNDEsMS4yMi40OS43NS45Ny0yLjM1LDIuMzgtNC40NCw1LjA2LTYuNTMsNy43NGgxMTYuODNjLS45OS0zLjE5LTIuMDItNi4zNS00LjEzLTkuMDQtLjMzLS40Mi4xOC0uOTYuNTktLjU5LDMuMzYsMy4wMSw3LjM3LDYuMTUsMTEuMDIsOS42M2gxNS4zNGMtMS4zOC0zLjUyLTMuMDUtNi44Mi01LjcxLTguNjctLjU0LS4zNy0uMDgtMS4xNS41MS0uODcsNC40LDIuMDgsOC4yNyw1Ljg2LDExLjY1LDkuNTRoMjAuMmMuNTcsMCwxLjA5LS4zNSwxLjMtLjg4LjIxLS41My4wOC0xLjE0LS4zNC0xLjUzWiIvPgogICAgICA8L2c+CiAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTEwMS4wNiwyMjEuMzNoMTMuOTd2LTMzLjZoLTEzLjk3djMzLjZaIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/stream-hooks">
    <img alt="stream-hooks" src="https://img.shields.io/npm/v/stream-hooks.svg?style=flat-square&logo=npm&labelColor=000000&label=stream-hooks">
  </a>
</div>

`stream-hooks` provides React hooks for consuming streams - specifically JSON streams coming from LLMs. Given a Zod Schema that represents the final output, you can start processing structured results immediately as they stream in.

## Installation

```bash
# pnpm
pnpm add stream-hooks zod zod-stream

# npm
npm install stream-hooks zod zod-stream

# bun
bun add stream-hooks zod zod-stream
```

## Quick Start

```typescript
import { useJsonStream } from "stream-hooks"
import { z } from "zod"

export function ChatComponent() {
  const { loading, startStream, stopStream, data } = useJsonStream({
    schema: z.object({
      content: z.string()
    }),
    onReceive: data => {
      console.log("incremental update to final response model", data)
    }
  })

  const submit = async () => {
    try {
      await startStream({
        url: "/api/ai/chat",
        method: "POST",
        body: {
          messages: [
            {
              content: "yo",
              role: "user"
            }
          ]
        }
      })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div>
      {data?.content}

      <button onClick={submit} disabled={loading}>
        Start
      </button>

      <button onClick={stopStream}>
        Stop
      </button>
    </div>
  )
}
```

## Key Features

- 🔄 React hooks for streaming LLM responses
- 🎯 Progressive validation and partial results
- 📝 Built-in TypeScript support
- ⚡ Seamless integration with zod-stream
- 🌳 Path completion tracking
- 🔍 Error handling and loading states

## Hook Options

```typescript
interface UseJsonStreamOptions<T extends z.ZodType> {
  schema: T;                    // Zod schema for validation
  onReceive?: (data: any) => void;  // Progressive update handler
  onComplete?: (data: any) => void; // Stream completion handler
  onError?: (error: Error) => void; // Error handler
  debug?: boolean;              // Enable debug logging
}
```

## Progressive Updates

The hook provides real-time updates as data streams in:

```typescript
const AnalysisComponent = () => {
  const { data } = useJsonStream({
    schema: z.object({
      user: z.object({
        preferences: z.object({
          theme: z.string(),
          language: z.string()
        })
      }),
      content: z.object({
        title: z.string(),
        body: z.string()
      })
    }),
    onReceive: (chunk) => {
      // Start personalizing as soon as preferences are available
      if (isPathComplete(['user', 'preferences'], chunk)) {
        applyTheme(chunk.user.preferences.theme);
      }

      // Begin content rendering when title is ready
      if (isPathComplete(['content', 'title'], chunk)) {
        updateTitle(chunk.content.title);
      }
    }
  });

  return <div>{/* Your UI */}</div>;
};
```

## Error Handling

```typescript
function StreamComponent() {
  const { error, reset } = useJsonStream({
    schema,
    onError: (err) => {
      console.error("Stream error:", err);
    }
  });

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={reset}>Retry</button>
      </div>
    );
  }

  return <div>{/* Your UI */}</div>;
}
```

## Integration with zod-stream

`stream-hooks` works seamlessly with `zod-stream` response modes:

```typescript
import { withResponseModel } from "zod-stream";

// API Route
export async function POST(req: Request) {
  const params = withResponseModel({
    response_model: {
      schema,
      name: "Analysis"
    },
    mode: "TOOLS",
    params: {
      messages: [{ role: "user", content: "..." }],
      model: "gpt-4"
    }
  });

  const completion = await openai.chat.completions.create({
    ...params,
    stream: true
  });

  return new Response(completion.body);
}
```

## TypeScript Support

The hook provides full type inference:

```typescript
const schema = z.object({
  result: z.string(),
  confidence: z.number()
});

// data is fully typed based on schema
const { data } = useJsonStream({
  schema,
  onReceive: (data) => {
    // TypeScript knows the shape of data
    console.log(data.result, data.confidence);
  }
});
```

## Return Values

```typescript
interface UseJsonStreamReturn<T> {
  data: T | null;              // Current stream data
  loading: boolean;            // Stream status
  error: Error | null;         // Error state
  startStream: (options: FetchOptions) => Promise<void>; // Start streaming
  stopStream: () => void;      // Stop streaming
  reset: () => void;           // Reset hook state
}
```

For more details on the underlying streaming capabilities, check out the [zod-stream documentation](/docs/zod-stream).
