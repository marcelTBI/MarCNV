import React, { useState } from 'react'
import { Container, Paper, Slider, Stack, Tooltip, Typography } from '@mui/material'

import { roundNumber, scoreSeverity } from '../functions/common'
import LabeledText from './LabeledText'

type Props = {
  title: string
  scoreACMG: number
  riskISV: number
}

const marks = [
  { value: 0, label: 'Conservative', tooltip: 'Take only ACMG criteria into account' },
  { value: 1.1, label: 'Balanced', tooltip: 'ACMG criteria and machine learning with similar impact' },
  { value: 2.2, label: 'Progressive', tooltip: 'Rely heavily on the machine learning approach' },
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
          <Slider
            value={strategy}
            onChange={(_, value) => setStrategy(value as number)}
            valueLabelDisplay='off'
            marks={marks.map((mark) => ({
              value: mark.value,
              label: (
                <Tooltip title={mark.tooltip}>
                  <Typography variant='subtitle1'>{mark.label}</Typography>
                </Tooltip>
              ),
            }))}
            max={2.2}
            step={null}
            sx={{
              '& .MuiSlider-markLabel[data-index="0"]': {
                transform: 'translateX(-28%)',
              },
              '& .MuiSlider-markLabel[data-index="2"]': {
                transform: 'translateX(-72%)',
              },
            }}
          />
        </Container>
        <Stack direction='row' spacing={2} alignItems='center' marginTop={4}>
          <LabeledText label='Combined Prediction' text={finalPrediction.label} color='white' fillColor={finalPrediction.fillColor} />
          <LabeledText label='Combined Score' text={roundNumber(finalScore).toString()} />
        </Stack>
        <Typography variant='subtitle1'>
          Combined prediction score is counted as: ACMG + r(MLP - 0.5), where ACMG is the ACMG score, MLP is the probability of being pathogenic from machine
          <br />
          learning, and r is 0 for "Conservative", 1.1 for "Balanced", and 2.2 for "Progressive" strategy.
        </Typography>
      </Stack>
    </Paper>
  )
}

export default CombinedCard
