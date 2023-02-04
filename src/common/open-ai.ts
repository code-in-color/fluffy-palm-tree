import { Configuration, OpenAIApi } from "openai"

const config = new Configuration({
  apiKey: process.env["OPEN_AI_API_KEY"],
})

export const OpenAI = new OpenAIApi(config)
