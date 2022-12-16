export const scoreSeverity = (finalScore: number) => {
  let finalPrediction = 'Pathogenic'
  if (finalScore <= 0.99) finalPrediction = 'Likely Pathogenic'
  if (finalScore <= 0.89) finalPrediction = 'Unknown'
  if (finalScore <= -0.89) finalPrediction = 'Likely Benign'
  if (finalScore <= -0.99) finalPrediction = 'Benign'

  return finalPrediction
}
