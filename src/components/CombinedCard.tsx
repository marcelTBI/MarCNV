import React, { useState } from 'react'
import { Paper, Slider, Stack, Typography } from '@mui/material'
import { scoreSeverity } from '../functions/common'
import { Container } from '@mui/system'
import LabeledText from './LabeledText'

type Props = {
  title: string
  scoreACMG: number
  riskISV: number
}

const marks = [
  { value: 0, label: 'Conservative' },
  { value: 1.1, label: 'Balanced' },
  { value: 2.2, label: 'Progressive' },
]

const CombinedCard: React.FC<Props> = ({ title, scoreACMG, riskISV }) => {
  const [strategy, setStrategy] = useState<number>(1.1)

  const finalScore = scoreACMG + strategy * (riskISV - 0.5)
  const finalPrediction = scoreSeverity(finalScore)

  return (
    <Paper sx={{ padding: 2, flex: 1, maxWidth: 1200 }}>
      <Stack spacing={2}>
        <Typography variant='h5'>{title}</Typography>
        <Container>
          <Slider value={strategy} onChange={(_, value) => setStrategy(value as number)} valueLabelDisplay='off' marks={marks} max={2.2} step={null} />
        </Container>
        <Stack direction='row' spacing={2} alignItems='center' marginTop={4}>
          <LabeledText label='Final Score' text={finalScore.toString()} />
          <LabeledText label='Final Prediction' text={finalPrediction.label} color={finalPrediction.color} />
        </Stack>
        <Typography variant='body2'>
          Combined prediction score is counted as: ACMG + r(MLP - 0.5), where ACMG is the ACMG score, MLP is the probability of being pathogenic from machine
          learning,
          <br />
          and r is 0 for conservative, 1.1 for balanced, and 2.2 for progressive strategy.
        </Typography>
      </Stack>
    </Paper>
  )
}

export default CombinedCard
