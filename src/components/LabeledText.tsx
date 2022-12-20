import React from 'react'
import { Stack, Typography } from '@mui/material'

type Props = {
  label: string
  text: string
  color?: string
}

const LabeledText: React.FC<Props> = ({ label, text, color }) => {
  return (
    <Stack flex='1' spacing={0.5} sx={{ border: '1px solid lightgrey', borderRadius: '5px', paddingLeft: '14px', paddingY: '8px' }}>
      <Typography variant='caption' color='#A0A0A0'>
        {label}
      </Typography>
      <Typography variant='body1' color={color}>
        {text}
      </Typography>
    </Stack>
  )
}

export default LabeledText
