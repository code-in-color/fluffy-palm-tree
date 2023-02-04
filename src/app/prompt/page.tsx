"use client"

import { CompletionRequest } from "@/pages/api/completion"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

const titleTemplate = (description: string) =>
  `Create catchy and click-baity YouTube title that's 🔥 using the following video description:\n${description}`

let renderCount = 0

export default function Prompt() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CompletionRequest>({
    defaultValues: {
      prompt: "",
      completionSize: undefined,
    },
  })
  const [completion, setCompletion] = useState("")

  React.useEffect(() => {
    renderCount++
    const fieldState = watch((state) => console.log(state))

    return () => fieldState.unsubscribe()
  }, [watch])

  return (
    <>
      <pre>{JSON.stringify({ renderCount, errors }, null, 2)}</pre>
      <form
        onSubmit={handleSubmit(async (data) => {
          const { prompt, completionSize } = data
          const response = await fetch("/api/completion", {
            method: "POST",
            body: JSON.stringify({
              prompt: titleTemplate(prompt),
              completionSize,
            }),
          })
          const { success, completion } = await response.json()
          if (success) {
            setCompletion(completion)
          }
        })}
      >
        <textarea {...register("prompt", { required: true })} />
        {errors.prompt && <p>A prompt must be specified.</p>}

        <select {...register("completionSize")}>
          <option value="">Choose response length</option>
          <option value="s">Short</option>
          <option value="m">Medium</option>
          <option value="l">Long</option>
        </select>
        <input type="submit" />
      </form>
      <h2>Completion</h2>
      {completion.split("\n").map((line, ix) => (
        <p key={ix}>{line}</p>
      ))}
    </>
  )
}
