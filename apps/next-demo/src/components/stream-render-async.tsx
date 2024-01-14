import { Suspense } from "react"

export default async function StreamRenderAsync({ prompt }) {
  const dataPromise = await handleDataStream({
    prompt
  })

  return (
    <Suspense fallback={<div>loading...</div>}>
      <StreamRenderer data={dataPromise} />
    </Suspense>
  )
}
