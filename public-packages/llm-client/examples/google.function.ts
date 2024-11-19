import { createLLMClient } from "@/index"

const googleClient = createLLMClient({
  provider: "google"
})

/*************************
 * Simple Chat
 *************************/
const completion = await googleClient.chat.completions.create({
  model: "gemini-1.5-flash-latest",
  messages: [
    {
      role: "user",
      content: "How much does a soul weigh?"
    }
  ],
  max_tokens: 1000
})

console.log(JSON.stringify(completion, null, 2))

/*************************
 * Simple Chat
 *************************/
const simpleChat = await googleClient.chat.completions.create({
  model: "gemini-1.5-flash-latest",
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: "My name is Spartacus."
    }
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
            name: {
              type: "string"
            }
          },
          required: ["name"]
          //additionalProperties: false
        }
      }
    }
  ]
})

console.log(JSON.stringify(simpleChat, null, 2))

/*************************
 * Streaming Chat
 *************************/
const streamingChat = await googleClient.chat.completions.create({
  model: "gemini-1.5-flash-latest",
  messages: [
    {
      role: "user",
      content: "Write an essay about the chemical composition of dirt."
    }
  ],
  max_tokens: 1000,
  stream: true
})

let final = ""
console.log({ streamingChat })
for await (const message of streamingChat) {
  console.log({ message })
  final += message.choices?.[0].delta?.content ?? ""
}

////////////////////////////////////////
// content caching
// note: need pay-as-you-go account - not available on free tier
////////////////////////////////////////

// Generate a very long string
let longContentString = ""
for (let i = 0; i < 32001; i++) {
  longContentString += "Purple cats drink gatorade."
  longContentString += i % 8 === 7 ? "\n" : " "
}

// Add content to cache
const cacheResult = await googleClient.cacheManager.create({
  //const cacheResult = await googleClient.createCacheManager({
  ttlSeconds: 600,
  model: "models/gemini-1.5-pro-001",
  messages: [{ role: "user", content: longContentString }],
  max_tokens: 1000
})

// Get name from cache result
const cacheName = cacheResult?.name ?? ""
console.log("Cache name: ", cacheName)

// List caches
const cacheListResult = await googleClient.cacheManager.list()
console.log("cacheListResult: ", JSON.stringify(cacheListResult, null, 2))

// Delete cache
// await googleClient.cacheManager.delete(cacheName)
// cacheListResult = await googleClient.cacheManager.list()
// console.log("cacheListResult after delete: ", JSON.stringify(cacheListResult, null, 2))

// Delete all caches
// cacheListResult?.cachedContents?.forEach(async cache => {
//   if (cache.name) await googleClient.cacheManager.delete(cache.name)
// })

// Pass name into additionalProperties
const completion4 = await googleClient.chat.completions.create({
  // model: "gemini-1.5-flash-latest",
  model: "models/gemini-1.5-pro-001",
  messages: [
    {
      role: "user",
      content: "What do purple cats drink?"
    }
  ],
  max_tokens: 10000,
  additionalProperties: {
    cacheName
  }
})

console.log("Completion: ", JSON.stringify(completion4, null, 2))
