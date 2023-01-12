import React from 'react'
import { Stack, Typography } from '@mui/material'

type Props = {
  label: string
  text: string
  color?: string
  fillColor?: string
}

const LabeledText: React.FC<Props> = ({ label, text, color, fillColor }) => {
  const stackStyle = { border: '1px solid lightgrey', borderRadius: '5px', paddingLeft: '14px', paddingY: '8px', backgroundColor: fillColor }

  return (
    <Stack flex='1' spacing={0.5} sx={stackStyle}>
      <Typography variant='caption' color={fillColor ? 'white' : '#A0A0A0'} sx={{ fontWeight: 'bold' }}>
        {label}
      </Typography>
      <Typography variant='body1' color={color}>
        {text}
      </Typography>
    </Stack>
  )
}

export default LabeledText
