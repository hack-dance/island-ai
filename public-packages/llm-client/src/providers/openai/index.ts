import { ClientOptions, OpenAI } from "openai"

export class OpenAIProvider extends OpenAI {
  constructor(opts?: ClientOptions) {
    super(opts)
  }
}
