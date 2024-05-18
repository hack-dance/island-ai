/**
 * Calculate the dot product of two vectors
 * @param a - First vector
 * @param b - Second vector
 * @returns The dot product
 */
function dot(a: number[], b: number[]): number {
  return a.reduce((sum, val, index) => sum + val * b[index], 0)
}

/**
 * Calculate the cosine similarity between two vectors
 * @param a - First vector
 * @param b - Second vector
 * @returns The cosine similarity (0 to 1)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = dot(a, b)
  const magnitudeA = Math.sqrt(dot(a, a))
  const magnitudeB = Math.sqrt(dot(b, b))
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0
}
