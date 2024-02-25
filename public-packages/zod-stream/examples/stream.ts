import OpenAI from "openai"
import { z } from "zod"
import ZodStream, { isPathComplete, OAIStream, withResponseModel } from "zod-stream"

const textBlock = `
In our recent online meeting, participants from various backgrounds joined to discuss the upcoming tech conference. The names and contact details of the participants were as follows:

- Name: John Doe, Email: johndoe@email.com, Twitter: @TechGuru44
- Name: Jane Smith, Email: janesmith@email.com, Twitter: @DigitalDiva88
- Name: Alex Johnson, Email: alexj@email.com, Twitter: @CodeMaster2023

During the meeting, we agreed on several key points. The conference will be held on March 15th, 2024, at the Grand Tech Arena located at 4521 Innovation Drive. Dr. Emily Johnson, a renowned AI researcher, will be our keynote speaker.

The budget for the event is set at $50,000, covering venue costs, speaker fees, and promotional activities. Each participant is expected to contribute an article to the conference blog by February 20th.

A follow-up meeting is scheduled for January 25th at 3 PM GMT to finalize the agenda and confirm the list of speakers.
`

const ExtractionValuesSchema = z.object({
  users: z
    .array(
      z.object({
        name: z.string(),
        handle: z.string(),
        twitter: z.string()
      })
    )
    .min(3),
  location: z.string(),
  budget: z.number()
})

async function CreateOAIStream() {
  const oai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"] ?? undefined,
    organization: process.env["OPENAI_ORG_ID"] ?? undefined
  })

  const params = withResponseModel({
    response_model: { schema: ExtractionValuesSchema, name: "Extract" },
    params: {
      messages: [{ role: "user", content: textBlock }],
      model: "gpt-4",
      seed: 1
    },
    mode: "TOOLS"
  })

  const extractionStream = await oai.chat.completions.create({
    ...params,
    stream: true
  })

  return OAIStream({
    res: extractionStream
  })
}

async function extractUser() {
  const client = new ZodStream()

  const extractionStream = await client.create({
    completionPromise: CreateOAIStream,
    response_model: { schema: ExtractionValuesSchema, name: "Extract" }
  })

  let result: Partial<z.infer<typeof ExtractionValuesSchema>> = {}

  for await (const data of extractionStream) {
    const locationReady = isPathComplete(["location"], data)
    console.log("location is ready?", locationReady)
    result = data
  }

  return result
}

console.log(await extractUser())
