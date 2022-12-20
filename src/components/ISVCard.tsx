import React from 'react'
import { Paper, Stack, Typography } from '@mui/material'

import LabeledText from './LabeledText'
import { predictions } from '../functions/common'

export type ResultISV = {
  overall_risk: number
  severity: string
}

type Props = {
  title: string
  resultISV?: ResultISV
}

type ISVresult = 'Pathogenic' | 'Benign' | 'Uncertain' | 'Likely pathogenic' | 'Likely benign'

const ISVCard: React.FC<Props> = ({ title, resultISV }) => {
  const severity = (resultISV?.severity ?? 'Uncertain') as ISVresult
  const finalPrediction =
    severity === 'Pathogenic'
      ? predictions.pathogenic
      : severity === 'Likely pathogenic'
      ? predictions.likelyPathogenic
      : severity === 'Uncertain'
      ? predictions.unknown
      : severity === 'Likely benign'
      ? predictions.likelyBenign
      : predictions.benign

  return (
    <Paper sx={{ padding: 2, flex: 1, maxWidth: 1200 }}>
      <Stack spacing={2}>
        <Typography variant='h5'>{title}</Typography>
        <Stack direction='row' spacing={2} alignItems='center'>
          <LabeledText label='Pathogenicity chance estimation' text={resultISV?.overall_risk ? (resultISV.overall_risk * 100).toFixed(1) + '%' : 'Unknown'} />
          <LabeledText label='Final Prediction' text={finalPrediction.label} color={finalPrediction.color} />
        </Stack>
      </Stack>
    </Paper>
  )
}

export default ISVCard
