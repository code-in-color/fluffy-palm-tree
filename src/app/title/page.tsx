"use client"

import { CreateTitleRequest } from "@/pages/api/generate-title"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

let renderCount = 0

export default function TitleGenerator() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateTitleRequest>({
    defaultValues: {
      description: "",
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
          const { description } = data
          const response = await fetch("/api/generate-title", {
            method: "POST",
            body: JSON.stringify({
              description,
            }),
          })
          const { success, completion } = await response.json()
          if (success) {
            setCompletion(completion)
          }
        })}
      >
        <textarea {...register("description", { required: true })} />
        {errors.description && <p>A prompt must be specified.</p>}

        <input type="submit" />
      </form>
      <h2>Completion</h2>
      {completion.split("\n").map((line, ix) => (
        <p key={ix}>{line}</p>
      ))}
    </>
  )
}
