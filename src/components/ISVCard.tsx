import React from 'react'
import { Paper, Stack, TextField, Typography } from '@mui/material'

export type ResultISV = {
  overall_risk: number
  severity: string
}

type Props = {
  title: string
  resultISV?: ResultISV
}

const ISVCard: React.FC<Props> = ({ title, resultISV }) => {
  return (
    <Paper sx={{ padding: 2, flex: 1, maxWidth: 1200 }}>
      <Stack spacing={2}>
        <Typography variant='h5'>{title}</Typography>
        <Stack direction='row' spacing={2} alignItems='center'>
          <TextField
            disabled
            label='Pathogenicity chance estimation'
            value={resultISV?.overall_risk ? (resultISV.overall_risk * 100).toFixed(1) + '%' : 'Unknown'}
            fullWidth
          />
          <TextField disabled label='Final Prediction' value={resultISV?.severity ?? 'Unknown'} fullWidth />
        </Stack>
      </Stack>
    </Paper>
  )
}

export default ISVCard
