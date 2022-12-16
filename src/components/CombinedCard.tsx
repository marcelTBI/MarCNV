import React, { useState } from 'react'
import { Paper, Slider, Stack, TextField, Typography } from '@mui/material'
import { scoreSeverity } from '../functions/common'

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

  return (
    <Paper sx={{ padding: 2, flex: 1 }}>
      <Stack spacing={2}>
        <Typography variant='h5'>{title}</Typography>
        <Slider value={strategy} onChange={(_, value) => setStrategy(value as number)} valueLabelDisplay='auto' marks={marks} max={2.2} step={null} />
        <Stack direction='row' spacing={2} alignItems='center' marginTop={4}>
          <TextField disabled label='Final Score' value={finalScore} fullWidth />
          <TextField disabled label='Final Prediction' value={scoreSeverity(finalScore)} fullWidth />
        </Stack>
      </Stack>
    </Paper>
  )
}

export default CombinedCard
