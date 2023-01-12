import React from 'react'
import { Controller } from 'react-hook-form'
import { Autocomplete, TextField, AutocompleteProps } from '@mui/material'

import FormProps, { Option } from './FormProps'

type FormInputComboBoxProps = FormProps &
  Omit<AutocompleteProps<Option, boolean, false, false>, 'renderInput'> & {
    options: Option[]
    variant?: 'filled' | 'outlined' | 'standard'
    required?: boolean
    keepSelectedOption?: boolean
  }

const FormInputComboBox: React.FC<FormInputComboBoxProps> = ({
  name,
  control,
  label,
  required,
  keepSelectedOption = false,
  options = [],
  variant = 'outlined',
  multiple = false,
  onChange: onChangeSupp,
  ...props
}) => {
  // define validation rules
  const ruleRequired = required ? { required: 'Field is required!' } : {}

  return (
    <Controller
      name={name}
      control={control}
      rules={ruleRequired}
      defaultValue={multiple ? [] : null}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          {...props}
          sx={{ minWidth: 170 }}
          multiple={multiple}
          id={`${name}-select`}
          options={keepSelectedOption && !multiple ? [value, ...options] : options}
          value={value}
          onChange={(event, data, reason) => {
            onChange(data)
            onChangeSupp?.(event, data, reason)
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              error={!!error}
              helperText={error ? error.message : null}
              variant={variant}
              label={label}
              autoComplete='disabled'
              required={required}
            />
          )}
          getOptionLabel={(option: Option | null) => option?.label ?? ''}
          isOptionEqualToValue={(option: Option, valueOption: Option) => option.label === valueOption.label}
        />
      )}
    />
  )
}

export default FormInputComboBox
