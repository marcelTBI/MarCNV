import React from 'react'
import { Button, ButtonProps, CircularProgress } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

type Props = ButtonProps & {
  text: string
  loading?: boolean
}

const SubmitButton: React.FC<Props> = ({
  id,
  text,
  loading = false,
  startIcon = <CheckCircleOutlineIcon fontSize='inherit' />,
  variant = 'contained',
  disabled,
  ...props
}) => {
  const buttonId = `${id}_button`
  return (
    <Button
      {...props}
      id={buttonId}
      disabled={loading || disabled}
      variant={variant}
      type='submit'
      startIcon={loading ? <CircularProgress color='inherit' size={16} /> : startIcon}
    >
      {text}
    </Button>
  )
}

export default SubmitButton
