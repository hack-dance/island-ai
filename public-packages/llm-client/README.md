<div align="center">
  <h1>llm-polyglot</h1>
</div>
<br />

<p align="center"><i>> Universal client for LLM providers with OpenAI-compatible interface</i></p>
<br />

<div align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/llm-polyglot">
    <img alt="llm-polyglot" src="https://img.shields.io/npm/v/llm-polyglot.svg?style=flat-square&logo=npm&labelColor=000000&label=llm-polyglot">
  </a>
   <a aria-label="Island AI" href="https://github.com/hack-dance/island-ai">
    <img alt="Island AI" src="https://img.shields.io/badge/Part of Island AI-000000.svg?style=flat-square&labelColor=000000&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMTQuNjkgMjU5LjI0Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjZmZmOwogICAgICAgIHN0cm9rZS13aWR0aDogMHB4OwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTEwMC42MSwxNzguNDVoMTMuOTd2LTE5LjYyaC0xMy45N3YxOS42MlptMC0xMDguOTZ2MjMuNzJoMTMuOTd2LTIzLjcyaC0xMy45N1ptLTIuNzksMTg5Ljc1aDE5LjU2bC0yLjc5LTI4LjkyaC0xMy45N2wtMi43OSwyOC45MlptMi43OS0xMzcuNjJoMTMuOTd2LTE5LjYyaC0xMy45N3YxOS42MlptMCwyOC40MWgxMy45N3YtMTkuNjJoLTEzLjk3djE5LjYyWiIvPgogICAgICAgIDxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iOTQuNSIgY3k9IjY5LjExIiByPSIxNC4yNCIvPgogICAgICAgIDxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iMTIwLjE5IiBjeT0iNjkuMTEiIHI9IjE0LjI0Ii8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtMjE0LjI1LDYyLjU5Yy0uNzktLjc1LTE4Ljc1LTE3LjQ4LTQ5LjQ2LTE5LjA0bDE1Ljc1LTUuODhjLTEuNjctMi40Ni00LjAxLTQuMTgtNi4zNS02LS4yMy0uMTgtLjAzLS41OC4yMy0uNTcsMy40NS4xNyw2LjgyLDEuNzUsMTAuMTIsMi42OCwxLjA2LjMsMi4wOS43MiwzLjA4LDEuMjRsMTkuNDUtNy4yNmMuNTMtLjIuOS0uNzEuOTEtMS4yOHMtLjMyLTEuMDktLjg1LTEuMzJjLTEuMDQtLjQ0LTI1Ljk2LTEwLjc2LTU3LjM1Ljk2LTEuMTkuNDQtMi4zNy45MS0zLjU0LDEuNDFsMTMuNTEtMTMuMTNjLTIuMTgtLjY3LTQuNC0uOTUtNi42My0xLjQ0LS4zOC0uMDgtLjQxLS43NSwwLS44MSwzLjEyLS40NCw2LjU0LS45OCw5Ljg3LS45MWw5LjEzLTguODdjLjQxLS40LjUzLTEuMDEuMzItMS41My0uMjItLjUzLS44LS43OS0xLjMxLS44Ny0uOTYuMDEtMjMuNy40OS00My45NiwyMC4xOCwwLDAsMCwwLDAsMGwtMjAuMDcsMTkuNzYtMTkuNTgtMTkuNzZDNjcuMjUuNDksNDQuNTEuMDEsNDMuNTUsMGMtLjU2LjA1LTEuMDkuMzQtMS4zMS44Ny0uMjIuNTMtLjA5LDEuMTQuMzIsMS41M2w1LjY3LDUuNTFjNS4xLjIyLDEwLjE0LjcxLDE0LjQzLDQsLjQyLjMyLjIsMS4xMi0uMzkuOTMtMi41OC0uODYtNi4wMi0uODctOS4zOS0uNGwxNS41NiwxNS4xMmMtMS4xNy0uNS0yLjM2LS45Ny0zLjU0LTEuNDEtMzEuNC0xMS43Mi01Ni4zLTEuNDEtNTcuMzUtLjk2LS41Mi4yMi0uODYuNzUtLjg1LDEuMzJzLjM3LDEuMDguOTEsMS4yOGwxMS4wNiw0LjEzYzQuNDYtMS40OCw4LjctMi4zOSwxMC40Mi0yLjU1LjU3LS4wNS41Ni43My4xMi45MS0xLjg2Ljc0LTMuNjEsMi4yOS01LjI3LDMuNjFsMjUuOTQsOS42OEMxOS4xOCw0NS4xMSwxLjIyLDYxLjg0LjQzLDYyLjU5Yy0uNDEuMzktLjU1LDEtLjM0LDEuNTMuMjEuNTMuNzMuODgsMS4zLjg4aDEzLjljLjE1LS4wOS4zMS0uMTkuNDUtLjI4LDUuNzktMy41OCwxMS45NC02LjE5LDE4LjE4LTguODcuNjgtLjI5LDEuMjguNjQuNiwxLjAzLTMuNTQsMi4wMy02LjU0LDUuMS05LjQ5LDguMTNoMTQuNTljNC4yNy0zLjExLDguODItNS43LDEzLjE2LTguNy41OS0uNDEsMS4yMi40OS43NS45Ny0yLjM1LDIuMzgtNC40NCw1LjA2LTYuNTMsNy43NGgxMTYuODNjLS45OS0zLjE5LTIuMDItNi4zNS00LjEzLTkuMDQtLjMzLS40Mi4xOC0uOTYuNTktLjU5LDMuMzYsMy4wMSw3LjM3LDYuMTUsMTEuMDIsOS42M2gxNS4zNGMtMS4zOC0zLjUyLTMuMDUtNi44Mi01LjcxLTguNjctLjU0LS4zNy0uMDgtMS4xNS41MS0uODcsNC40LDIuMDgsOC4yNyw1Ljg2LDExLjY1LDkuNTRoMjAuMmMuNTcsMCwxLjA5LS4zNSwxLjMtLjg4LjIxLS41My4wOC0xLjE0LS4zNC0xLjUzWiIvPgogICAgICA8L2c+CiAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTEwMS4wNiwyMjEuMzNoMTMuOTd2LTMzLjZoLTEzLjk3djMzLjZaIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=">
  </a>
  <a aria-label="Made by hack.dance" href="https://hack.dance">
    <img alt="docs" src="https://img.shields.io/badge/MADE%20BY%20HACK.DANCE-000000.svg?style=flat-square&labelColor=000000">
  </a>
  <a aria-label="Twitter" href="https://twitter.com/dimitrikennedy">
    <img alt="follow" src="https://img.shields.io/twitter/follow/dimitrikennedy?style=social&labelColor=000000">
  </a>
</div>

`llm-polyglot` extends the OpenAI SDK to provide a consistent interface across different LLM providers. Use the same familiar OpenAI-style API with Anthropic, Google, and others.

## Provider Support

**Native API Support Status:**

| Provider API | Status | Chat | Basic Stream | Functions/Tool calling | Function streaming | Notes |
|-------------|---------|------|--------------|---------------------|-----------------|--------|
| OpenAI | ✅ | ✅ | ✅ | ✅ | ✅ | Direct SDK proxy |
| Anthropic | ✅ | ✅ | ✅ | ❌ | ❌ | Claude models |
| Google | ✅ | ✅ | ✅ | ✅ | ❌ | Gemini models + context caching |
| Azure | 🚧 | ✅ | ✅ | ❌ | ❌ | OpenAI model hosting |
| Cohere | ❌ | - | - | - | - | Not supported |
| AI21 | ❌ | - | - | - | - | Not supported |

Stream Types:

- **Basic Stream**: Simple text streaming
- **Partial JSON Stream**: Progressive JSON object construction during streaming
- **Function Stream**: Streaming function/tool calls and their results

<br />

**OpenAI-Compatible Hosting Providers:**

These providers use the OpenAI SDK format, so they work directly with the OpenAI client configuration:

| Provider | How to Use | Available Models |
|----------|------------|------------------|
| Together | Use OpenAI client with Together base URL | Mixtral, Llama, OpenChat, Yi, others |
| Anyscale | Use OpenAI client with Anyscale base URL | Mistral, Llama, others |
| Perplexity | Use OpenAI client with Perplexity base URL | pplx-* models |
| Replicate | Use OpenAI client with Replicate base URL | Various open models |

## Installation

```bash
# Base installation
npm install llm-polyglot openai

# Provider-specific SDKs (as needed)
npm install @anthropic-ai/sdk    # For Anthropic
npm install @google/generative-ai # For Google/Gemini
```

## Basic Usage

```typescript
import { createLLMClient } from "llm-polyglot";

// Initialize provider-specific client
const client = createLLMClient({
  provider: "anthropic" // or "google", "openai", etc.
});

// Use consistent OpenAI-style interface
const completion = await client.chat.completions.create({
  model: "claude-3-opus-20240229",
  messages: [{ role: "user", content: "Hello!" }],
  max_tokens: 1000
});
```

## Provider-Specific Features

### Anthropic

The llm-polyglot library provides support for Anthropic's API, including standard chat completions, streaming chat completions, and function calling. Both input paramaters and responses match exactly those of the OpenAI SDK - for more detailed documentation please see the OpenAI docs: [https://platform.openai.com/docs/api-reference](https://platform.openai.com/docs/api-reference)

The anthropic sdk is required when using the anthropic provider - we only use the types provided by the sdk.

```bash
  bun add @anthropic-ai/sdk
```

```typescript
const client = createLLMClient({ provider: "anthropic" });

// Standard completion
const response = await client.chat.completions.create({
  model: "claude-3-opus-20240229",
  messages: [{ role: "user", content: "Hello!" }]
});

// Streaming
const stream = await client.chat.completions.create({
  model: "claude-3-opus-20240229",
  messages: [{ role: "user", content: "Hello!" }],
  stream: true
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}

// Tool/Function calling
const result = await client.chat.completions.create({
  model: "claude-3-opus-20240229",
  messages: [{ role: "user", content: "Analyze this data" }],
  tools: [{
    type: "function",
    function: {
      name: "analyze",
      parameters: {
        type: "object",
        properties: {
          sentiment: { type: "string" }
        }
      }
    }
  }]
});
```

### Google (Gemini)

The llm-polyglot library provides support for Google's Gemini API including:

- Standard chat completions with OpenAI-compatible interface
- Streaming chat completions with delta updates
- Function/tool calling with automatic schema conversion
- Context caching for token optimization (requires paid API key)
- Grounding support with Google Search integration
- Safety settings and model generation config
- Session management for stateful conversations
- Automatic response transformation with source attribution

The Google generative-ai sdk is required when using the google provider:

```bash
  bun add @google/generative-ai
```

To use any of the above functionality, the schema matches OpenAI's format since we translate the OpenAI params spec into Gemini's model spec.

#### Basic Usage

```typescript
const client = createLLMClient({ provider: "google" });

// Standard completion
const completion = await client.chat.completions.create({
  model: "gemini-1.5-flash-latest",
  messages: [{ role: "user", content: "Hello!" }],
  max_tokens: 1000
});

// With grounding (Google Search)
const groundedCompletion = await client.chat.completions.create({
  model: "gemini-1.5-flash-latest",
  messages: [{ role: "user", content: "What are the latest AI developments?" }],
  groundingThreshold: 0.7,
  max_tokens: 1000
});

// With safety settings
const safeCompletion = await client.chat.completions.create({
  model: "gemini-1.5-flash-latest",
  messages: [{ role: "user", content: "Tell me a story" }],
  additionalProperties: {
    safetySettings: [{
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    }]
  }
});

// With session management
const sessionCompletion = await client.chat.completions.create({
  model: "gemini-1.5-flash-latest",
  messages: [{ role: "user", content: "Remember this: I'm Alice" }],
  additionalProperties: {
    sessionId: "user-123"
  }
});
```

#### Context Caching

[Context Caching](https://ai.google.dev/gemini-api/docs/caching) is a feature specific to Gemini that helps cut down on duplicate token usage by allowing you to create a cache with a TTL:

```typescript
// Create a cache
const cache = await client.cacheManager.create({
  model: "gemini-1.5-flash-8b",
  messages: [{ role: "user", content: "Context to cache" }],
  ttlSeconds: 3600 // Cache for 1 hour
});

// Use the cached context
const completion = await client.chat.completions.create({
  model: "gemini-1.5-flash-8b",
  messages: [{ role: "user", content: "Follow-up question" }],
  additionalProperties: {
    cacheName: cache.name
  }
});
```

#### Function/Tool Calling

```typescript
const completion = await client.chat.completions.create({
  model: "gemini-1.5-flash-latest",
  messages: [{ role: "user", content: "Analyze this data" }],
  tools: [{
    type: "function",
    function: {
      name: "analyze",
      parameters: {
        type: "object",
        properties: {
          sentiment: { type: "string" }
        }
      }
    }
  }],
  tool_choice: {
    type: "function",
    function: { name: "analyze" }
  }
});
```

## Error Handling

```
