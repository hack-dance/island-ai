# evalz

<div align="center">
  <img alt="GitHub issues" src="https://img.shields.io/github/issues/hack-dance/island-ai.svg?style=flat-square&labelColor=000000">
  <img alt="NPM version" src="https://img.shields.io/npm/v/evalz.svg?style=flat-square&logo=npm&labelColor=000000&label=evalz">
  <img alt="License" src="https://img.shields.io/npm/l/evalz.svg?style=flat-square&labelColor=000000">
</div>

**evalz** is a TypeScript project for creating model-graded, accuracy, and context-based evaluations with a focus on structured output. It provides a set of tools to assess the quality of responses based on custom criteria such as relevance, fluency, completeness, and contextual relevance. We use OpenAI and Instructor js (@instructor-ai/instructor) to perform structured model-graded evaluations, offering both simple and weighted evaluation mechanisms. Additionally, **evalz** supports accuracy evaluations using Levenshtein distance or semantic embeddings and context-based evaluations measuring precision, recall, and entities recall.

## Features
-  **Structured Evaluation Models**: Define your evaluation logic using Zod schemas to ensure data integrity throughout your application.
-  **Flexible Evaluation Strategies**: Supports various evaluation strategies, including score-based and binary evaluations, with customizable evaluators.
-  **Easy Integration**: Designed to integrate seamlessly with existing TypeScript projects, enhancing AI and data processing workflows with minimal setup.
-  **Custom Evaluations**: Define evaluation criteria tailored to your specific requirements.
-  **Weighted Evaluations**: Combine multiple evaluations with custom weights to calculate a composite score.
-  **Accuracy Evaluations**: Evaluate text similarity using Levenshtein distance or semantic embeddings.
-  **Context Evaluations**: Evaluate context-based criteria such as relevance, precision, recall, and entities recall.

## Installation

Install `evalz` using your preferred package manager:

```bash
npm install evalz openai zod @instructor-ai/instructor

bun add evalz openai zod @instructor-ai/instructor

pnpm add evalz openai zod @instructor-ai/instructor
```

## Basic Usage

### Creating an Evaluator

First, create an evaluator for assessing a single aspect of a response, such as its relevance:

```typescript
import { createEvaluator } from "evalz";
import OpenAI from "openai";

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  organization: process.env["OPENAI_ORG_ID"]
});

function relevanceEval() {
  return createEvaluator({
    client: oai,
    model: "gpt-4-turbo",
    evaluationDescription: "Rate the relevance from 0 to 1."
  });
}
```

### Conducting an Evaluation

Evaluate AI-generated content by passing the response data to your evaluator:

```typescript
const evaluator = relevanceEval();

const result = await evaluator({ data: yourResponseData });
console.log(result.scoreResults);
```

### Accuracy Evaluations

Create an accuracy evaluator to assess text similarity using Levenshtein distance or semantic embeddings:

```typescript
import { createAccuracyEvaluator } from "evalz";

function distanceEval() {
  return createAccuracyEvaluator({
    accuracyType: "levenshtein"
  });
}

function semanticEval() {
  return createAccuracyEvaluator({
    accuracyType: "semantic"
  });
}


const evaluator = distanceEval();

const result = await evaluator({ data: [{ completion: "text1", expectedCompletion: "text2" }] });
console.log(result.scoreResults);
```

### Weighted Evaluation

Combine multiple evaluators with specified weights for a comprehensive assessment:

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

### Context Evaluations

Create context evaluators to assess criteria such as relevance, precision, recall, and entities recall:

**Entities Recall Evaluation**

```typescript
import { createContextEvaluator } from "evalz";

function contextEntitiesRecallEval() {
  return createContextEvaluator({ type: "entities-recall" });
}


const data = [
  {
    prompt: "When was the first super bowl?",
    contexts: ["The First AFL–NFL World Championship Game was an American football game...", "This first championship game is retroactively referred to as Super Bowl I."],
    groundTruth: "The first superbowl was held on January 15, 1967",
    completion: "The first superbowl was held on January 15, 1967, in Los Angeles."
  }
];


const evaluator = contextEntitiesRecallEval();

const result = await evaluator({ data });
console.log(result.scoreResults);
```

**Precision Evaluation**

```typescript
import { createContextEvaluator } from "evalz";

function contextPrecisionEval() {
  return createContextEvaluator({ type: "precision" });
}


const data = [
  {
    prompt: "When was the first super bowl?",
    contexts: ["The First AFL–NFL World Championship Game was an American football game...", "This first championship game is retroactively referred to as Super Bowl I."],
    groundTruth: "The first superbowl was held on January 15, 1967",
    completion: "The first superbowl was held on January 15, 1967, in Los Angeles."
  }
];


const evaluator = contextPrecisionEval();

const result = await evaluator({ data });
console.log(result.scoreResults);
```

**Recall Evaluation**

```typescript
import { createContextEvaluator } from "evalz";

function contextRecallEval() {
  return createContextEvaluator({ type: "recall" });
}


const data = [
  {
    prompt: "When was the first super bowl?",
    contexts: ["The First AFL–NFL World Championship Game was an American football game...", "This first championship game is retroactively referred to as Super Bowl I."],
    groundTruth: "The first superbowl was held on January 15, 1967",
    completion: "The first superbowl was held on January 15, 1967, in Los Angeles."
  }
];


const evaluator = contextRecallEval();

const result = await evaluator({ data });
console.log(result.scoreResults);
```

**Relevance Evaluation**

```typescript
import { createContextEvaluator } from "evalz";

function contextRelevanceEval() {
  return createContextEvaluator({ type: "relevance" });
}


const data = [
  {
    prompt: "When was the first super bowl?",
    contexts: ["The First AFL–NFL World Championship Game was an American football game...", "This first championship game is retroactively referred to as Super Bowl I."],
    groundTruth: "The first superbowl was held on January 15, 1967",
    completion: "The first superbowl was held on January 15, 1967, in Los Angeles."
  }
];


const evaluator = contextRelevanceEval();

const result = await evaluator({ data });
console.log(result.scoreResults);
```

## Test Data

When constructing test data for evaluations, it is essential to distinguish between model-graded evaluations and accuracy evaluations.

### Model-Graded Evaluations

For model-graded evaluations, you typically need data pairs where each item consists of a `prompt`, `completion`, and optionally an `expectedCompletion`. The scores are based on evaluation criteria such as relevance, fluency, and completeness.

**Example**

```typescript
const modelGradedData = [
  { prompt: "Discuss the impact of AI on industries.", completion: "AI is transforming many industries.", expectedCompletion: "AI is transforming many industries." },
  { prompt: "Explain the causes of climate change.", completion: "Climate change is caused by human activities.", expectedCompletion: "Climate change is caused by human activities." }
];
```

### Accuracy Evaluations

For accuracy evaluations, the test data should include pairs of strings where each pair consists of a `completion` and `expectedCompletion` string. The score is based on the similarity between these strings, assessed using either Levenshtein distance or semantic embeddings.

**Example**

```typescript
const accuracyData = [
  { completion: "Hello, world!", expectedCompletion: "Hello world" },
  { completion: "The quick brown fox jumps over the lazy dog.", expectedCompletion: "A quick brown dog jumps over the lazy fox." }
];
```

### Context Evaluations Data

For context-based evaluations, the test data should include `prompt`, `completion`, `groundTruth`, and `contexts`. The scores are based on evaluation criteria such as relevance, precision, recall, and entities recall.

**Example**

```typescript
const contextData = [
  {
    prompt: "When was the first super bowl?",
    completion: "The first super bowl was held on January 15, 1967.",
    groundTruth: "The first super bowl was held on January 15, 1967.",
    contexts: [
      "The First AFL–NFL World Championship Game was an American football game played on January 15, 1967, at the Los Angeles Memorial Coliseum in Los Angeles.",
      "This first championship game is retroactively referred to as Super Bowl I."
    ]
  },
  {
    prompt: "Who won the most Super Bowls?",
    completion: "The New England Patriots have won the most Super Bowls.",
    groundTruth: "The New England Patriots have won the Super Bowl a record six times.",
    contexts: [
      "The New England Patriots have won the Super Bowl a record six times.",
      "Other notable teams include the Pittsburgh Steelers with six and the San Francisco 49ers with five."
    ]
  }
];
```


## Evaluation Templates

Here are some templates for different types of model-graded evaluations using OpenAI models. Simply copy and adjust the evaluation description as needed.

**Relevance Evaluation**

```typescript
import { createEvaluator } from "evalz";
import OpenAI from "openai";

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  organization: process.env["OPENAI_ORG_ID"]
});

function relevanceEval() {
  return createEvaluator({
    client: oai,
    model: "gpt-4-turbo",
    evaluationDescription: "Rate the relevance of the response from 0 (not relevant) to 1 (highly relevant), considering how well the response addresses the main topic."
  });
}
```

**Completeness Evaluation**

```typescript
import { createEvaluator } from "evalz";
import OpenAI from "openai";

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  organization: process.env["OPENAI_ORG_ID"]
});

function completenessEval() {
  return createEvaluator({
    client: oai,
    model: "gpt-4-turbo",
    evaluationDescription: "Rate the completeness of the response from 0 (not complete) to 1 (fully complete), considering whether the response addresses all parts of the prompt."
  });
}
```

**Answer Correctness Evaluation**

```typescript
import { createAccuracyEvaluator } from "evalz";

function correctnessEval() {
  return createAccuracyEvaluator({
    accuracyType: "semantic"
  });
}


const evaluator = correctnessEval();

const result = await evaluator({
  data: [{ completion: "Einstein was born in Germany in 1879.", expectedCompletion: "Einstein was born in 1879 in Germany." }]
});
console.log(result.scoreResults);
```

**Fluency Evaluation**

```typescript
import { createEvaluator } from "evalz";
import OpenAI from "openai";

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  organization: process.env["OPENAI_ORG_ID"]
});

function fluencyEval() {
  return createEvaluator({
    client: oai,
    model: "gpt-4-turbo",
    evaluationDescription: "Rate the fluency of the response from 0 (not fluent) to 1 (very fluent), considering the grammatical correctness and natural flow."
  });
}
```

**Sentiment Analysis Evaluation**

```typescript
import { createEvaluator } from "evalz";
import OpenAI from "openai";

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  organization: process.env["OPENAI_ORG_ID"]
});

function sentimentEval() {
  return createEvaluator({
    client: oai,
    model: "gpt-4-turbo",
    evaluationDescription: "Rate the sentiment of the response from -1 (very negative) to 1 (very positive), considering the emotional tone conveyed by the response."
  });
}
```

**Grammar and Spelling Evaluation**

```typescript
import { createEvaluator } from "evalz";
import OpenAI from "openai";

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  organization: process.env["OPENAI_ORG_ID"]
});

function grammarEval() {
  return createEvaluator({
    client: oai,
    model: "gpt-4-turbo",
    evaluationDescription: "Rate the grammatical correctness of the response from 0 (many errors) to 1 (no errors), considering grammar, punctuation, and spelling."
  });
}
```


### Coherence Evaluation

```typescript
import { createEvaluator } from "evalz";
import OpenAI from "openai";

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  organization: process.env["OPENAI_ORG_ID"]
});

function coherenceEval() {
  return createEvaluator({
    client: oai,
    model: "gpt-4-turbo",
    evaluationDescription: "Rate the coherence of the response from 0 (not coherent) to 1 (highly coherent), considering whether the response logically follows from the prompt and maintains consistency."
  });
}
```

### Coverage Evaluation

```typescript
import { createEvaluator } from "evalz";
import OpenAI from "openai";

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  organization: process.env["OPENAI_ORG_ID"]
});

function coverageEval() {
  return createEvaluator({
    client: oai,
    model: "gpt-4-turbo",
    evaluationDescription: "Rate the coverage of the response from 0 (incomplete coverage) to 1 (full coverage), considering whether the response addresses all parts of the prompt."
  });
}
```


## API Reference

### createEvaluator

Creates a basic evaluator for assessing AI-generated content based on custom criteria.

**Parameters**

• client: OpenAI instance.
• model: OpenAI model to use (e.g., "gpt-4-turbo").
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
  weights: { factual: 0.5, semantic: 0.0 }
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

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to propose changes or additions.
