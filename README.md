<h1 align="center">Island AI</h1>
<p align="center">"A Practical Toolkit for Structured LLM Data Handling"</p>
<div align="center">

</div>

>🚨  **Under construction**

@island-ai is a TypeScript toolkit tailored for developers engaging with structured outputs from Large Language Models. It offers streamlined processes for handling, parsing, streaming, and leveraging AI-generated data across various applications.

**Packages:**

- **@island-ai/core**: A client module that interfaces directly with LLM streams. Utilizing Schema-Stream for efficient parsing, it's equipped with tools for processing raw responses from OpenAI, categorizing them by mode (function, tools, JSON, etc.), and ensuring proper error handling and stream conversion. Ideal for API integration delivering structured LLM response streams. There are also utilties for generating OpenAI SDK client parameters with structured response models using Zod schemas. 

- **@island-ai/hooks**: A set of React hooks tailored for integrating streaming JSON data into React applications. These hooks facilitate the incorporation of live data feeds into user interfaces.

- **ai-ui**: A suite of React components specifically developed for AI applications, built on top of the ShadCN component library. These components are designed for easy integration, allowing developers to quickly incorporate AI functionalities into their UIs.

**Related Packages:**

- **@instructor-ai/instructor-js**: A port from Python of the same name, this package is focused on data validation and retry mechanisms, particularly effective in server-only environments. It enhances the reliability and integrity of data processing workflows.

- **schema-stream**: This component is a JSON streaming parser that incrementally constructs and updates response models based on Zod schemas. It's designed for real-time data processing and incremental model hydration.


## Example: Streaming and reading partial JSON from OpenAI

**Define a respose model using Zod**
```tsx
  export const schema = z.object({
    content: z.string(),
    users: z.array(z.object({
      name: z.string()
    }))
  })
```


**A basic Next.js App api route**
```typescript
import { OAIStream } from "@island-ai/core/OAIStream"
import { withResponseModel } from "@island-ai/core/response-model"
import OpenAI from "openai"

import { schema } from "./my-schema.ts"

export async function POST(request: Request) {
  const { messages } = (await request.json()) as IRequest

  const params = withResponseModel({
    response_model: { schema: schema, name: "Users extraction and message" },
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

**Consuming the json stream in a react component**

```tsx
import StructuredStreamClient from "@island-ai/core"
import { schema } from "./my-schema.ts"

  const text = `
  In our recent online meeting, participants from various backgrounds joined to discuss the upcoming tech conference. The names and contact details of the participants were as follows:
  
  - Name: John Doe, Email: johndoe@email.com, Twitter: @TechGuru44
  - Name: Jane Smith, Email: janesmith@email.com, Twitter: @DigitalDiva88
  - Name: Alex Johnson, Email: alexj@email.com, Twitter: @CodeMaster2023
  
  During the meeting, we agreed on several key points. The conference will be held on March 15th, 2024, at the Grand Tech Arena located at 4521 Innovation Drive. Dr. Emily Johnson, a renowned AI researcher, will be our keynote speaker.
  
  The budget for the event is set at $50,000, covering venue costs, speaker fees, and promotional activities. Each participant is expected to contribute an article to the conference blog by February 20th.
  
  A follow-up meeting is scheduled for January 25th at 3 PM GMT to finalize the agenda and confirm the list of speakers.
  `

export function ExtractTest() {
  const [result, setResult] = useState({})
  const [loading, setLoading] = useState(false)

  const startStream = async () => {
    setLoading(true)

    try {
      const client = new StructuredStreamClient()

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

        return response?.body
      }

      const extractionStream = await client.create({
        completionPromise: completion,
        response_model: { schema: schema }
      })

      for await (const data of extractionStream) {
        setResult(data)
      }

    } catch (e) {
      console.log(e)
    }

    setLoading(false)
  }

  const start = async () => {
    try {
      await startStream()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div>
      {result.users}
      {result.content}

      <button onClick={start}>start</button>
    </div>
  )
}
```