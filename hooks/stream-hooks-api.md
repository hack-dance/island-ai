## API Reference

### `useStream`

A custom React hook for managing and interacting with a data stream.

#### Properties

```typescript
useStream({ onBeforeStart, onStop }: UseStreamProps)
```

| Property       | Type     | Required | Description                                     |
|----------------|----------|----------|-------------------------------------------------|
| onBeforeStart  | Function | No       | Callback function invoked before the stream starts. |
| onStop         | Function | No       | Callback function invoked when the stream stops. |

#### Returns

| Property    | Type       | Description                                     |
|-------------|------------|-------------------------------------------------|
| startStream | Function   | Function to start the stream.                   |
| stopStream  | Function   | Function to stop the stream.                    |

### `useJsonStream`

Extends `useStream` to handle JSON streaming, with parsing based on a provided Zod schema.

#### Properties

```typescript
useJsonStream({ onReceive, onEnd, schema, onBeforeStart, onStop, defaultData }: UseJsonStreamProps<T>)
```

| Property       | Type           | Required | Description                                         |
|----------------|----------------|----------|-----------------------------------------------------|
| onReceive      | Function       | No       | Callback invoked with each piece of received data.  |
| onEnd          | Function       | No       | Callback invoked when the stream ends.              |
| schema         | z.AnyZodObject | Yes      | Zod schema for validating and parsing the JSON data.|
| onBeforeStart  | Function       | No       | Callback function invoked before the stream starts. |
| onStop         | Function       | No       | Callback function invoked when the stream stops.    |
| defaultData    | Object         | No       | Default data to use before any stream data arrives. |

#### Returns

| Property    | Type       | Description                                       |
|-------------|------------|---------------------------------------------------|
| startStream | Function   | Function to start the stream.                     |
| stopStream  | Function   | Function to stop the stream.                      |
| data        | Object     | The latest piece of parsed data from the stream.  |
| loading     | boolean    | Indicates whether the stream is currently active. |
