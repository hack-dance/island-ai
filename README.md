<h1 align="center">Island AI</h1>
<p align="center"><i>A Practical Toolkit for Structured LLM Data Handling</i></p>
<div align="center">
  <a aria-label="Docs" href="https://island.novy.work">
    <img alt="docs" src="https://img.shields.io/badge/DOCS-000000.svg?style=flat-square&labelColor=000000&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMTQuNjkgMjU5LjI0Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjZmZmOwogICAgICAgIHN0cm9rZS13aWR0aDogMHB4OwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTEwMC42MSwxNzguNDVoMTMuOTd2LTE5LjYyaC0xMy45N3YxOS42MlptMC0xMDguOTZ2MjMuNzJoMTMuOTd2LTIzLjcyaC0xMy45N1ptLTIuNzksMTg5Ljc1aDE5LjU2bC0yLjc5LTI4LjkyaC0xMy45N2wtMi43OSwyOC45MlptMi43OS0xMzcuNjJoMTMuOTd2LTE5LjYyaC0xMy45N3YxOS42MlptMCwyOC40MWgxMy45N3YtMTkuNjJoLTEzLjk3djE5LjYyWiIvPgogICAgICAgIDxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iOTQuNSIgY3k9IjY5LjExIiByPSIxNC4yNCIvPgogICAgICAgIDxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iMTIwLjE5IiBjeT0iNjkuMTEiIHI9IjE0LjI0Ii8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtMjE0LjI1LDYyLjU5Yy0uNzktLjc1LTE4Ljc1LTE3LjQ4LTQ5LjQ2LTE5LjA0bDE1Ljc1LTUuODhjLTEuNjctMi40Ni00LjAxLTQuMTgtNi4zNS02LS4yMy0uMTgtLjAzLS41OC4yMy0uNTcsMy40NS4xNyw2LjgyLDEuNzUsMTAuMTIsMi42OCwxLjA2LjMsMi4wOS43MiwzLjA4LDEuMjRsMTkuNDUtNy4yNmMuNTMtLjIuOS0uNzEuOTEtMS4yOHMtLjMyLTEuMDktLjg1LTEuMzJjLTEuMDQtLjQ0LTI1Ljk2LTEwLjc2LTU3LjM1Ljk2LTEuMTkuNDQtMi4zNy45MS0zLjU0LDEuNDFsMTMuNTEtMTMuMTNjLTIuMTgtLjY3LTQuNC0uOTUtNi42My0xLjQ0LS4zOC0uMDgtLjQxLS43NSwwLS44MSwzLjEyLS40NCw2LjU0LS45OCw5Ljg3LS45MWw5LjEzLTguODdjLjQxLS40LjUzLTEuMDEuMzItMS41My0uMjItLjUzLS44LS43OS0xLjMxLS44Ny0uOTYuMDEtMjMuNy40OS00My45NiwyMC4xOCwwLDAsMCwwLDAsMGwtMjAuMDcsMTkuNzYtMTkuNTgtMTkuNzZDNjcuMjUuNDksNDQuNTEuMDEsNDMuNTUsMGMtLjU2LjA1LTEuMDkuMzQtMS4zMS44Ny0uMjIuNTMtLjA5LDEuMTQuMzIsMS41M2w1LjY3LDUuNTFjNS4xLjIyLDEwLjE0LjcxLDE0LjQzLDQsLjQyLjMyLjIsMS4xMi0uMzkuOTMtMi41OC0uODYtNi4wMi0uODctOS4zOS0uNGwxNS41NiwxNS4xMmMtMS4xNy0uNS0yLjM2LS45Ny0zLjU0LTEuNDEtMzEuNC0xMS43Mi01Ni4zLTEuNDEtNTcuMzUtLjk2LS41Mi4yMi0uODYuNzUtLjg1LDEuMzJzLjM3LDEuMDguOTEsMS4yOGwxMS4wNiw0LjEzYzQuNDYtMS40OCw4LjctMi4zOSwxMC40Mi0yLjU1LjU3LS4wNS41Ni43My4xMi45MS0xLjg2Ljc0LTMuNjEsMi4yOS01LjI3LDMuNjFsMjUuOTQsOS42OEMxOS4xOCw0NS4xMSwxLjIyLDYxLjg0LjQzLDYyLjU5Yy0uNDEuMzktLjU1LDEtLjM0LDEuNTMuMjEuNTMuNzMuODgsMS4zLjg4aDEzLjljLjE1LS4wOS4zMS0uMTkuNDUtLjI4LDUuNzktMy41OCwxMS45NC02LjE5LDE4LjE4LTguODcuNjgtLjI5LDEuMjguNjQuNiwxLjAzLTMuNTQsMi4wMy02LjU0LDUuMS05LjQ5LDguMTNoMTQuNTljNC4yNy0zLjExLDguODItNS43LDEzLjE2LTguNy41OS0uNDEsMS4yMi40OS43NS45Ny0yLjM1LDIuMzgtNC40NCw1LjA2LTYuNTMsNy43NGgxMTYuODNjLS45OS0zLjE5LTIuMDItNi4zNS00LjEzLTkuMDQtLjMzLS40Mi4xOC0uOTYuNTktLjU5LDMuMzYsMy4wMSw3LjM3LDYuMTUsMTEuMDIsOS42M2gxNS4zNGMtMS4zOC0zLjUyLTMuMDUtNi44Mi01LjcxLTguNjctLjU0LS4zNy0uMDgtMS4xNS41MS0uODcsNC40LDIuMDgsOC4yNyw1Ljg2LDExLjY1LDkuNTRoMjAuMmMuNTcsMCwxLjA5LS4zNSwxLjMtLjg4LjIxLS41My4wOC0xLjE0LS4zNC0xLjUzWiIvPgogICAgICA8L2c+CiAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTEwMS4wNiwyMjEuMzNoMTMuOTd2LTMzLjZoLTEzLjk3djMzLjZaIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/zod-stream">
    <img alt="zod-stream" src="https://img.shields.io/npm/v/zod-stream.svg?style=flat-square&logo=npm&labelColor=000000&label=zod-stream">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/stream-hooks">
    <img alt="stream-hooks" src="https://img.shields.io/npm/v/stream-hooks.svg?style=flat-square&logo=npm&labelColor=000000&label=stream-hooks">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/schema-stream">
    <img alt="schema-stream" src="https://img.shields.io/npm/v/schema-stream.svg?style=flat-square&logo=npm&labelColor=000000&label=schema-stream">
  </a>

   <a aria-label="Docs" href="https://novy.ai">
    <img alt="docs" src="https://img.shields.io/badge/MADE%20BY%20NOVY-000000.svg?style=flat-square&labelColor=000000&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMTQuNjkgMjU5LjI0Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjZmZmOwogICAgICAgIHN0cm9rZS13aWR0aDogMHB4OwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTEwMC42MSwxNzguNDVoMTMuOTd2LTE5LjYyaC0xMy45N3YxOS42MlptMC0xMDguOTZ2MjMuNzJoMTMuOTd2LTIzLjcyaC0xMy45N1ptLTIuNzksMTg5Ljc1aDE5LjU2bC0yLjc5LTI4LjkyaC0xMy45N2wtMi43OSwyOC45MlptMi43OS0xMzcuNjJoMTMuOTd2LTE5LjYyaC0xMy45N3YxOS42MlptMCwyOC40MWgxMy45N3YtMTkuNjJoLTEzLjk3djE5LjYyWiIvPgogICAgICAgIDxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iOTQuNSIgY3k9IjY5LjExIiByPSIxNC4yNCIvPgogICAgICAgIDxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iMTIwLjE5IiBjeT0iNjkuMTEiIHI9IjE0LjI0Ii8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtMjE0LjI1LDYyLjU5Yy0uNzktLjc1LTE4Ljc1LTE3LjQ4LTQ5LjQ2LTE5LjA0bDE1Ljc1LTUuODhjLTEuNjctMi40Ni00LjAxLTQuMTgtNi4zNS02LS4yMy0uMTgtLjAzLS41OC4yMy0uNTcsMy40NS4xNyw2LjgyLDEuNzUsMTAuMTIsMi42OCwxLjA2LjMsMi4wOS43MiwzLjA4LDEuMjRsMTkuNDUtNy4yNmMuNTMtLjIuOS0uNzEuOTEtMS4yOHMtLjMyLTEuMDktLjg1LTEuMzJjLTEuMDQtLjQ0LTI1Ljk2LTEwLjc2LTU3LjM1Ljk2LTEuMTkuNDQtMi4zNy45MS0zLjU0LDEuNDFsMTMuNTEtMTMuMTNjLTIuMTgtLjY3LTQuNC0uOTUtNi42My0xLjQ0LS4zOC0uMDgtLjQxLS43NSwwLS44MSwzLjEyLS40NCw2LjU0LS45OCw5Ljg3LS45MWw5LjEzLTguODdjLjQxLS40LjUzLTEuMDEuMzItMS41My0uMjItLjUzLS44LS43OS0xLjMxLS44Ny0uOTYuMDEtMjMuNy40OS00My45NiwyMC4xOCwwLDAsMCwwLDAsMGwtMjAuMDcsMTkuNzYtMTkuNTgtMTkuNzZDNjcuMjUuNDksNDQuNTEuMDEsNDMuNTUsMGMtLjU2LjA1LTEuMDkuMzQtMS4zMS44Ny0uMjIuNTMtLjA5LDEuMTQuMzIsMS41M2w1LjY3LDUuNTFjNS4xLjIyLDEwLjE0LjcxLDE0LjQzLDQsLjQyLjMyLjIsMS4xMi0uMzkuOTMtMi41OC0uODYtNi4wMi0uODctOS4zOS0uNGwxNS41NiwxNS4xMmMtMS4xNy0uNS0yLjM2LS45Ny0zLjU0LTEuNDEtMzEuNC0xMS43Mi01Ni4zLTEuNDEtNTcuMzUtLjk2LS41Mi4yMi0uODYuNzUtLjg1LDEuMzJzLjM3LDEuMDguOTEsMS4yOGwxMS4wNiw0LjEzYzQuNDYtMS40OCw4LjctMi4zOSwxMC40Mi0yLjU1LjU3LS4wNS41Ni43My4xMi45MS0xLjg2Ljc0LTMuNjEsMi4yOS01LjI3LDMuNjFsMjUuOTQsOS42OEMxOS4xOCw0NS4xMSwxLjIyLDYxLjg0LjQzLDYyLjU5Yy0uNDEuMzktLjU1LDEtLjM0LDEuNTMuMjEuNTMuNzMuODgsMS4zLjg4aDEzLjljLjE1LS4wOS4zMS0uMTkuNDUtLjI4LDUuNzktMy41OCwxMS45NC02LjE5LDE4LjE4LTguODcuNjgtLjI5LDEuMjguNjQuNiwxLjAzLTMuNTQsMi4wMy02LjU0LDUuMS05LjQ5LDguMTNoMTQuNTljNC4yNy0zLjExLDguODItNS43LDEzLjE2LTguNy41OS0uNDEsMS4yMi40OS43NS45Ny0yLjM1LDIuMzgtNC40NCw1LjA2LTYuNTMsNy43NGgxMTYuODNjLS45OS0zLjE5LTIuMDItNi4zNS00LjEzLTkuMDQtLjMzLS40Mi4xOC0uOTYuNTktLjU5LDMuMzYsMy4wMSw3LjM3LDYuMTUsMTEuMDIsOS42M2gxNS4zNGMtMS4zOC0zLjUyLTMuMDUtNi44Mi01LjcxLTguNjctLjU0LS4zNy0uMDgtMS4xNS41MS0uODcsNC40LDIuMDgsOC4yNyw1Ljg2LDExLjY1LDkuNTRoMjAuMmMuNTcsMCwxLjA5LS4zNSwxLjMtLjg4LjIxLS41My4wOC0xLjE0LS4zNC0xLjUzWiIvPgogICAgICA8L2c+CiAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTEwMS4wNiwyMjEuMzNoMTMuOTd2LTMzLjZoLTEzLjk3djMzLjZaIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=">
  </a>

</div>

island-ai is a TypeScript toolkit for development, integration, and evaluation of structured outputs from Large Language Models (LLMs). Our toolkit includes packages for schema-validation, streaming JSON data, evaluating AI-generated content, and universal LLM client interfaces. Below are the core packages that make up Island AI.

## Core Packages

### 1. zod-stream
**zod-stream** is designed to define structured response models for OpenAI or Anyscale completions using Zod schemas. It enables partial streaming of JSON so that it can be used safely and immediately.

#### Overview
-  Define structured response models.
-  Enable partial JSON streaming.
-  Safely parse and use responses right away.

#### Installation

```bash
# with pnpm
$ pnpm add zod-stream zod openai

# with npm
$ npm install zod-stream zod openai

# with bun
$ bun add zod-stream zod openai
```

#### Basic Usage

```typescript
import { OAIStream } from "zod-stream/OAIStream";
import { withResponseModel } from "zod-stream/response-model";
import OpenAI from "openai";
import { z } from "zod";

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"] ?? undefined,
  organization: process.env["OPENAI_ORG_ID"] ?? undefined
});

// Define a response model using Zod
const schema = z.object({
  content: z.string(),
  users: z.array(z.object({
    name: z.string(),
  })),
});

// API Route Example (Next.js)
export async function POST(request: Request) {
  const { messages } = await request.json();

  const params = withResponseModel({
    response_model: { schema: schema, name: "Users extraction and message" },
    params: {
      messages,
      model: "gpt-4",
    },
    mode: "TOOLS",
  });

  const extractionStream = await oai.chat.completions.create({
    ...params,
    stream: true,
  });

  return new Response(OAIStream({ res: extractionStream }));
}
```

### 2. schema-stream
**schema-stream** is a utility for parsing streams of JSON data. It provides safe-to-read-from stubbed versions of data before the stream has fully completed.

#### Overview
-  Stream JSON data parsing with partial data availability.
-  Zod schema validation for robust data handling.
-  Incremental model hydration for real-time data processing.

#### Installation

```bash
npm install schema-stream zod
```

#### Basic Usage
```typescript
import { SchemaStream } from "schema-stream";
import { z } from "zod";

const schema = z.object({
  someString: z.string(),
  someNumber: z.number(),
});

const response = await getSomeStreamOfJson();

const parser = new SchemaStream(schema, {
  someString: "default string",
});

const streamParser = parser.parse({});
response.body?.pipeThrough(parser);

const reader = streamParser.readable.getReader();
const decoder = new TextDecoder();
let result = {};

while (!done) {
  const { value, done: doneReading } = await reader.read();
  done = doneReading;

  if (done) {
    console.log(result);
    break;
  }

  const chunkValue = decoder.decode(value);
  result = JSON.parse(chunkValue);
}
```

### 3. stream-hooks
**stream-hooks** provides React hooks for consuming streams of JSON data, particularly from LLMs. It integrates seamlessly with Zod schemas to ensure structured data handling.

#### Overview
-  React hooks for consuming streaming JSON data.
-  Seamlessly integrates with Zod for structured data validation.
-  Hooks facilitate the incorporation of live data feeds into user interfaces.

#### Installation

```bash
# with pnpm
$ pnpm add stream-hooks zod zod-stream

# with npm
$ npm install stream-hooks zod zod-stream

# with bun
$ bun add stream-hooks zod zod-stream
```

#### Basic Usage
```typescript
import { useJsonStream } from "stream-hooks";
import { z } from "zod";

const schema = z.object({
  content: z.string(),
});

export function Test() {
  const { loading, startStream, stopStream, data } = useJsonStream({
    schema,
    onReceive: data => {
      console.log("incremental update to final response model", data);
    },
  });

  const submit = async () => {
    try {
      await startStream({
        url: "/api/ai/chat",
        method: "POST",
        body: { messages: [{ content: "yo", role: "user" }] },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {data.content}
      <button onClick={submit}>start</button>
      <button onClick={stopStream}>stop</button>
    </div>
  );
}
```

### 4. llm-polyglot
**llm-polyglot** is a universal LLM client that provides support for various LLM providers, ensuring a consistent API interface.

#### Overview
-  Extends the official OpenAI SDK.
-  Supports providers like Anthropic, Together, OpenAI, Microsoft, Anyscale, and Anthropic.
-  Universal SDK for multiple LLMs with consistent API.

#### Installation

```bash
# with pnpm
$ pnpm add llm-polyglot openai

# with npm
$ npm install llm-polyglot openai

# with bun
$ bun add llm-polyglot openai
```

#### Basic Usage
```typescript
import { createLLMClient } from "llm-polyglot";

const anthropicClient = createLLMClient({
  provider: "anthropic",
});

const completion = await anthropicClient.chat.completions.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1000,
  messages: [{ role: "user", content: "hey how are you" }],
});
```

### Real-World Examples

#### Chatbot Evaluation

##### Scenario
A company wants to evaluate the performance of their AI-powered customer support chatbot to ensure it provides relevant and accurate responses to user queries.

##### Approach
1. **Model-Graded Evaluators**: Use relevance, fluency, and completeness evaluators to assess the overall quality of chatbot responses.
2. **Accuracy Evaluators**: Measure the accuracy of responses by comparing them to a predefined set of expected answers.
3. **Context Evaluators**: Assess the relevance of responses within the context of previous user interactions.

##### Example Code
```typescript
import { createEvaluator, createAccuracyEvaluator, createContextEvaluator, createWeightedEvaluator } from "evalz";
import OpenAI from "openai";

const oai = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] });

const relevanceEval = () => createEvaluator({
  client: oai,
  model: "gpt-4-turbo",
  evaluationDescription: "Please rate the relevance of the response from 0 (not at all relevant) to 1 (highly relevant), considering whether the AI stayed on topic and provided a reasonable answer."
});

const distanceEval = () => createAccuracyEvaluator({
  weights: { factual: 0.5, semantic: 0.0 }
});

const fluencyEval = () => createEvaluator({
  client: oai,
  model: "gpt-4-turbo",
  evaluationDescription: "Please rate the fluency of the response from 0 (not fluent) to 1 (very fluent), considering the grammatical correctness and natural flow."
});

const completenessEval = () => createEvaluator({
  client: oai,
  model: "gpt-4-turbo",
  evaluationDescription: "Please rate the completeness of the response from 0 (not at all complete) to 1 (completely answered), considering whether the AI addressed all parts of the prompt."
});

const context Certainly! Continuing from where we left off:

```typescript
const contextRelevanceEval = () => createContextEvaluator({ type: "relevance" });

const compositeEvaluator = createWeightedEvaluator({
  evaluators: {
    relevance: relevanceEval(),
    fluency: fluencyEval(),
    completeness: completenessEval(),
    accuracy: distanceEval(),
    contextRelevance: contextRelevanceEval()
  },
  weights: {
    relevance: 0.2,
    fluency: 0.2,
    completeness: 0.2,
    accuracy: 0.2,
    contextRelevance: 0.2
  }
});

const data = [
  {
    prompt: "How can I reset my password?",
    completion: "You can reset your password by clicking on the 'Forgot Password' link on the login page.",
    expectedCompletion: "To reset your password, click on the 'Forgot Password' link on the login page.",
    contexts: ["User asked, 'How can I reset my password?'", "Support response: 'You can reset your password by clicking on the 'Forgot Password' link on the login page.'"],
    groundTruth: "The AI response should guide the user on how to reset their password."
  }
];

const result = await compositeEvaluator({ data });
console.log(result.scoreResults);
```

### Document Retrieval System

#### Scenario

A search engine wants to evaluate the relevance and precision of its document retrieval system to ensure it retrieves the most relevant documents for user queries.

#### Approach

1. **Model-Graded Evaluators**: Use relevance and coverage evaluators to assess the relevance and completeness of retrieved documents.
2. **Accuracy Evaluators**: Measure the accuracy of document summaries by comparing them to reference summaries.
3. **Context Evaluators**: Assess the precision and recall of retrieved documents within the context of user queries.

#### Example Code

```typescript
import { createEvaluator, createAccuracyEvaluator, createContextEvaluator, createWeightedEvaluator } from "evalz";
import OpenAI from "openai";

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  organization: process.env["OPENAI_ORG_ID"]
});

const relevanceEval = () => createEvaluator({
  client: oai,
  model: "gpt-4-turbo",
  evaluationDescription: "Please rate the relevance of the document from 0 (not relevant) to 1 (highly relevant), considering how well the document addresses the query."
});

const distanceEval = () => createAccuracyEvaluator({
  weights: { factual: 0.5, semantic: 0.0 }
});

const coverageEval = () => createEvaluator({
  client: oai,
  model: "gpt-4-turbo",
  evaluationDescription: "Please rate the coverage of the document from 0 (incomplete) to 1 (complete), considering whether the document addresses all parts of the query."
});

const contextPrecisionEval = () => createContextEvaluator({ type: "precision" });
const contextRecallEval = () => createContextEvaluator({ type: "recall" });

const compositeEvaluator = createWeightedEvaluator({
  evaluators: {
    relevance: relevanceEval(),
    coverage: coverageEval(),
    accuracy: distanceEval(),
    contextPrecision: contextPrecisionEval(),
    contextRecall: contextRecallEval()
  },
  weights: {
    relevance: 0.25,
    coverage: 0.25,
    accuracy: 0.25,
    contextPrecision: 0.125,
    contextRecall: 0.125
  }
});

const data = [
  {
    prompt: "What are the symptoms of COVID-19?",
    completion: "The most common symptoms of COVID-19 are fever, dry cough, and tiredness.",
    expectedCompletion: "Symptoms of COVID-19 include fever, dry cough, and tiredness among others.",
    contexts: ["User query: 'What are the symptoms of COVID-19?'", "Retrieved document: 'The most common symptoms of COVID-19 are fever, dry cough, and tiredness.'"],
    groundTruth: "The retrieval system should return documents that list the symptoms of COVID-19."
  }
];

const result = await compositeEvaluator({ data });
console.log(result.scoreResults);
```



## Contributing
Contributions are welcome! Please submit a pull request or open an issue to propose changes or additions.
