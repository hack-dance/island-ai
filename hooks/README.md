# stream-hooks

[![stream-hooks](https://img.shields.io/twitter/follow/dimitrikennedy?style=social\&labelColor=000000) ](https://twitter.com/dimitrikennedy)[![stream-hooks](https://img.shields.io/github/issues/hack-dance/island-ai.svg?style=flat-square\&labelColor=000000) ](https://www.npmjs.com/package/stream-hooks)[ ](https://island.novy.work)[![stream-hooks](https://img.shields.io/npm/v/stream-hooks.svg?style=flat-square\&logo=npm\&labelColor=000000\&label=stream-hooks)](https://www.npmjs.com/package/stream-hooks)

**stream-hooks** is a React hooks library designed to simplify the integration and management of streaming data in web applications. This package provides custom hooks that abstract the complexities of handling streaming data, making it easier for developers to focus on building responsive and dynamic UI.

### Key Features

* **Simplified Stream Management**: With useStream, manage the lifecycle of streaming data, including starting and stopping streams, with ease.
* **JSON Streaming Made Easy**: useJsonStream extends useStream, adding the capability to parse streaming JSON data using Zod schemas.
* **Seamless Integration with React**: Designed specifically for React, these hooks integrate smoothly into your React components.
* **Real-time Data Handling**: Perfect for applications requiring real-time data updates, such as dashboards, live feeds, or interactive AI-driven UIs.

## Installation

with pnpm

```bash
$ pnpm add stream-hooks zod zod-stream
```

with npm

```bash
$ npm install stream-hooks zod zod-stream
```

with bun

```bash
$ bun add stream-hooks zod zod-stream
```

## useJsonStream

```typescript
  import { useJsonStream } from "stream-hooks"

  export function Test() {
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
        {data.content}

        <button onClick={submit}>
          start
        </button>

        <button onClick={stopStream}>
          stop
        </button>
      </div>
    )
  }
```
