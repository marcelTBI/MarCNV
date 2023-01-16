export const predictions = {
  benign: { label: 'Benign', color: 'green', fillColor: '#008000' },
  likelyBenign: { label: 'Likely Benign', color: 'palegreen', fillColor: '#44C044' },
  unknown: { label: 'Unknown', color: 'grey', fillColor: '#B0B0B0' },
  likelyPathogenic: { label: 'Likely Pathogenic', color: 'tomato', fillColor: '#FF8888' },
  pathogenic: { label: 'Pathogenic', color: 'red', fillColor: '#FF4444' },
}

export const scoreSeverity = (finalScore: number) => {
  let finalPrediction = predictions.pathogenic
  if (finalScore <= 0.99) finalPrediction = predictions.likelyPathogenic
  if (finalScore <= 0.89) finalPrediction = predictions.unknown
  if (finalScore <= -0.89) finalPrediction = predictions.likelyBenign
  if (finalScore <= -0.99) finalPrediction = predictions.benign

  return finalPrediction
}

export const roundNumber = (score: number, pow: number = 2) => {
  return Math.round((score + Number.EPSILON) * Math.pow(10, pow)) / Math.pow(10, pow)
}
