import { Suspense } from "react"
import AIUI from "@island-ai/client"
import { OAIStream } from "@island-ai/client/OAIStream"
import { withResponseModel } from "@island-ai/client/response-model"
import OpenAI from "openai"
import { z } from "zod"

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"] ?? undefined,
  organization: process.env["OPENAI_ORG_ID"] ?? undefined
})

type ChunkData = {
  chunk: string | null
  next: ChunkPromise | null
}

type ChunkPromise = Promise<ChunkData>

async function StreamRenderer({ data }: { data: ChunkPromise }) {
  if (!data) return null

  const { chunk, next } = await data

  return (
    <>
      {chunk}
      {next && (
        <Suspense fallback={<span>...</span>}>
          <StreamRenderer data={next} />
        </Suspense>
      )}
    </>
  )
}

async function handleDataStream() {
  const client = new AIUI({})
  const params = withResponseModel({
    response_model: {
      schema: z.object({
        title: z.string(),
        story: z.string()
      }),
      name: "bot"
    },
    params: {
      messages: [{ content: "tell me a story, make it up should be funny", role: "user" }],
      model: "gpt-4"
    },
    mode: "TOOLS"
  })

  const stream = await oai.chat.completions.create({
    ...params,
    stream: true
  })

  const extractionStream = await client.create({
    completionPromise: async () => {
      return OAIStream({
        res: stream
      })
    },
    response_model: {
      schema: z.object({
        title: z.string(),
        story: z.string()
      }),
      name: "bot"
    }
  })

  let resolveNextChunk: (value: {
    chunk: string | null
    next: ChunkPromise | null
  }) => void = () => {}

  let nextChunkPromise: ChunkPromise = new Promise(resolve => {
    resolveNextChunk = resolve
  })

  ;(async () => {
    let lastChunk = null
    for await (const chunk of extractionStream) {
      const currentResolve = resolveNextChunk

      nextChunkPromise = new Promise(resolve => {
        resolveNextChunk = resolve
      })

      const storydiff = chunk?.story ? chunk?.story?.replace(lastChunk?.story ?? "", "") : ""

      lastChunk = chunk
      currentResolve({ chunk: storydiff, next: nextChunkPromise })
    }

    resolveNextChunk({ chunk: null, next: null })
  })()

  return nextChunkPromise
}

export default async function Page() {
  const dataPromise = handleDataStream()

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="overflow-y-auto">
        <div className="py-12 px-6">
          <p>
            <StreamRenderer data={dataPromise} />
          </p>
        </div>
      </div>
    </div>
  )
}
