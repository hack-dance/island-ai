export const data = [
  {
    prompt: "Who were the key figures in the American civil war?",
    completion:
      "Key figures in the American Civil War included President Abraham Lincoln from the North, Confederate President Jefferson Davis, General Robert E. Lee from the South, and General Ulysses S. Grant from the North."
  },
  {
    prompt: "What was the Roman Empire?",
    completion:
      "The Roman Empire was a vast and powerful civilization that emerged in Italy around 27 BC, and lasted till 476 AD. Its domain extended over three continents, Europe, Asia, and Africa."
  },
  {
    prompt: "Tell me about the Renaissance.",
    completion:
      "The Renaissance spanned from the 14th to the 17th century, this was a fervent period of European cultural, artistic, political and economic 'rebirth' following the Middle Ages. Key figures such as Leonardo Da Vinci and Michelangelo made significant contributions."
  },
  {
    prompt: "What led to the fall of the Berlin Wall?",
    completion:
      "The Berlin Wall fell in 1989, largely due to political pressure from key international leaders, growing civil unrest in East Germany, and the economic disparity manifest by the prosperity of West Germany."
  },
  {
    prompt: "When was the Magna Carta signed?",
    completion: "The Magna Carta was signed on June 15 1215, in Runnymede, England."
  },
  {
    prompt: "Who was Confucius?",
    completion:
      "Confucius was an influential Chinese philosopher, teacher and political figure known for his popular adages and for his models of social interaction. His philosophy, known as Confucianism, is crucial for understanding Chinese culture today."
  },
  {
    prompt: "Who discovered gravity?",
    completion:
      "The natural phenomenon of gravity was known to humanity, but it was Sir Isaac Newton who first proposed the Universal Law of Gravitation in the 17th century."
  }
]

export const accuracyData = [
  {
    completion: "The capital of France is Paris.",
    expectedCompletion: "The capital of France is Paris."
  },
  {
    completion: "Paris is the capital of france.",
    expectedCompletion: "The capital of France is Paris."
  },
  {
    completion: "it's paris.",
    expectedCompletion: "The capital of France is Paris."
  }
]
