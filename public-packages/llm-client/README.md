# llm-polyglot

**this is still in beta and may not be ready for production use - documentation is incomplete**

---

<div align="center">
  <a aria-label="NPM version" href="https://twitter.com/dimitrikennedy">
    <img alt="llm-polyglot" src="https://img.shields.io/twitter/follow/dimitrikennedy?style=social&labelColor=000000">
  </a>
  <a aria-label="GH Issues" href="https://www.npmjs.com/package/llm-polyglot">
    <img alt="llm-polyglot" src="https://img.shields.io/github/issues/hack-dance/island-ai.svg?style=flat-square&labelColor=000000">
  </a>
  
  <a aria-label="NPM version" href="https://www.npmjs.com/package/llm-polyglot">
    <img alt="llm-polyglot" src="https://img.shields.io/npm/v/llm-polyglot.svg?style=flat-square&logo=npm&labelColor=000000&label=llm-polyglot">
  </a>
</div>


<p align="center">
  A universal LLM client - extends the official openai sdk to provide support for providers that do not adhere to the same api and format, like Anthropic or Azure. One universal sdk for all the top LLMs from Together, Gemini, OpenAI, Microsoft, Anyscale and Anthropic
</p>

## Installation

with pnpm
```bash
$ pnpm add llm-polyglot openai
```
with npm
```bash
$ npm install llm-polyglot openai
```
with bun
```bash
$ bun add llm-polyglot openai
```


## Basic Usage
```typescript
  const anthropicClient = createLLMClient({
    provider: "anthropic"
  })

  const completion = await anthropicClient.chat.completions.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: "hey how are you"
      }
    ]
  })
```


## Anthropic
The llm-polyglot library provides support for Anthropic's API, including standard chat completions, streaming chat completions, and function calling. Both input paramaters and responses match exactly those of the OpenAI SDK - for more detailed documentation please see the OpenAI docs: [https://platform.openai.com/docs/api-reference](https://platform.openai.com/docs/api-reference)


The anthropic sdk is required when using the anthropic provider - we only use the types provided by the sdk.
```bash
  bun add @anthropic-ai/sdk
```


### Standard Chat Completions
To create a standard chat completion using the Anthropic API, you can use the create method on the chat.completions object:

```typescript
const completion = await anthropicClient.chat.completions.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1000,
  messages: [
    { role: "user", content: "My name is Dimitri Kennedy." }
  ]
});
```

### Streaming Chat Completions
To create a streaming chat completion using the Anthropic API, you can set the stream option to true in the create method:

```typescript
const completion = await anthropicClient.chat.completions.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1000,
  stream: true,
  messages: [
    { role: "user", content: "hey how are you" }
  ]
});

let final = "";
for await (const data of completion) {
  final += data.choices?.[0]?.delta?.content ?? "";
}
```

### Function Calling
The llm-polyglot library supports function calling for the Anthropic API. To use this feature, you need to provide the tool_choice (optional) and tools options in the create method

Anthropic does not support the tool_choice option, so this instead appends the instruction to use the provided tool to the latest user message.

```typescript
const completion = await anthropicClient.chat.completions.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1000,
  messages: [
    { role: "user", content: "My name is Dimitri Kennedy." }
  ],
  tool_choice: {
    type: "function",
    function: {
      name: "say_hello"
    }
  },
  tools: [
    {
      type: "function",
      function: {
        name: "say_hello",
        description: "Say hello",
        parameters: {
          type: "object",
          properties: {
            name: { type: "string" }
          },
          required: ["name"],
          additionalProperties: false
        }
      }
    }
  ]
});
```

The tool_choice option specifies the function to call, and the tools option defines the available functions and their parameters. The response from the Anthropic API will include the function call and its arguments in the tool_calls field.


## Gemini
The llm-polyglot library provides support for Google's Gemini API including:
  * standard chat completions
  * streaming chat completions
  * function calling
  * context caching support for better token optimization (must be a paid API key)


The Google generative-ai sdk is required when using the google provider - we only use the types provided by the sdk.
```bash
  bun add @google/generative-ai-sdk
```

To use any of the above functionality, the schema is effectively the same since we translate the OpenAI params spec into Gemini's model spec.

### Context Caching
[Context Caching](https://ai.google.dev/gemini-api/docs/caching?lang=python) is a feature specific to Gemini that helps cut down on duplicate token usage by allowing you to create a cache with a TTL with which you can provide context to the model that you've already obtained from elsewhere.

To use Context Caching you need to create a cache before you call generate via `googleClient.cacheManager.create({})` like so:

```
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



## OpenAI
The llm-polyglot library also provides support for the OpenAI API, which is the default provider and will just proxy directly to the OpenAI sdk.


## Contributing
Contributions are welcome! Please open an issue or submit a pull request if you have any improvements, bug fixes, or new features to add.

## License
This project is licensed under the MIT License.