"use client"

import { useForm, useWatch } from "react-hook-form"

export default function Prompt() {
  const { register, handleSubmit, formState, watch } = useForm()

  return (
    <>
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        <textarea {...(register("prompt"), { required: true, type: "text" })} />
        {formState.errors.prompt && <p>A prompt must be specified.</p>}

        <select {...register("content_size")}>
          <option>Choose response length</option>
          <option value="100">Short</option>
          <option value="300">Medium</option>
          <option value="600">Long</option>
        </select>
        <input type="submit" />
      </form>
      {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
    </>
  )
}
