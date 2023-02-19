import type { NextApiRequest, NextApiResponse } from "next"
import { OpenAI } from "@common/open-ai"
import axios, { AxiosError } from "axios"
import { StatusCodes } from "http-status-codes"
import { InProduction } from "@/common/constants"

export type CreateTitleRequest = {
  description: string
}

type CompletionSize = "s" | "m" | "l"

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

const generatePrompt = (description: string) =>
  `Create catchy and click-baity YouTube title that's 🔥 using the following video description\n --- \n${description}\n ---`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    console.log("Req Body", {
      body: req.body,
    })

    const { description } = JSON.parse(req.body) as CreateTitleRequest
    if (!description) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "A description was not given." })
    }

    !InProduction && console.log("Description\n", description)
    const completion = await OpenAI.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(description),
      max_tokens: 16,
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
    console.error("/completion Error ", error)

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message })
  }
}
