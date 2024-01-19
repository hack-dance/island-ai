# schema-stream

![GitHub Actions Status](https://github.com/github/docs/actions/workflows/test.yml/badge.svg?branch=main) [![NPM Version](https://img.shields.io/npm/v/schema-stream.svg)](https://www.npmjs.com/package/schema-stream)


`schema-stream` is a utility for parsing streams of JSON data. It provides a safe-to-read-from stubbed version of the data before the stream has fully completed. This utility is essential for handling large JSON streams efficiently and is built on top of Zod schema validation.

## Features

- Stream JSON data parsing with partial data availability.
- Zod schema validation for robust data handling.
- Extensible configuration for customized parsing needs.


## Installation

```bash
npm install schema-stream zod
```

## Basic Usage

To use `schema-stream`, create a new instance of the class, passing in a Zod schema and optional default data. Then, call the `parse` method on the instance to parse a JSON stream.

```typescript
import { SchemaStream } from 'schema-stream';
import { z } from 'zod';

const schema = z.object({
  someString: z.string(),
  someNumber: z.number()
});

const response = await getSomeStreamOfJson();

const parser = new SchemaStream(schema, {
  someString: "default string"
});

const streamParser = parser.parse({});

response.body?.pipeThrough(parser);

const reader = streamParser.readable.getReader();
const decoder = new TextDecoder();
let result = {};

while (!done) {
  const { value, done: doneReading } = await reader.read();
  done = doneReading;

  if (done) {
    console.log(result);
    break;
  }

  const chunkValue = decoder.decode(value);
  result = JSON.parse(chunkValue);
}
```


## Note

A lot of the internal parser logic was forked from [streamparser-json](https://github.com/juanjoDiaz/streamparser-json). The primary difference is the requirement of a Zod schema and optional default data, allowing for a fully stubbed version of the expected data to be returned before the stream has completed.

## Related Packages

- [@hackdance/hooks](https://github.com/hack-dance/agents/tree/main/packages/hooks): A set of React hooks for working with streams, including a `use-json-stream` hook that uses `schema-stream`.
- [@hackdance/agents](https://github.com/hack-dance/agents/tree/main/packages/core): Another set of React hooks for stream data handling.

## Contributing

Contributions to `schema-stream` are always welcome, whether it be improvements to the documentation or new functionality. Please feel free to open an issue or create a pull request.

## License

MIT © [hack-dance](https://hack.dance)
