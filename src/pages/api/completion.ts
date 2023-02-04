import type { NextApiRequest, NextApiResponse } from "next"
import { OpenAI } from "@common/open-ai"
import axios, { AxiosError } from "axios"
import { StatusCodes } from "http-status-codes"
import { InProduction } from "@/common/constants"

type CompletionSize = "s" | "m" | "l"

export type CompletionRequest = {
  prompt: string
  completionSize?: CompletionSize
}

type Data =
  | {
      success: true
      completion?: string
    }
  | {
      success: false
      message: string
    }

const getMaxTokens = (size: CompletionSize) => {
  switch (size) {
    case "s":
      return 100
    case "m":
      return 300
    case "l":
      return 500
    default:
      throw new Error(`Invalid CompletionSize: ${size}`)
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt, completionSize } = JSON.parse(req.body) as CompletionRequest
  if (!prompt) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Prompt not given." })
  }

  !InProduction && console.log("Prompt\n", prompt)

  try {
    const completion = await OpenAI.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: completionSize ? getMaxTokens(completionSize) : 16,
    })

    !InProduction && console.log("Completions", completion.data)

    return res
      .status(StatusCodes.OK)
      .json({ success: true, completion: completion.data.choices[0].text })
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.error("Completion::OpenAI Error\n", (e as AxiosError).response)
    }

    const error = e as Error
    console.error("Completion::Error\n", error)

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}
