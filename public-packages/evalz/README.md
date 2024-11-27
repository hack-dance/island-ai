<div align="center">
  <h1>evalz</h1>
</div>
<br />

<p align="center"><i>> Structured evaluation toolkit for LLM outputs</i></p>
<br />

<div align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/evalz">
    <img alt="evalz" src="https://img.shields.io/npm/v/evalz.svg?style=flat-square&logo=npm&labelColor=000000&label=evalz">
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

## Overview

`evalz` provides structured evaluation tools for assessing LLM outputs across multiple dimensions. Built with TypeScript and integrated with OpenAI and Instructor, it enables both automated evaluation and human-in-the-loop assessment workflows.

### Key Capabilities

- 🎯 **Model-Graded Evaluation**: Leverage LLMs to assess response quality
- 📊 **Accuracy Measurement**: Compare outputs using semantic and lexical similarity
- 🔍 **Context Validation**: Evaluate responses against source materials
- ⚖️ **Composite Assessment**: Combine multiple evaluation types with custom weights

## Installation

Install `evalz` using your preferred package manager:

```bash
npm install evalz openai zod @instructor-ai/instructor

bun add evalz openai zod @instructor-ai/instructor

pnpm add evalz openai zod @instructor-ai/instructor
```

## When to Use evalz

### Model-Graded Evaluation

Provides human-like judgment for subjective criteria that can't be measured through pure text comparison

Use when you need qualitative assessment of responses:

- Evaluating RAG system output quality
- Assessing chatbot response appropriateness
- Validating content generation
- Measuring response coherence and fluency

```typescript
const relevanceEval = createEvaluator({
  client: oai,
  model: "gpt-4-turbo",
  evaluationDescription: "Rate relevance and quality from 0-1"
});
```

### Accuracy Evaluation

Gives objective measurements for cases where exact or semantic matching is important

Use for comparing outputs against known correct answers:

- Question-answering system validation
- Translation accuracy measurement
- Fact-checking systems
- Test case validation

```typescript
const accuracyEval = createAccuracyEvaluator({
  weights: { 
    factual: 0.6,  // Levenshtein distance weight
    semantic: 0.4   // Embedding similarity weight
  }
});
```

### Context Evaluation

Measures how well outputs utilize and stay faithful to provided context

Use for assessing responses against source materials:

- RAG system faithfulness
- Document summarization accuracy
- Knowledge extraction validation
- Information retrieval quality

```typescript
const contextEval = createContextEvaluator({ 
  type: "precision"  // or "recall", "relevance", "entities-recall" 
});
```

### Composite Evaluation

Provides balanced assessment across multiple dimensions of quality

Use for comprehensive system assessment:

- Production LLM monitoring
- A/B testing prompts and models
- Quality assurance pipelines
- Multi-factor response validation

```typescript
const compositeEval = createWeightedEvaluator({
  evaluators: {
    relevance: relevanceEval(),
    accuracy: accuracyEval(),
    context: contextEval()
  },
  weights: {
    relevance: 0.4,
    accuracy: 0.4,
    context: 0.2
  }
});
```

## Evaluator Types and Data Requirements

### Context Evaluator Types

```typescript
type ContextEvaluatorType = "entities-recall" | "precision" | "recall" | "relevance";
```

- **entities-recall**: Measures how well the completion captures named entities from the context
- **precision**: Evaluates how accurate the completion is compared to the context
- **recall**: Measures how much relevant information from the context is included
- **relevance**: Assesses how well the completion relates to the context

### Data Requirements by Evaluator Type

#### Model-Graded Evaluator

```typescript
type ModelGradedData = {
  prompt: string;
  completion: string;
  expectedCompletion?: string;  // Ignored for this evaluator type
}

const modelEval = createEvaluator({
  client: oai,
  model: "gpt-4-turbo",
  evaluationDescription: "Rate the response"
});


await modelEval({
  data: [{
    prompt: "What is TypeScript?",
    completion: "TypeScript is a typed superset of JavaScript"
  }]
});
```

#### Accuracy Evaluator

```typescript
type AccuracyData = {
  completion: string;
  expectedCompletion: string;  // Required for accuracy comparison
}

const accuracyEval = createAccuracyEvaluator({
  weights: { factual: 0.5, semantic: 0.5 }
});

await accuracyEval({
  data: [{
    completion: "TypeScript adds types to JavaScript",
    expectedCompletion: "TypeScript is JavaScript with type support"
  }]
});
```

#### Context Evaluator

```typescript
type ContextData = {
  prompt: string;
  completion: string;
  groundTruth: string;   // Required for context evaluation
  contexts: string[];    // Required for context evaluation
}

// Entities Recall - Checks named entities
const entitiesEval = createContextEvaluator({ 
  type: "entities-recall" 
});

// Precision - Checks accuracy against context
const precisionEval = createContextEvaluator({ 
  type: "precision" 
});

// Recall - Checks information coverage
const recallEval = createContextEvaluator({ 
  type: "recall" 
});

// Relevance - Checks contextual relevance
const relevanceEval = createContextEvaluator({ 
  type: "relevance" 
});

// Example usage
const data = {
  prompt: "What did the CEO say about Q3?",
  completion: "CEO Jane Smith reported 15% growth in Q3 2023",
  groundTruth: "The CEO announced strong Q3 performance",
  contexts: [
    "CEO Jane Smith presented Q3 results",
    "Company saw 15% revenue growth in Q3 2023"
  ]
};

await entitiesEval({ data: [data] });   // Focuses on "Jane Smith", "Q3", "2023"
await precisionEval({ data: [data] });  // Checks factual accuracy
await recallEval({ data: [data] });     // Checks information completeness
await relevanceEval({ data: [data] });  // Checks contextual relevance
```

#### Composite Evaluation

```typescript
// Can combine different evaluator types
const compositeEval = createWeightedEvaluator({
  evaluators: {
    entities: createContextEvaluator({ type: "entities-recall" }),
    accuracy: createAccuracyEvaluator({
      weights: { 
        factual: 0.9,   // High weight on exact matches
        semantic: 0.1    // Low weight on similar terms
      }
    }),
    quality: createEvaluator({
      client: oai,
      model: "gpt-4-turbo",
      evaluationDescription: "Rate quality"
    })
  },
  weights: {
    entities: 0.3,
    accuracy: 0.4,
    quality: 0.3
  }
});

// Must provide all required fields for each evaluator type
await compositeEval({
  data: [{
    prompt: "Summarize the earnings call",
    completion: "CEO Jane Smith announced 15% growth",
    expectedCompletion: "The CEO reported strong growth",
    groundTruth: "CEO discussed Q3 performance",
    contexts: [
      "CEO Jane Smith presented Q3 results",
      "Company saw 15% growth in Q3 2023"
    ]
  }]
});
```

## Cookbook

### RAG System Evaluation

Evaluate RAG responses for relevance to source documents and factual accuracy.

```typescript
const ragEvaluator = createWeightedEvaluator({
  evaluators: {
    // Check if named entities (people, places, dates) are preserved
    entities: createContextEvaluator({ 
      type: "entities-recall" 
    }),
    // Verify factual correctness using embedding similarity
    precision: createContextEvaluator({ 
      type: "precision" 
    }),
    // Check if all relevant information is included
    recall: createContextEvaluator({ 
      type: "recall" 
    }),
    // Assess overall contextual relevance
    relevance: createEvaluator({
      client: oai,
      model: "gpt-4-turbo",
      evaluationDescription: "Rate how well the response uses the context"
    })
  },
  weights: {
    entities: 0.2,   // Lower weight as it's more supplementary
    precision: 0.3,  // Higher weight for factual correctness
    recall: 0.3,     // Higher weight for information coverage
    relevance: 0.2   // Balance of overall relevance
  }
});

const result = await ragEvaluator({
  data: [{
    prompt: "What are the key financial metrics?",
    completion: "Revenue grew 25% to $10M in Q3 2023",
    groundTruth: "Q3 2023 saw 25% revenue growth to $10M",
    contexts: [
      "In Q3 2023, company revenue increased 25% to $10M",
      "Operating margins improved to 15%"
    ]
  }]
});

/* Example output:
{
  results: [{
    score: 0.85,
    scores: [
      { score: 1.0, evaluator: "entities" },    // Perfect entity preservation
      { score: 0.92, evaluator: "precision" },  // High factual accuracy
      { score: 0.75, evaluator: "recall" },     // Missing margin information
      { score: 0.78, evaluator: "relevance" }   // Good contextual relevance
    ],
    item: {
      prompt: "What were the key financial metrics?",
      completion: "Revenue grew 25% to $10M in Q3 2023",
      groundTruth: "Q3 2023 saw 25% revenue growth to $10M",
      contexts: [...]
    }
  }],
  scoreResults: {
    value: 0.85,
    individual: {
      entities: 1.0,
      precision: 0.92,
      recall: 0.75,
      relevance: 0.78
    }
  }
}
*/
```

### Content Moderation Evaluation

Binary evaluation for content policy compliance, useful for automated content filtering.

```typescript
const moderationEvaluator = createEvaluator({
  client: oai,
  model: "gpt-4-turbo",
  resultsType: "binary",  // Changes output to true/false counts
  evaluationDescription: "Score 1 if content follows all policies (safe, respectful, appropriate), 0 if any violation exists"
});

const moderationResult = await moderationEvaluator({
  data: [
    {
      prompt: "Describe our product benefits",
      completion: "Our product helps improve productivity",
      expectedCompletion: "Professional product description"
    },
    {
      prompt: "Respond to negative review",
      completion: "Your complaint is totally wrong...",
      expectedCompletion: "Professional response to feedback"
    }
  ]
});

/* Example output:
{
  results: [
    { score: 1, item: { ... } },  // Meets content guidelines
    { score: 0, item: { ... } }   // Violates professional tone policy
  ],
  binaryResults: {
    trueCount: 1,
    falseCount: 1
  }
}
*/
```

### Student Answer Evaluation

Demonstrates weighted evaluation combining exact matching, semantic understanding, and qualitative assessment.

```typescript
const gradingEvaluator = createWeightedEvaluator({
  evaluators: {
    // Check for presence of required terminology
    keyTerms: createAccuracyEvaluator({
      weights: { 
        factual: 0.9,   // High weight on exact matches
        semantic: 0.1    // Low weight on similar terms
      }
    }),
    // Assess conceptual understanding
    understanding: createAccuracyEvaluator({
      weights: { 
        factual: 0.2,   // Low weight on exact matches
        semantic: 0.8    // High weight on meaning similarity
      }
    }),
    // Evaluate answer quality like a human grader
    quality: createEvaluator({
      client: oai,
      model: "gpt-4-turbo",
      evaluationDescription: "Rate answer completeness and clarity 0-1"
    })
  },
  weights: {
    keyTerms: 0.3,      // Balance terminology requirements
    understanding: 0.4,  // Emphasize conceptual grasp
    quality: 0.3        // Consider overall presentation
  }
});

const gradingResult = await gradingEvaluator({
  data: [{
    prompt: "Explain how photosynthesis works",
    completion: "Plants convert sunlight into chemical energy through chlorophyll",
    expectedCompletion: "Photosynthesis is the process where plants use chlorophyll to convert sunlight, water, and CO2 into glucose and oxygen"
  }]
});

/* Example output:
{
  results: [{
    score: 0.78,  // Overall grade (78%)
    scores: [
      { 
        score: 0.65,           // Missing key terms (water, CO2, glucose)
        evaluator: "keyTerms",
        evaluatorType: "accuracy"
      },
      { 
        score: 0.90,           // Shows good conceptual understanding
        evaluator: "understanding",
        evaluatorType: "accuracy"
      },
      { 
        score: 0.75,           // Clear but not comprehensive
        evaluator: "quality",
        evaluatorType: "model-graded"
      }
    ],
    item: { ... }
  }],
  scoreResults: {
    value: 0.78,
    individual: {
      keyTerms: 0.65,
      understanding: 0.90,
      quality: 0.75
    }
  }
}
*/
```

### Chatbot Quality Assessment

Monitor chatbot response quality across multiple dimensions.

```typescript
const chatbotEvaluator = createWeightedEvaluator({
  evaluators: {
    // Evaluate response appropriateness
    relevance: createEvaluator({
      client: oai,
      model: "gpt-4-turbo",
      evaluationDescription: "Rate how well the response addresses the user's query"
    }),
    // Check response tone
    tone: createEvaluator({
      client: oai,
      model: "gpt-4-turbo",
      evaluationDescription: "Rate the professionalism and friendliness of the response"
    }),
    // Verify against known good responses
    accuracy: createAccuracyEvaluator({
      weights: { semantic: 0.8, factual: 0.2 }
    })
  },
  weights: {
    relevance: 0.4,
    tone: 0.3,
    accuracy: 0.3
  }
});

const result = await chatbotEvaluator({
  data: [{
    prompt: "How do I reset my password?",
    completion: "You can reset your password by clicking the 'Forgot Password' link on the login page.",
    expectedCompletion: "To reset your password, use the 'Forgot Password' option at login.",
    contexts: ["Previous support interactions"]
  }]
});
```

### Content Generation Pipeline

Evaluate generated content for quality and accuracy.

```typescript
const contentEvaluator = createWeightedEvaluator({
  evaluators: {
    // Check writing quality
    quality: createEvaluator({
      client: oai,
      model: "gpt-4-turbo",
      evaluationDescription: "Rate clarity, structure, and engagement"
    }),
    // Verify factual accuracy
    factCheck: createAccuracyEvaluator({
      weights: { factual: 1.0 }
    }),
    // Assess source usage
    citations: createContextEvaluator({ 
      type: "entities-recall" 
    })
  },
  weights: {
    quality: 0.4,
    factCheck: 0.4,
    citations: 0.2
  }
});

const result = await contentEvaluator({
  data: [{
    prompt: "Write an article about renewable energy trends",
    completion: "Solar and wind power installations increased by 30% in 2023...",
    contexts: [
      "Global renewable energy deployment grew by 30% year-over-year",
      "Solar and wind remained the fastest-growing sectors"
    ],
    groundTruth: "Renewable energy saw significant growth, led by solar and wind"
  }]
});
```

### Document Processing System

Evaluate document extraction and summarization quality.

```typescript
const documentEvaluator = createWeightedEvaluator({
  evaluators: {
    // Verify key information extraction
    extraction: createContextEvaluator({
      type: "recall"
    }),
    // Check summary quality
    summary: createEvaluator({
      client: oai,
      model: "gpt-4-turbo",
      evaluationDescription: "Rate conciseness and completeness"
    }),
    // Validate against reference summary
    accuracy: createAccuracyEvaluator({
      weights: { semantic: 0.6, factual: 0.4 }
    })
  },
  weights: {
    extraction: 0.4,
    summary: 0.3,
    accuracy: 0.3
  }
});

const result = await documentEvaluator({
  data: [{
    prompt: "Summarize the quarterly report",
    completion: "Q3 revenue grew 25% YoY, driven by new product launches...",
    contexts: [
      "Revenue increased 25% compared to Q3 2022",
      "Growth primarily attributed to successful product launches"
    ],
    groundTruth: "Q3 saw 25% YoY revenue growth due to new products"
  }]
});
```

## API Reference

### createEvaluator

Creates a basic evaluator for assessing AI-generated content based on custom criteria.

**Parameters**

• client: OpenAI instance.
• model: OpenAI model to use (e.g., "gpt-4o").
• evaluationDescription: Description guiding the evaluation criteria.
• `resultsType`: Type of results to return ("score" or "binary").
• `messages`: Additional messages to include in the OpenAI API call.

**Example**

```typescript
import { createEvaluator } from "evalz";
import OpenAI from "openai";

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  organization: process.env["OPENAI_ORG_ID"]
});

const evaluator = createEvaluator({
  client: oai,
  model: "gpt-4-turbo",
  evaluationDescription: "Rate the relevance from 0 to 1."
});

const result = await evaluator({ data: [{ prompt: "Discuss the importance of AI.", completion: "AI is important for future technology.", expectedCompletion: "AI is important for future technology." }] });
console.log(result.scoreResults);
```

### createAccuracyEvaluator

Creates an evaluator that assesses string similarity using a hybrid approach of Levenshtein distance (factual similarity) and semantic embeddings (semantic similarity), with customizable weights.

**Parameters**

• `model` (optional): OpenAI.Embeddings.EmbeddingCreateParams["model"] - The OpenAI embedding model to use defaults to `"text-embedding-3-small"`.

• `weights` (optional): An object specifying the weights for factual and semantic similarities. Defaults to `{` factual: 0.5, semantic: 0.5 }.

**Example**

```typescript
import { createAccuracyEvaluator } from "evalz";

const evaluator = createAccuracyEvaluator({
  model: "text-embedding-3-small",
  weights: { factual: 0.4, semantic: 0.6 }
});


const data = [
  { completion: "Einstein was born in Germany in 1879.", expectedCompletion: "Einstein was born in 1879 in Germany." }
];

const result = await evaluator({ data });
console.log(result.scoreResults);
```

### createWeightedEvaluator

Combines multiple evaluators with specified weights for a comprehensive assessment.

**Parameters**

• `evaluators`: An object mapping evaluator names to evaluator functions.

• `weights`: An object mapping evaluator names to their corresponding weights.

**Example**

```typescript
import { createWeightedEvaluator } from "evalz";

const weightedEvaluator = createWeightedEvaluator({
  evaluators: {
    relevance: relevanceEval(),
    fluency: fluencyEval(),
    completeness: completenessEval()
  },
  weights: {
    relevance: 0.25,
    fluency: 0.25,
    completeness: 0.5
  }
});

const result = await weightedEvaluator({ data: yourResponseData });
console.log(result.scoreResults);
```

### Create Composite Weighted Evaluation

A  weighted evaluator that incorporates various evaluation types:
**Example**

```typescript
import { createEvaluator, createAccuracyEvaluator, createContextEvaluator, createWeightedEvaluator }  from "evalz"

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  organization: process.env["OPENAI_ORG_ID"]
});


const relevanceEval = () => createEvaluator({
  client: oai,
  model: "gpt-4-turbo",
  evaluationDescription: "Please rate the relevance of the response from 0 (not at all relevant) to 1 (highly relevant), considering whether the AI stayed on topic and provided a reasonable answer."
});

const distanceEval = () => createAccuracyEvaluator({
  weights: { factual: 0.5, semantic: 0.5 }
});

const semanticEval = () => createAccuracyEvaluator({
  weights: { factual: 0.0, semantic: 1.0 }
});

const fluencyEval = () => createEvaluator({
  client: oai,
  model: "gpt-4-turbo",
  evaluationDescription: "Please rate the completeness of the response from 0 (not at all complete) to 1 (completely answered), considering whether the AI addressed all parts of the prompt."
});

const completenessEval = () => createEvaluator({
  client: oai,
  model: "gpt-4-turbo",
  evaluationDescription: "Please rate the completeness of the response from 0 (not at all complete) to 1 (completely answered), considering whether the AI addressed all parts of the prompt."
});

const contextEntitiesRecallEval = () => createContextEvaluator({ type: "entities-recall" });
const contextPrecisionEval = () => createContextEvaluator({ type: "precision" });
const contextRecallEval = () => createContextEvaluator({ type: "recall" });
const contextRelevanceEval = () => createContextEvaluator({ type: "relevance" });


const compositeWeightedEvaluator = createWeightedEvaluator({
  evaluators: {
    relevance: relevanceEval(),
    fluency: fluencyEval(),
    completeness: completenessEval(),
    accuracy: createAccuracyEvaluator({ weights: { factual: 0.6, semantic: 0.4 } }),
    contextPrecision: contextPrecisionEval()
  },
  weights: {
    relevance: 0.2,
    fluency: 0.2,
    completeness: 0.2,
    accuracy: 0.2,
    contextPrecision: 0.2
  }
});


const data = [
  {
    prompt: "When was the first super bowl?",
    completion: "The first super bowl was held on January 15, 1967.",
    expectedCompletion: "The first superbowl was held on January 15, 1967.",
    contexts: ["The First AFL–NFL World Championship Game was an American football game played on January 15, 1967, at the Los Angeles Memorial Coliseum in Los Angeles."],
    groundTruth: "The first superbowl was held on January 15, 1967."
  }
];


const result = await compositeWeightedEvaluator({ data });
console.log(result.scoreResults);
```

### createContextEvaluator

Creates an evaluator that assesses context-based criteria such as relevance, precision, recall, and entities recall.

**Parameters**

• `type`: "entities-recall" | "precision" | "recall" | "relevance" - The type of context evaluation to perform.

• `model` (optional): OpenAI.Embeddings.EmbeddingCreateParams["model"] - The OpenAI embedding model to use. Defaults to `"text-embedding-3-small"`.

**Example**

```typescript
import { createContextEvaluator } from "evalz";


const entitiesRecallEvaluator = createContextEvaluator({ type: "entities-recall" });


const precisionEvaluator = createContextEvaluator({ type: "precision" });


const recallEvaluator = createContextEvaluator({ type: "recall" });


const relevanceEvaluator = createContextEvaluator({ type: "relevance" });


const data = [
  { 
    prompt: "When was the first super bowl?", 
    completion: "The first superbowl was held on January 15, 1967.", 
    groundTruth: "The first superbowl was held on January 15, 1967.", 
    contexts: [
      "The First AFL–NFL World Championship Game was an American football game played on January 15, 1967 at the Los Angeles Memorial Coliseum in Los Angeles.",
      "This first championship game is retroactively referred to as Super Bowl I."
    ]
  }
];


const result1 = await entitiesRecallEvaluator({ data });
console.log(result1.scoreResults);


const result2 = await precisionEvaluator({ data });
console.log(result2.scoreResults);


const result3 = await recallEvaluator({ data });
console.log(result3.scoreResults);


const result4 = await relevanceEvaluator({ data });
console.log(result4.scoreResults);
```

## Integration with Island AI

Part of the Island AI toolkit:

- [`schema-stream`](https://www.npmjs.com/package/schema-stream): Streaming JSON parser
- [`zod-stream`](https://www.npmjs.com/package/zod-stream): Structured streaming
- [`stream-hooks`](https://www.npmjs.com/package/stream-hooks): React streaming hooks
- [`llm-polyglot`](https://www.npmjs.com/package/llm-polyglot): Universal LLM client
- [`instructor`](https://www.npmjs.com/package/@instructor-ai/instructor): High-level extraction

## Contributing

We welcome contributions! Check out:

- [Island AI Documentation](https://island.hack.dance)
- [GitHub Issues](https://github.com/hack-dance/island-ai/issues)
- [Twitter](https://twitter.com/dimitrikennedy)

## License

MIT © [hack.dance](https://hack.dance)
