## Getting Started

### Installation

`zod-stream` can be easily installed using your preferred package manager. Below are the commands for pnpm, npm, and bun.

#### With bun
```bash
$ bun add zod-stream zod openai
```

#### With pnpm
```bash
$ pnpm add zod-stream zod openai
```

#### With npm
```bash
$ npm install zod-stream zod openai
```


### Basic Setup

To start using `zod-stream` in your project, follow these simple steps:

1. **Define a response model**

   Import and initialize the necessary modules from zod-stream, zod, and openai.

   ```typescript
      import { z } from "zod";

      export const my_response_model = {
        schema: z.object({
          content: z.string()
        }),
        name: "bot response json"
      }
     ```
2. **Create a structured LLM response using zod and zod-stream**

   Ensure that your environment variables are properly configured, especially if you are interacting with external services like OpenAI.
   ```typescript
     process.env["OPENAI_API_KEY"] = "your-openai-api-key"; // Replace with your OpenAI API key
     process.env["OPENAI_ORG_ID"] = "your-openai-org-id";   // Replace with your OpenAI Organization ID (if applicable)
   ```

   Import and initialize the necessary modules from zod-stream, zod, and openai, then pass your response model to the LLM provider using the `withResponseModel` utility.
   ```typescript
      import { withResponseModel } from "zod-stream";
      import OpenAI from "openai";

      import { my_response_model } from "./my_response_model"

      const openAI = new OpenAI({
        apiKey: process.env["OPENAI_API_KEY"],
        organization: process.env["OPENAI_ORG_ID"]
      });


      // build completion params for the selected mode.
      const params = withResponseModel({
        response_model: my_response_model,
        params: {
          messages,
          model: "gpt-4"
        },
        mode: "TOOLS"
      })
      
      // make a completion call with your generated params
      const extractionStream = await oai.chat.completions.create({
        ...params,
        stream: true
      })

      
      // convert the default SSE response to a readable stream and then return as api response or pass elsewhere.
      const my_stream = OAIStream({
        res: extractionStream
      })
     ```     

3. **Read the partial streaming response from the stream**

   ```typescript
      import ZodStreamfrom "zod-stream";
      import OpenAI from "openai";

      import { my_response_model } from "./my_response_model"

      const zodstream = new ZodStream()

      const stream = await zodstream.create({
        completionPromise: async () => {
          // a promise that returns the stream created in step 2. This could be a fetch call or a promise that resolves the same way.

          const response = fetch("/api/get-stream", {
            body: JSON.stringify({ messages: [] }),
            method: "POST"
          })

          return response.body
        },
        // this schema should match the response model expected by the stream
        response_model: my_response_model
      })

      for await (const chunk of stream) {
        console.log(chunk) // safe to parse partial json
      }
    ```


This setup will prepare your application to handle structured LLM response streams effectively using zod-stream.
For more advanced configurations and detailed usage, refer to the Usage and API Reference sections.