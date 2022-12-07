import React from 'react'
import { Paper, Stack, Typography } from '@mui/material'

type Props = {
  title: string
}

const ResultCard: React.FC<Props> = ({ title }) => {
  return (
    <Paper>
      <Stack>
        <Typography variant='h3'>{title}</Typography>
      </Stack>
    </Paper>
  )
}

export default ResultCard
