# zod-stream

[![zod-stream](https://img.shields.io/twitter/follow/dimitrikennedy?style=social\&labelColor=000000) ](https://twitter.com/dimitrikennedy)[![zod-stream](https://img.shields.io/github/issues/hack-dance/island-ai.svg?style=flat-square\&labelColor=000000) ](https://www.npmjs.com/package/zod-stream)[ ](https://island.novy.work)[![zod-stream](https://img.shields.io/npm/v/zod-stream.svg?style=flat-square\&logo=npm\&labelColor=000000\&label=zod-stream)](https://www.npmjs.com/package/zod-stream)

Define structured response models for OpenAI or Anyscale completions using Zod schemas and enable partial streaming of that json so that it can be used safely and right away.

## Installation

with pnpm

```bash
$ pnpm add zod-stream zod openai
```

with npm

```bash
$ npm install zod-stream zod openai
```

with bun

```bash
$ bun add zod-stream zod openai
```

## Basic Usage

Creating an endpoint that calls OpenAI with a defined response model. (Next.js app router, route handler example)

`/api/get-stream`

```typescript
  import { OAIStream } from "zod-stream/OAIStream"
  import { withResponseModel } from "zod-stream/response-model"

  import OpenAI from "openai"
  import { z } from "zod"

  const oai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"] ?? undefined,
    organization: process.env["OPENAI_ORG_ID"] ?? undefined
  })

export async function POST(request: Request) {
  const { messages } = await request.json()

  const params = withResponseModel({
    response_model: { schema: z.object({ content: z.string() }), name: "Content response" },
    params: {
      messages,
      model: "gpt-4"
    },
    mode: "TOOLS"
  })

  const extractionStream = await oai.chat.completions.create({
    ...params,
    stream: true
  })

  return new Response(
    OAIStream({
      res: extractionStream
    })
  )
}
```

Consuming the structured stream elsewhere, maybe in the browser.

```typescript
  const client = new ZodStream()

  const stream = await client.create({
    completionPromise: async () => {
      const response = fetch("/api/get-stream", {
        body: JSON.stringify({ messages: [] }),
        method: "POST"
      })

      return response.body
    },
    response_model: { // should match model expected to be returned by the completion.
      schema: z.object({
        content: z.string()
      })
    }
  })

  for await (const chunk of extractionStream) {
    console.log(chunk) // safe to parse partial json
  }
```
