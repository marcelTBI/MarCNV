import React from 'react'
import { Button, ButtonProps, CircularProgress } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

type Props = ButtonProps & {
  children: React.ReactNode
  loading?: boolean
}

const SubmitButton: React.FC<Props> = ({
  id,
  children,
  loading = false,
  startIcon = <CheckCircleOutlineIcon fontSize='inherit' />,
  variant = 'contained',
  disabled,
  ...props
}) => {
  const buttonId = `${id}_button`
  const loadingSize = props.size === 'small' ? 18 : props.size === 'large' ? 22 : 20

  return (
    <Button
      {...props}
      id={buttonId}
      disabled={loading || disabled}
      variant={variant}
      type='submit'
      startIcon={loading ? <CircularProgress color='inherit' size={loadingSize} /> : startIcon}
    >
      {children}
    </Button>
  )
}

export default SubmitButton
