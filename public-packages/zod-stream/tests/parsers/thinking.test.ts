import { thinkingJsonParser } from "@/parsers/thinking"
import { withResponseModel } from "@/response-model"
import { describe, expect, test } from "bun:test"
import OpenAI from "openai"
import { z } from "zod"

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
        email: z.string(),
        twitter: z.string()
      })
    )
    .min(3),
  conference: z.object({
    date: z.string(),
    venue: z.string(),
    budget: z.number(),
    keynoteSpeaker: z.string()
  }),
  nextMeeting: z.object({
    date: z.string(),
    time: z.string(),
    timezone: z.string()
  }),
  _thinking: z.string().optional()
})

describe("thinking parser - live tests", () => {
  test("should parse Groq streaming response with thinking tags", async () => {
    const groq = new OpenAI({
      apiKey: process.env["GROQ_API_KEY"] ?? undefined,
      baseURL: "https://api.groq.com/openai/v1"
    })

    const params = withResponseModel({
      response_model: { schema: ExtractionValuesSchema, name: "Extract" },
      params: {
        messages: [{ role: "user", content: `${textBlock}\n\nPlease extract all key points.` }],
        model: "deepseek-r1-distill-llama-70b",
        temperature: 0.5
      },
      mode: "THINKING_MD_JSON"
    })

    const stream = await groq.chat.completions.create({
      ...params,
      stream: false
    })

    const resultString = thinkingJsonParser(stream)
    console.log(resultString)
    const result = JSON.parse(resultString?.json) as z.infer<typeof ExtractionValuesSchema>

    // Verify thinking was captured
    expect(resultString.thinking).toBeDefined()
    expect(typeof resultString.thinking).toBe("string")

    // Verify data structure
    expect(result.users).toHaveLength(3)
    expect(result.users[0]).toHaveProperty("name")
    expect(result.users[0]).toHaveProperty("email")
    expect(result.users[0]).toHaveProperty("twitter")

    expect(result.conference).toBeDefined()
    expect(result.conference.budget).toBe(50000)
    expect(result.conference.keynoteSpeaker).toBe("Dr. Emily Johnson")

    expect(result.nextMeeting).toBeDefined()
    expect(result.nextMeeting.timezone).toBe("GMT")
  })

  test("should parse Groq streaming response with thinking tags and provide details", async () => {
    const groq = new OpenAI({
      apiKey: process.env["GROQ_API_KEY"] ?? undefined,
      baseURL: "https://api.groq.com/openai/v1"
    })

    const MeetingDetailsSchema = z.object({
      nextMeeting: z.string(),
      nextMeetingDate: z.string(),
      nextMeetingTime: z.string(),
      nextMeetingTimezone: z.string(),
      nextMeetingLocation: z.string(),
      meetingPreparation: z.string()
    })

    const params = withResponseModel({
      response_model: {
        schema: MeetingDetailsSchema,
        name: "Extract"
      },
      params: {
        messages: [
          {
            role: "user",
            content: `${textBlock}\n\n What are the details of the next meeting and what should I know to prepare for it?`
          }
        ],
        model: "deepseek-r1-distill-llama-70b",
        temperature: 0.5
      },
      mode: "THINKING_MD_JSON"
    })

    const stream = await groq.chat.completions.create({
      ...params,
      stream: false
    })

    const resultString = thinkingJsonParser(stream)
    console.log(resultString)
    const result = JSON.parse(resultString?.json) as z.infer<typeof MeetingDetailsSchema>

    // Verify thinking was captured
    expect(resultString.thinking).toBeDefined()
    expect(typeof resultString.thinking).toBe("string")

    expect(result.nextMeeting).toBeDefined()
    expect(typeof result.nextMeeting).toBe("string")
    expect(result.nextMeetingDate).toBeDefined()
    expect(typeof result.nextMeetingDate).toBe("string")
    expect(result.nextMeetingTime).toBeDefined()
    expect(typeof result.nextMeetingTime).toBe("string")
    expect(result.nextMeetingTimezone).toBeDefined()
    expect(typeof result.nextMeetingTimezone).toBe("string")
    expect(result.nextMeetingLocation).toBeDefined()
    expect(typeof result.nextMeetingLocation).toBe("string")
    expect(result.meetingPreparation).toBeDefined()
    expect(typeof result.meetingPreparation).toBe("string")
  })
})
