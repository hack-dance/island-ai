"use client"

import { useState } from "react"
import { Button } from "@repo/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@repo/ui/components/ui/card"
import { Loader2 } from "lucide-react"
import StructuredStreamClient from "zod-stream"

import { coreAgentSchema } from "@/ai/agents/core/schema"

export function StreamTest() {
  const [prompt] = useState("go")

  const [result, setResult] = useState<Record<string, unknown>>({})

  const [loading, setLoading] = useState(false)

  const startStream = async ({ url }: { url: string }) => {
    setLoading(true)

    const client = new StructuredStreamClient({})

    const completion = async () => {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          messages: [
            {
              content: "yo",
              role: "user"
            }
          ]
        })
      })

      if (!response.ok || !response?.body) throw new Error("failed to fetch completion")

      return response.body
    }

    const extractionStream = await client.create({
      completionPromise: completion,
      response_model: { schema: coreAgentSchema, name: "Extr" }
    })

    for await (const data of extractionStream) {
      setResult(data)
    }

    setLoading(false)
  }

  const submitMessage = async () => {
    if (!prompt.length || loading) return

    try {
      await startStream({
        url: "/api/ai/chat"
      })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="container">
      <ul className="w-full h-full flex flex-wrap gap-4">
        {Object.keys(result).map(key => {
          return (
            <li key={key} className="">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>{key}</CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                  {typeof result[key] === "string" ? (
                    <>{result[key]}</>
                  ) : (
                    JSON.stringify(result[key], null, 4)
                  )}
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ul>
      <footer className="fixed bottom-0 left-0 w-full p-6 flex items-center justify-center gap-4">
        <Button size="lg" onClick={submitMessage}>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
            </div>
          ) : (
            "start stream"
          )}
        </Button>
      </footer>
    </div>
  )
}
