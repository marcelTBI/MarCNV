import React from 'react'
import { Controller } from 'react-hook-form'
import { TextField, TextFieldProps } from '@mui/material'

import FormProps from './FormProps'

type FormInputTextProps = FormProps &
  TextFieldProps & {
    minLength?: number
    validator?: (val: string) => string | boolean
  }

const FormInputText: React.FC<FormInputTextProps> = ({
  name,
  control,
  label,
  type = 'text',
  required = false,
  minLength,
  validator,
  onChange: onChangeSupp,
  ...props
}) => {
  // define validation rules
  const ruleRequired = required ? { required: 'Field is required!' } : {}
  const ruleMin =
    minLength !== undefined
      ? {
          minLength: {
            value: minLength,
            message: `Length should be at least ${minLength}!`,
          },
        }
      : {}
  const ruleValidator = validator ? { validate: validator } : {}

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={''}
      rules={{ ...ruleRequired, ...ruleMin, ...ruleValidator }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          {...props}
          helperText={error ? error.message : null}
          error={!!error}
          onChange={(event) => {
            onChange(event)
            onChangeSupp?.(event)
          }}
          value={value}
          variant='outlined'
          type={type}
          required={required}
          label={label}
        />
      )}
    />
  )
}

export default FormInputText
