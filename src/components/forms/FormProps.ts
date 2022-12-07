import { Control } from 'react-hook-form'

type FormProps = {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, any>
  label: string
}

export type Option = {
  id: number
  label: string
  value?: Record<string, unknown>
}

export default FormProps
