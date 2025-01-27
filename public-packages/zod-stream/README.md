<div align="center">
  <h1>zod-stream</h1>
</div>
<br />

<p align="center"><i>> Type-safe structured extraction from LLM streams with progressive validation</i></p>

<br />

<div align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/zod-stream">
    <img alt="zod-stream" src="https://img.shields.io/npm/v/zod-stream.svg?style=flat-square&logo=npm&labelColor=000000&label=zod-stream">
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
<br />

`zod-stream` adds structured output validation and streaming capabilities to LLM responses. Built on top of [`schema-stream`](https://www.npmjs.com/package/schema-stream), it enables type-safe extraction with progressive validation.

## Key Features

- 🔄 Stream structured LLM outputs with validation
- 🎯 Multiple response modes (TOOLS, FUNCTIONS, JSON, etc.)
- 📝 OpenAI client integration
- 🌳 Progressive validation with partial results
- ⚡ Built on schema-stream
- 🔍 Full TypeScript support

## Why zod-stream?

`zod-stream` solves key challenges in handling streaming LLM responses:

- **Dependency Management**: Process data as soon as dependencies are met, rather than waiting for complete responses

  ```typescript
  if (isPathComplete(['user', 'preferences'], chunk)) {
    // Start personalizing immediately, don't wait for content
    initializeUserExperience(chunk.user.preferences);
  }
  ```

- **Type-Safe LLM Integration**: Full TypeScript support for structured outputs from OpenAI and other providers

  ```typescript
  const params = withResponseModel({
    response_model: { schema, name: "Extract" },
    mode: "TOOLS"  // or "FUNCTIONS", "JSON", etc.
  });
  ```

- **Progressive Processing**: Built on `schema-stream` for immediate access to partial results

  ```typescript
  for await (const chunk of stream) {
    // Safely access partial data with full type inference
    chunk._meta._completedPaths.forEach(path => {
      processDependency(path, chunk);
    });
  }
  ```

- **Provider Flexibility**: Consistent interface across different LLM response formats

  ```typescript
  // Works with various response modes
  const stream = OAIStream({ res: completion });  // OpenAI tools/functions
  const stream = JSONStream({ res: completion }); // Direct JSON
  ```

Think of it as a type-safe pipeline for handling streaming LLM data where you need to:

- Start processing before the full response arrives
- Ensure type safety throughout the stream
- Handle complex data dependencies
- Work with multiple LLM response formats

## Installation

```bash
# npm
npm install zod-stream zod openai

# pnpm
pnpm add zod-stream zod openai

# bun
bun add zod-stream zod openai
```

## Core Concepts

The `ZodStream` client provides real-time validation and metadata for streaming LLM responses:

```typescript
import ZodStream from "zod-stream";
import { z } from "zod";

const client = new ZodStream({
  debug: true  // Enable debug logging
});

// Define your extraction schema
const schema = z.object({
  content: z.string(),
  metadata: z.object({
    confidence: z.number(),
    category: z.string()
  })
});

// Create streaming extraction
const stream = await client.create({
  completionPromise: async () => {
    const response = await fetch("/api/extract", {
      method: "POST",
      body: JSON.stringify({ prompt: "..." })
    });
    return response.body;
  },
  response_model: {
    schema,
    name: "ContentExtraction"
  }
});

// Process with validation metadata
for await (const chunk of stream) {
  console.log({
    data: chunk,              // Partial extraction result
    isValid: chunk._meta._isValid,    // Current validation state
    activePath: chunk._meta._activePath,    // Currently processing path
    completedPaths: chunk._meta._completedPaths  // Completed paths
  });
}
```

## Progressive Processing

`zod-stream` enables processing dependent data as soon as relevant paths complete, without waiting for the full response:

```typescript
// Define schema for a complex analysis
const schema = z.object({
  user: z.object({
    id: z.string(),
    preferences: z.object({
      theme: z.string(),
      language: z.string()
    })
  }),
  content: z.object({
    title: z.string(),
    body: z.string(),
    metadata: z.object({
      keywords: z.array(z.string()),
      category: z.string()
    })
  }),
  recommendations: z.array(z.object({
    id: z.string(),
    score: z.number(),
    reason: z.string()
  }))
});

// Process data as it becomes available
for await (const chunk of stream) {
  // Start personalizing UI as soon as user preferences are ready
  if (isPathComplete(['user', 'preferences'], chunk)) {
    applyUserTheme(chunk.user.preferences.theme);
    setLanguage(chunk.user.preferences.language);
  }

  // Begin content indexing once we have title and keywords
  if (isPathComplete(['content', 'metadata', 'keywords'], chunk) && 
      isPathComplete(['content', 'title'], chunk)) {
    indexContent({
      title: chunk.content.title,
      keywords: chunk.content.metadata.keywords
    });
  }

  // Start fetching recommended content in parallel
  chunk._meta._completedPaths.forEach(path => {
    if (path[0] === 'recommendations' && path.length === 2) {
      const index = path[1] as number;
      const recommendation = chunk.recommendations[index];
      
      if (recommendation?.id) {
        prefetchContent(recommendation.id);
      }
    }
  });
}
```

This approach enables:

- Early UI updates based on user preferences
- Parallel processing of independent data
- Optimistic loading of related content
- Better perceived performance
- Resource optimization

## Stream Metadata

Every streamed chunk includes metadata about validation state:

```typescript
type CompletionMeta = {
  _isValid: boolean;           // Schema validation status
  _activePath: (string | number)[];     // Current parsing path
  _completedPaths: (string | number)[][]; // All completed paths
}

// Example chunk
{
  content: "partial content...",
  metadata: {
    confidence: 0.95
  },
  _meta: {
    _isValid: false,  // Not valid yet
    _activePath: ["metadata", "category"],
    _completedPaths: [
      ["content"],
      ["metadata", "confidence"]
    ]
  }
}
```

## Schema Stubs

Get typed stub objects for initialization:

```typescript
const schema = z.object({
  users: z.array(z.object({
    name: z.string(),
    age: z.number()
  }))
});

const client = new ZodStream();
const stub = client.getSchemaStub({
  schema,
  defaultData: {
    users: [{ name: "loading...", age: 0 }]
  }
});
```

## Debug Logging

Enable detailed logging for debugging:

```typescript
const client = new ZodStream({ debug: true });

// Logs will include:
// - Stream initialization
// - Validation results
// - Path completion
// - Errors with full context
```

### Using Response Models

The `withResponseModel` helper configures OpenAI parameters based on your schema and chosen mode:

```typescript
import { withResponseModel } from "zod-stream";
import { z } from "zod";

const schema = z.object({
  sentiment: z.string(),
  keywords: z.array(z.string()),
  confidence: z.number()
});

// Configure for OpenAI tools mode
const params = withResponseModel({
  response_model: {
    schema,
    name: "Analysis",
    description: "Extract sentiment and keywords"
  },
  mode: "TOOLS",
  params: {
    messages: [{ role: "user", content: "Analyze this text..." }],
    model: "gpt-4"
  }
});

const completion = await oai.chat.completions.create({
  ...params,
  stream: true
});
```

## Response Modes

`zod-stream` supports multiple modes for structured LLM responses:

```typescript
import { MODE } from "zod-stream";

const modes = {
  FUNCTIONS: "FUNCTIONS",   // OpenAI function calling
  TOOLS: "TOOLS",          // OpenAI tools API
  JSON: "JSON",            // Direct JSON response
  MD_JSON: "MD_JSON",      // JSON in markdown blocks
  JSON_SCHEMA: "JSON_SCHEMA", // JSON with schema validation
  THINKING_MD_JSON: "THINKING_MD_JSON" // JSON with thinking in markdown blocks (deepseek r1)
} as const;
```

### Mode-Specific Behaviors

#### TOOLS Mode

```typescript
// Results in OpenAI tool configuration
{
  tool_choice: {
    type: "function",
    function: { name: "Analysis" }
  },
  tools: [{
    type: "function",
    function: {
      name: "Analysis",
      description: "Extract sentiment and keywords",
      parameters: {/* Generated from schema */}
    }
  }]
}
```

#### FUNCTIONS Mode (Legacy)

```typescript
// Results in OpenAI function configuration
{
  function_call: { name: "Analysis" },
  functions: [{
    name: "Analysis",
    description: "Extract sentiment and keywords",
    parameters: {/* Generated from schema */}
  }]
}
```

#### JSON Mode

```typescript
// Results in direct JSON response configuration
{
  response_format: { type: "json_object" },
  messages: [
    {
      role: "system",
      content: "Return JSON matching schema..."
    },
    // ... user messages
  ]
}
```

### Response Parsing

Built-in parsers handle different response formats:

```typescript
import { 
  OAIResponseParser,
  OAIResponseToolArgsParser,
  OAIResponseFnArgsParser,
  OAIResponseJSONParser,
  thinkingJsonParser
} from "zod-stream";

// Automatic format detection
const result = OAIResponseParser(response);

// Format-specific parsing
const toolArgs = OAIResponseToolArgsParser(response);
const fnArgs = OAIResponseFnArgsParser(response);
const jsonContent = OAIResponseJSONParser(response);
const thinkingJson = thinkingJsonParser(response);
```

### Streaming Utilities

Handle streaming responses with built-in utilities:

```typescript
import { OAIStream, readableStreamToAsyncGenerator } from "zod-stream";

// Create streaming response
app.post("/api/stream", async (req, res) => {
  const completion = await oai.chat.completions.create({
    ...params,
    stream: true
  });

  return new Response(
    OAIStream({ res: completion })
  );
});

// Convert stream to async generator
const generator = readableStreamToAsyncGenerator(stream);
for await (const chunk of generator) {
  console.log(chunk);
}
```

### Path Tracking Utilities

Monitor completion status of specific paths:

```typescript
import { isPathComplete } from "zod-stream";

const activePath = ["analysis", "sentiment"];
const isComplete = isPathComplete(activePath, {
  _meta: {
    _completedPaths: [["analysis", "sentiment"]],
    _activePath: ["analysis", "keywords"],
    _isValid: false
  }
});
```

## Error Handling

`zod-stream` provides error handling at multiple levels:

```typescript
const stream = await client.create({
  completionPromise: async () => response.body,
  response_model: { schema }
});

let finalResult

// Path tracking for progressive updates
for await (const chunk of stream) {
  finalResult = chunk
  // Check which paths are complete
  console.log("Completed paths:", chunk._meta._completedPaths);
  console.log("Current path:", chunk._meta._activePath);
}

// Final validation happens after stream completes
const isValid = finalResult._meta._isValid
```

## Real-World Use Cases

### 1. Progressive Data Analysis

```typescript
const analysisSchema = z.object({
  marketData: z.object({
    trends: z.array(z.object({
      metric: z.string(),
      value: z.number()
    })),
    summary: z.string()
  }),
  competitors: z.array(z.object({
    name: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string())
  })),
  recommendations: z.object({
    immediate: z.array(z.string()),
    longTerm: z.array(z.string()),
    budget: z.number()
  })
});

for await (const chunk of stream) {
  // Start visualizing market trends immediately
  if (isPathComplete(['marketData', 'trends'], chunk)) {
    initializeCharts(chunk.marketData.trends);
  }

  // Begin competitor analysis in parallel
  chunk._meta._completedPaths.forEach(path => {
    if (path[0] === 'competitors' && path.length === 2) {
      const competitor = chunk.competitors[path[1] as number];
      fetchCompetitorData(competitor.name);
    }
  });

  // Start budget planning once we have immediate recommendations
  if (isPathComplete(['recommendations', 'immediate'], chunk) && 
      isPathComplete(['recommendations', 'budget'], chunk)) {
    planBudgetAllocation({
      actions: chunk.recommendations.immediate,
      budget: chunk.recommendations.budget
    });
  }
}
```

### 2. Document Processing Pipeline

```typescript
const documentSchema = z.object({
  metadata: z.object({
    title: z.string(),
    author: z.string(),
    topics: z.array(z.string())
  }),
  sections: z.array(z.object({
    heading: z.string(),
    content: z.string(),
    annotations: z.array(z.object({
      type: z.string(),
      text: z.string(),
      confidence: z.number()
    }))
  })),
  summary: z.object({
    abstract: z.string(),
    keyPoints: z.array(z.string()),
    readingTime: z.number()
  })
});

for await (const chunk of stream) {
  // Start document indexing as soon as metadata is available
  if (isPathComplete(['metadata'], chunk)) {
    indexDocument({
      title: chunk.metadata.title,
      topics: chunk.metadata.topics
    });
  }

  // Process sections as they complete
  chunk._meta._completedPaths.forEach(path => {
    if (path[0] === 'sections' && isPathComplete([...path, 'annotations'], chunk)) {
      const sectionIndex = path[1] as number;
      const section = chunk.sections[sectionIndex];
      
      // Process annotations for each completed section
      processAnnotations({
        heading: section.heading,
        annotations: section.annotations
      });
    }
  });

  // Generate preview once we have abstract and reading time
  if (isPathComplete(['summary', 'abstract'], chunk) && 
      isPathComplete(['summary', 'readingTime'], chunk)) {
    generatePreview({
      abstract: chunk.summary.abstract,
      readingTime: chunk.summary.readingTime
    });
  }
}
```

### 3. E-commerce Product Enrichment

```typescript
const productSchema = z.object({
  basic: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string()
  }),
  pricing: z.object({
    base: z.number(),
    discounts: z.array(z.object({
      type: z.string(),
      amount: z.number()
    })),
    final: z.number()
  }),
  inventory: z.object({
    status: z.string(),
    locations: z.array(z.object({
      id: z.string(),
      quantity: z.number()
    }))
  }),
  enrichment: z.object({
    seoDescription: z.string(),
    searchKeywords: z.array(z.string()),
    relatedProducts: z.array(z.string())
  })
});

for await (const chunk of stream) {
  // Start inventory checks as soon as basic info is available
  if (isPathComplete(['basic'], chunk)) {
    initializeProductCard(chunk.basic);
  }

  // Update pricing as soon as final price is calculated
  if (isPathComplete(['pricing', 'final'], chunk)) {
    updatePriceDisplay(chunk.pricing.final);
    
    // If we also have inventory, update buy button
    if (isPathComplete(['inventory', 'status'], chunk)) {
      updateBuyButton({
        price: chunk.pricing.final,
        status: chunk.inventory.status
      });
    }
  }

  // Start SEO optimization in parallel
  if (isPathComplete(['enrichment', 'seoDescription'], chunk) &&
      isPathComplete(['enrichment', 'searchKeywords'], chunk)) {
    optimizeProductSEO({
      description: chunk.enrichment.seoDescription,
      keywords: chunk.enrichment.searchKeywords
    });
  }

  // Prefetch related products as they're identified
  if (isPathComplete(['enrichment', 'relatedProducts'], chunk)) {
    prefetchRelatedProducts(chunk.enrichment.relatedProducts);
  }
}
```

### With Next.js API Routes

```typescript
// pages/api/extract.ts
import { withResponseModel, OAIStream } from "zod-stream";
import { z } from "zod";

const schema = z.object({
  summary: z.string(),
  topics: z.array(z.string()),
  sentiment: z.object({
    score: z.number(),
    label: z.string()
  })
});

export default async function handler(req, res) {
  const { content } = await req.json();

  const params = withResponseModel({
    response_model: { 
      schema,
      name: "ContentAnalysis"
    },
    mode: "TOOLS",
    params: {
      messages: [{ 
        role: "user", 
        content: `Analyze: ${content}` 
      }],
      model: "gpt-4"
    }
  });

  const stream = await oai.chat.completions.create({
    ...params,
    stream: true
  });

  return new Response(OAIStream({ res: stream }));
}
```

### With React and stream-hooks

```typescript
import { useJsonStream } from "stream-hooks";
import { z } from "zod";

const schema = z.object({
  summary: z.string(),
  topics: z.array(z.string())
});

function AnalysisComponent() {
  const [data, setData] = useState<z.infer<typeof schema>>();

  const { 
    loading, 
    error,
    startStream 
  } = useJsonStream({
    schema,
    onReceive: (data) => {
      setData(data)
    }
  });

  return (
    <div>
      <button 
        onClick={() => startStream({
          url: "/api/extract",
          method: "POST",
          body: { content: "..." }
        })}
        disabled={loading}
      >
        Start Analysis
      </button>

      {loading && <LoadingState paths={data._meta._completedPaths} />}
      {error && <ErrorDisplay error={error} />}
      
      <ProgressiveDisplay
        data={data}
        isComplete={data._meta._completedPaths.length > 0}
      />
    </div>
  );
}
```

## Integration with Island AI

Part of the Island AI toolkit:

- [`zod-stream`](https://www.npmjs.com/package/zod-stream): Structured streaming
- [`stream-hooks`](https://www.npmjs.com/package/stream-hooks): React streaming hooks
- [`schema-stream`](https://www.npmjs.com/package/schema-stream): Streaming JSON parser
- [`evalz`](https://www.npmjs.com/package/evalz): LLM evaluation
- [`llm-polyglot`](https://www.npmjs.com/package/llm-polyglot): Universal LLM client
- [`instructor`](https://www.npmjs.com/package/@instructor-ai/instructor): High-level extraction

## Contributing

We welcome contributions! Check out:

- [Island AI Documentation](https://island.hack.dance)
- [GitHub Issues](https://github.com/hack-dance/island-ai/issues)
- [Twitter](https://twitter.com/dimitrikennedy)

## License

MIT © [hack.dance](https://hack.dance)
