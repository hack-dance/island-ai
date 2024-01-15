
>🚨  **Currently in alpha - stable version coming soon**

# stream-hooks

Hooks for consuming streams in react - specifically json streams coming from LLMS - given a Zod Schema that represents the final output, you can start the stream and start to read the structured result immediately.

[![Twitter Follow](https://img.shields.io/twitter/follow/dimitrikennedy?style=social)](https://twitter.com/dimitrikennedy) [![GitHub issues](https://img.shields.io/github/issues/hack-dance/island-ai.svg)](https://github.com/hack-dance/island-ai/issues)


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

    return (
      <div>
        {data.content}

        <button onClick={startStream}>
          start
        </button>

        <button onClick={stopStream}>
          stop
        </button>
      </div>
    )
  }
```