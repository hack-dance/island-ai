# evalz

<div align="center">
  <img alt="GitHub issues" src="https://img.shields.io/github/issues/hack-dance/island-ai.svg?style=flat-square&labelColor=000000">
  <img alt="NPM version" src="https://img.shields.io/npm/v/evalz.svg?style=flat-square&logo=npm&labelColor=000000&label=evalz">
  <img alt="License" src="https://img.shields.io/npm/l/evalz.svg?style=flat-square&labelColor=000000">
</div>

**evalz** is a TypeScript package designed to facilitate both model-graded and accuracy evaluations with a focus on structured output. Leveraging Zod schemas, **evalz** streamlines the evaluation of AI-generated responses. It provides a set of tools to assess the quality of responses based on custom criteria such as relevance, fluency, and completeness. The package leverages OpenAI and Instructor js (@instructor-ai/instructor) to perform structured model-graded evaluations, offering both simple and weighted evaluation mechanisms, as well as accuracy evaluations using Levenshtein distance or semantic embeddings.

## Features

-  **Structured Evaluation Models**: Define your evaluation logic using Zod schemas to ensure data integrity throughout your application.
-  **Flexible Evaluation Strategies**: Supports various evaluation strategies, including score-based and binary evaluations, with customizable evaluators.
-  **Easy Integration**: Designed to integrate seamlessly with existing TypeScript projects, enhancing AI and data processing workflows with minimal setup.
-  **Custom Evaluations**: Define evaluation criteria tailored to your specific requirements.
-  **Weighted Evaluations**: Combine multiple evaluations with custom weights to calculate a composite score.
-  **Accuracy Evaluations**: Evaluate text similarity using Levenshtein distance or semantic embeddings.

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

// Conducting a distance evaluation
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

## API Reference

### createEvaluator
Creates a basic evaluator for assessing AI-generated content based on custom criteria.
**Parameters**
	•	client: OpenAI instance.
	•	model: OpenAI model to use (e.g., "gpt-4-turbo").
	•	evaluationDescription: Description guiding the evaluation criteria.

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

const result = await evaluator({ data: [{ completion: "response", expectedCompletion: "expected" }] });
console.log(result.scoreResults);
```

### createAccuracyEvaluator
Creates an evaluator that assesses string similarity using either Levenshtein distance or semantic embeddings.
**Parameters**
	•	`accuracyType` (optional): `"levenshtein"` | `"semantic"` - Determines the type of accuracy evaluation to perform. Defaults to `"levenshtein"`.

**Example**

```typescript
import { createAccuracyEvaluator } from "evalz";

// Levenshtein Distance Evaluator
const levEvaluator = createAccuracyEvaluator({ accuracyType: "levenshtein" });

// Semantic Embeddings Evaluator
const semanticEvaluator = createAccuracyEvaluator({ accuracyType: "semantic" });

// Example Data
const data = [
  { completion: "Hello, world!", expectedCompletion: "Hello world" }
];

// Running the Evaluation
const levResult = await levEvaluator({ data });
console.log(levResult.scoreResults);

const semanticResult = await semanticEvaluator({ data });
console.log(semanticResult.scoreResults);
```

### createWeightedEvaluator
Combines multiple evaluators with specified weights for a comprehensive assessment.
**Parameters**
	•	﻿evaluators: An object mapping evaluator names to evaluator functions.
	•	﻿weights: An object mapping evaluator names to their corresponding weights.
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

## Contributing
Contributions are welcome! Please submit a pull request or open an issue to propose changes or additions.

You can copy the entire code block as your updated README file. This version includes installation instructions, basic usage examples, a detailed API reference, and guidelines for contributing.