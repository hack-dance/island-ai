"use client"

import { Button } from "@repo/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@repo/ui/components/ui/card"
import { Loader2 } from "lucide-react"
import { useJsonStream } from "stream-hooks"

import { coreAgentSchema } from "@/ai/agents/core/schema"

export function StreamTest() {
  const { data, loading, startStream } = useJsonStream({
    schema: coreAgentSchema
  })
  const submitMessage = async () => {
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
    <div className="container">
      <ul className="w-full h-full flex flex-wrap gap-4">
        {Object.entries(data).map(([key, value]) => {
          if (key in data) {
            return (
              <li key={key} className="">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>{key}</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {typeof value === "string" ? <>{value}</> : JSON.stringify(value, null, 4)}
                  </CardContent>
                </Card>
              </li>
            )
          }
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
