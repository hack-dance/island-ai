import { ActivePath, CompletionMeta } from ".."

export function isPathComplete(activePath: ActivePath, data: { _meta: CompletionMeta }): boolean {
  const { _completedPaths } = data?._meta ?? {}

  return _completedPaths.some(completedPath => {
    if (completedPath.length !== activePath.length) {
      return false
    }

    return completedPath.every((compPathElement, index) => {
      const activePathElement = activePath[index]

      if (compPathElement === undefined || activePathElement === undefined) {
        return true
      }
      return compPathElement === activePathElement
    })
  })
}
