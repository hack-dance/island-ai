# evalz

<div align="center">
  <img alt="GitHub issues" src="https://img.shields.io/github/issues/hack-dance/island-ai.svg?style=flat-square&labelColor=000000">
  <img alt="NPM version" src="https://img.shields.io/npm/v/evalz.svg?style=flat-square&logo=npm&labelColor=000000&label=evalz">
  <img alt="License" src="https://img.shields.io/npm/l/evalz.svg?style=flat-square&labelColor=000000">
</div>

**evalz** is a TypeScript package designed to facilitate model-graded evaluations with a focus on structured output. Leveraging Zod schemas, **evalz** streamline s the evaluation of AI-generated responses. It provides a set of tools to assess the quality of responses based on custom criteria such as relevance, fluency, and completeness. The package leverages OpenAI's GPT models to perform evaluations, offering both simple and weighted evaluation mechanisms.

## Features

- **Structured Evaluation Models**: Define your evaluation logic using Zod schemas to ensure data integrity throughout your application.
- **Flexible Evaluation Strategies**: Supports various evaluation strategies, including score-based and binary evaluations, with customizable evaluators.
- **Easy Integration**: Designed to integrate seamlessly with existing TypeScript projects, enhancing AI and data processing workflows with minimal setup.
- **Custom Evaluations**: Define evaluation criteria tailored to your specific requirements.
- **Weighted Evaluations**: Combine multiple evaluations with custom weights to calculate a composite score.


## Installation

Install `evalz` using your preferred package manager:

```bash
npm install evalz openai zod

bun add evalz openai zod

pnpm add evalz openai zod
```

## Basic Usage

### Creating an Evaluator

First, create an evaluator for assessing a single aspect of a response, such as its relevance:

```typescript
import { createEvaluator } from "evalz/evaluators";
import OpenAI from "openai";

const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  organization: process.env["OPENAI_ORG_ID"]
});

function relevanceEval() {
  return createEvaluator({
    client: oai,
    model: "gpt-4-1106-preview",
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

### Weighted Evaluation

Combine multiple evaluators with specified weights for a comprehensive assessment:

```typescript
import { createWeightedEvaluator } from "evalz/evaluators/weighted";

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