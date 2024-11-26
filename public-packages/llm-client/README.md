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
    <img alt="Island AI" src="https://img.shields.io/badge/Part of Island AI-000000.svg?style=flat-square&labelColor=000000&logo=data:image/svg+xml;base64...">
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

- standard chat completions
- streaming chat completions
- function calling
- context caching support for better token optimization (must be a paid API key)

The Google generative-ai sdk is required when using the google provider - we only use the types provided by the sdk.

```bash
  bun add @google/generative-ai-sdk
```

To use any of the above functionality, the schema is effectively the same since we translate the OpenAI params spec into Gemini's model spec.

#### Context Caching

[Context Caching](https://ai.google.dev/gemini-api/docs/caching) is a feature specific to Gemini that helps cut down on duplicate token usage by allowing you to create a cache with a TTL with which you can provide context to the model that you've already obtained from elsewhere.

To use Context Caching you need to create a cache before you call generate via `googleClient.cacheManager.create({})` like so:

```typescript
const cacheResponse = await googleClient.cacheManager.create({
      model: "gemini-1.5-flash-8b",
      messages: [
        {
          role: "user",
          content: "What is the capital of Montana?"
        }
      ],
      ttlSeconds: 3600, // Cache for 1 hour,
      max_tokens: 1000
    })

    // Now use the cached content in a new completion
    const completion = await googleClient.chat.completions.create({
      model: "gemini-1.5-flash-8b",
      messages: [
        {
          role: "user",
          content: "What state is it in?"
        }
      ],
      additionalProperties: {
        cacheName: cacheResponse.name
      },
      max_tokens: 1000
    })
```

#### Gemini OpenAI Compatibility

Gemini does support [OpenAI compatibility](https://ai.google.dev/gemini-api/docs/openai#node.js) for it's Node client but given that it's in beta and it has some limitations around structured output and images we're not using it directly in this library.

That said, you can use it quite easily with llm-polyglot if you like.

Here's a sample:

```typescript
const googleClient = createLLMClient({
  provider: "openai",
  apiKey: "gemini_api_key",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})


const completion = await openai.chat.completions.create({
  model: "gemini-1.5-flash",
  max_tokens: 1000,
  messages: [
    { role: "user", content: "My name is Dimitri Kennedy." }
  ]
});
```

```typescript
const client = createLLMClient({ provider: "google" });

// With context caching
const cache = await client.cacheManager.create({
  model: "gemini-1.5-flash-8b",
  messages: [{ role: "user", content: "Context to cache" }],
  ttlSeconds: 3600
});

const completion = await client.chat.completions.create({
  model: "gemini-1.5-flash-8b",
  messages: [{ role: "user", content: "Follow-up question" }],
  additionalProperties: {
    cacheName: cache.name
  }
});
```

## Error Handling

```typescript
try {
  const completion = await client.chat.completions.create({
    model: "invalid-model",
    messages: [{ role: "user", content: "Hello!" }]
  });
} catch (error) {
  if (error.code === 'model_not_found') {
    console.error('Invalid model specified');
  }
  // Provider-specific error handling
  if (error.provider === 'anthropic') {
    // Handle Anthropic-specific errors
  }
}
```

## OpenAI-Compatible Providers

These providers work directly with OpenAI client configuration:

| Provider | Configuration | Available Models |
|----------|--------------|------------------|
| Together | `baseURL: "https://api.together.xyz/v1"` | Mixtral, Llama, OpenChat, Yi |
| Anyscale | `baseURL: "https://api.endpoints.anyscale.com/v1"` | Mistral, Llama |
| Perplexity | `baseURL: "https://api.perplexity.ai"` | pplx-* models |

```typescript
// Together.ai example
const client = createLLMClient({
  provider: "openai",
  baseURL: "https://api.together.xyz/v1"
});

// Use any Together-hosted model
const completion = await client.chat.completions.create({
  model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  messages: [{ role: "user", content: "Hello!" }]
});
```

## OpenAI

The llm-polyglot library also provides support for the OpenAI API, which is the default provider and will just proxy directly to the OpenAI sdk.

## Integration with Island AI

Part of the Island AI toolkit:

- [`zod-stream`](https://www.npmjs.com/package/zod-stream): Structured streaming
- [`instructor`](https://www.npmjs.com/package/@instructor-ai/instructor): High-level extraction
- [`stream-hooks`](https://www.npmjs.com/package/stream-hooks): React streaming hooks
- [`evalz`](https://www.npmjs.com/package/evalz): LLM evaluation

## Contributing

We welcome contributions! Check out:

- [Island AI Documentation](https://island.hack.dance)
- [GitHub Issues](https://github.com/hack-dance/island-ai/issues)
- [Twitter](https://twitter.com/dimitrikennedy)

## License

MIT © [hack.dance](https://hack.dance)
