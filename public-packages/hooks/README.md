# stream-hooks

React hooks and a framework-independent consumer for progressive, schema-aware JSON streams.

## Requirements

- React 18.3 or React 19
- Zod 4
- `zod-stream` 4

`react-dom` is not a runtime or peer dependency because this package only uses React hooks.

```sh
npm install stream-hooks zod-stream zod react
```

## `useJsonStream`

```tsx
import { useJsonStream } from "stream-hooks"
import { z } from "zod"

const schema = z.object({
  title: z.string(),
  details: z.object({ count: z.coerce.number() })
})

export function ExtractButton() {
  const { data, loading, startStream, stopStream } = useJsonStream({
    schema,
    defaultData: { title: "Loading" },
    onReceive(chunk) {
      // Progressive raw input; nested values may still be incomplete or null.
      console.log(chunk.title, chunk._meta._completedPaths)
    },
    onEnd(result) {
      // Fully validated z.output<typeof schema>; coercions/transforms have run.
      console.log(result.details.count)
    }
  })

  return (
    <>
      <button
        disabled={loading}
        onClick={() =>
          startStream({
            url: "/api/extract",
            method: "POST",
            body: { prompt: "Extract this" }
          })
        }
      >
        {data.title ?? "Start"}
      </button>
      <button onClick={stopStream}>Stop</button>
    </>
  )
}
```

`startStream` returns `Promise<void>`. Parser, network, and final Zod validation failures reject that promise. Aborts finish without calling `onEnd`. Use `try`/`catch` at the call site or your application error boundary.

`data` is a schema-derived progressive value. `onReceive` gets `ZodStreamChunk<T>` with `_meta`; `onEnd` runs only after successful final validation and gets `z.output<T>`.

## `consumeJsonStream`

The same behavior is available without React, which is also useful for deterministic tests and server-side stream consumers:

```ts
import { consumeJsonStream } from "stream-hooks"

const { data, lastChunk } = await consumeJsonStream({
  stream: response.body!,
  schema,
  onReceive(chunk) {
    renderPartial(chunk)
  }
})
```

`data` is validated output. `lastChunk` is the final raw progressive input plus completion metadata.

## `useStream`

```ts
const { startStream, stopStream } = useStream({
  onBeforeStart() {},
  onStop() {}
})

const body = await startStream({
  url: "/api/stream",
  method: "POST",
  headers: { authorization: "Bearer ..." },
  body: { prompt: "Hello" }
})
```

POST bodies are JSON encoded and receive `content-type: application/json` unless the caller supplies a content type. Non-2xx responses reject with `StreamRequestError`, which exposes `status` and `statusText`.

## Migrating from 3.x

1. Upgrade to Zod 4 and `zod-stream` 4.
2. Use React 18.3+ or React 19; remove `react-dom` if it was installed only for this package's peer contract.
3. Await `startStream` and handle rejection.
4. Rename any undocumented `onComplete` usage to `onEnd`.
5. Treat `onReceive` values as progressive `ZodStreamChunk<T>` and `onEnd` values as validated `z.output<T>`.

Zod 3 is not accepted by this major. Use `schema-stream` 4 directly for a dual Zod 3/Zod 4 parser boundary.
