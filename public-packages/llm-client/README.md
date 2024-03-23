# llm-client

**this is in alpha and not ready for production use - documentation is incomplete**

---

<div align="center">
  <a aria-label="NPM version" href="https://twitter.com/dimitrikennedy">
    <img alt="llm-client" src="https://img.shields.io/twitter/follow/dimitrikennedy?style=social&labelColor=000000">
  </a>
  <a aria-label="GH Issues" href="https://www.npmjs.com/package/llm-client">
    <img alt="llm-client" src="https://img.shields.io/github/issues/hack-dance/island-ai.svg?style=flat-square&labelColor=000000">
  </a>
  
  <a aria-label="NPM version" href="https://www.npmjs.com/package/llm-client">
    <img alt="llm-client" src="https://img.shields.io/npm/v/llm-client.svg?style=flat-square&logo=npm&labelColor=000000&label=llm-client">
  </a>
</div>





<p align="center">
  A universal LLM client - extends the official openai sdk to provide support for providers that do not adhere to the same api and format, like Anthropic or Azure. One universal sdk for all the top LLMs from Together, OpenAI, Microsoft, Anyscale and Anthropic
</p>

## Installation

with pnpm
```bash
$ pnpm add llm-client openai
```
with npm
```bash
$ npm install llm-client openai
```
with bun
```bash
$ bun add llm-client openai
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


### Anthropic
...more coming...

Completed:
- standard chat completions
- streaming chat completions

Coming soon:
- function calling
