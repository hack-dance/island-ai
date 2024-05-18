// contextData.ts
export const contextData = [
  {
    prompt: "When was the first super bowl?",
    completion: "The first super bowl was held on January 15, 1967.",
    groundTruth: "The first super bowl was held on January 15, 1967.",
    contexts: [
      "The First AFL–NFL World Championship Game was an American football game played on January 15, 1967, at the Los Angeles Memorial Coliseum in Los Angeles.",
      "This first championship game is retroactively referred to as Super Bowl I."
    ]
  },
  {
    prompt: "Who won the most Super Bowls?",
    completion: "The New England Patriots have won the most Super Bowls.",
    groundTruth: "The New England Patriots have won the Super Bowl a record six times.",
    contexts: [
      "The New England Patriots have won the Super Bowl a record six times.",
      "Other notable teams include the Pittsburgh Steelers with six and the San Francisco 49ers with five."
    ]
  }
]

// accuracyData.ts

export const accuracyData = [
  {
    completion: "The first superbowl was held on January 15th, 1967.",
    expectedCompletion: "The first superbowl was held on January 15, 1967."
  },
  {
    completion: "The New England Patriots hold the record with six Super Bowl wins.",
    expectedCompletion: "The New England Patriots have won the Super Bowl a record six times."
  },
  {
    completion: "The Eiffel Tower is located in Berlin.",
    expectedCompletion: "The Eiffel Tower is located in Paris."
  }
]

// data.ts

export const data = [
  {
    prompt: "What were the key causes of the Great Depression?",
    completion:
      "The Great Depression was caused by a combination of factors including the stock market crash of 1929, bank failures, and high unemployment rates.",
    expectedCompletion:
      "The key causes of the Great Depression include the stock market crash of 1929, bank failures, and high unemployment rates."
  },
  {
    prompt: "Describe the significance of the moon landing in 1969.",
    completion:
      "The moon landing in 1969 was significant as it marked the first time humans set foot on the moon, showcasing the technological advancements of the time.",
    expectedCompletion:
      "The moon landing in 1969 was significant because it was the first time humans landed on the moon, demonstrating significant technological achievements."
  }
]
