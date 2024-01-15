"use client"

import { useState } from "react"
import StructuredStreamClient from "@island-ai/core"
import { Button } from "@repo/ui/components/ui/button"
import { Textarea } from "@repo/ui/components/ui/textarea"
import { Loader2 } from "lucide-react"

import { jsonToZod } from "@/lib/json-to-zod"

export function ExtractTest() {
  const [prompt] = useState("go")

  const [result, setResult] = useState({})
  const [schema, setSchema] = useState(
    `{ "users": [{ "name": "string", "email": "string", "twitter": "string" }], "budget": 123, "meetingDate": "1/2/23"}`
  )
  const [text, setText] = useState(`
  In our recent online meeting, participants from various backgrounds joined to discuss the upcoming tech conference. The names and contact details of the participants were as follows:
  
  - Name: John Doe, Email: johndoe@email.com, Twitter: @TechGuru44
  - Name: Jane Smith, Email: janesmith@email.com, Twitter: @DigitalDiva88
  - Name: Alex Johnson, Email: alexj@email.com, Twitter: @CodeMaster2023
  
  During the meeting, we agreed on several key points. The conference will be held on March 15th, 2024, at the Grand Tech Arena located at 4521 Innovation Drive. Dr. Emily Johnson, a renowned AI researcher, will be our keynote speaker.
  
  The budget for the event is set at $50,000, covering venue costs, speaker fees, and promotional activities. Each participant is expected to contribute an article to the conference blog by February 20th.
  
  A follow-up meeting is scheduled for January 25th at 3 PM GMT to finalize the agenda and confirm the list of speakers.
  `)

  const [loading, setLoading] = useState(false)

  const startStream = async ({ url }: { url: string }) => {
    setLoading(true)

    try {
      const completion = async () => {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            schema,
            messages: [
              {
                content: text,
                role: "user"
              }
            ]
          })
        })

        if (!response.ok || !response?.body) throw new Error("failed to fetch completion")

        return response?.body
      }
      const zodSchema = jsonToZod(schema)

      if (!zodSchema || zodSchema instanceof Error) throw new Error("failed to parse schema")

      const client = new StructuredStreamClient({})

      const extractionStream = await client.create({
        completionPromise: completion,
        response_model: { schema: zodSchema, name: "Extractor" }
      })

      for await (const data of extractionStream) {
        setResult(data)
      }
    } catch (e) {
      console.log(e)
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
      <div className="flex items-start w-full">
        <div className="w-full h-full flex-1 min-h-[400px]">
          <h3 className="text-lg font-bold">Example model</h3>
          <Textarea
            className="w-full h-full flex-1 min-h-[400px]"
            value={schema}
            onChange={e => setSchema(e.target.value)}
          />
        </div>
        <div className="w-full h-full flex-1 min-h-[400px]">
          <h3 className="text-lg font-bold">Raw text</h3>
          <Textarea
            className="w-full h-full flex-1 min-h-[400px]"
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </div>
        <pre className="w-full h-full p-4 overflow-auto flex-1">
          <code>{JSON.stringify(result, null, 2)}</code>
        </pre>
      </div>
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
