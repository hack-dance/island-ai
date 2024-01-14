import { ExtractTest } from "@/components/extract-test"

export default async function Page() {
  return (
    <div className="flex flex-col h-full flex-1">
      <div className="overflow-y-auto">
        <div className="py-12 px-6">
          <ExtractTest />
        </div>
      </div>
    </div>
  )
}
