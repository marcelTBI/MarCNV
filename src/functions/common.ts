export const predictions = {
  benign: { label: 'Benign', color: 'green' },
  likelyBenign: { label: 'Likely Benign', color: 'palegreen' },
  unknown: { label: 'Unknown', color: 'grey' },
  likelyPathogenic: { label: 'Likely Pathogenic', color: 'tomato' },
  pathogenic: { label: 'Pathogenic', color: 'red' },
}

export const scoreSeverity = (finalScore: number) => {
  let finalPrediction = predictions.pathogenic
  if (finalScore <= 0.99) finalPrediction = predictions.likelyPathogenic
  if (finalScore <= 0.89) finalPrediction = predictions.unknown
  if (finalScore <= -0.89) finalPrediction = predictions.likelyBenign
  if (finalScore <= -0.99) finalPrediction = predictions.benign

  return finalPrediction
}
