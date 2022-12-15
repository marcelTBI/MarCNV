import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Paper, Stack, Typography } from '@mui/material'

import SubmitButton from '../components/SubmitButton'
import FormInputText from '../components/forms/FormInputText'
import FormInputComboBox from '../components/forms/FormInputComboBox'
import { Option } from '../components/forms/FormProps'

type FormInput = {
  chrom: Option
  start: string
  end: string
  cnvType: Option
}

export type CNVStats = {
  chrom: string
  start: number
  end: number
  cnvType: 'gain' | 'loss'
}

type Props = {
  submitData: (data: CNVStats) => Promise<string>
}

const chromosomes: Option[] = [
  { id: 1, label: 'chr1' },
  { id: 2, label: 'chr2' },
  { id: 3, label: 'chr3' },
  { id: 4, label: 'chr4' },
  { id: 5, label: 'chr5' },
  { id: 6, label: 'chr6' },
  { id: 7, label: 'chr7' },
  { id: 8, label: 'chr8' },
  { id: 9, label: 'chr9' },
  { id: 10, label: 'chr10' },
  { id: 11, label: 'chr11' },
  { id: 12, label: 'chr12' },
  { id: 13, label: 'chr13' },
  { id: 14, label: 'chr14' },
  { id: 15, label: 'chr15' },
  { id: 16, label: 'chr16' },
  { id: 17, label: 'chr17' },
  { id: 18, label: 'chr18' },
  { id: 19, label: 'chr19' },
  { id: 20, label: 'chr20' },
  { id: 21, label: 'chr21' },
  { id: 22, label: 'chr22' },
  { id: 23, label: 'chrX' },
  { id: 24, label: 'chrY' },
]

const cnvTypes: Option[] = [
  { id: 0, label: 'del' },
  { id: 1, label: 'dup' },
]

const validateStart = (location: string) => {
  const locNum = Number(location)
  if (isNaN(locNum)) return 'Provided location is not a number!'
  return true
}

const validateEnd = (end: string, start: string) => {
  const endNum = Number(end)
  const startNum = Number(start)
  if (isNaN(endNum)) return 'Provided location is not a number!'
  if (!isNaN(startNum) && startNum >= endNum) return 'End location is BEFORE start location!'
  return true
}

const SearchCNV: React.FC<Props> = ({ submitData }) => {
  const { handleSubmit, control, watch } = useForm<FormInput>({ defaultValues: {} })
  const locStart = watch('start')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (data: FormInput) => {
    setLoading(true)
    const error = await submitData({
      chrom: data.chrom.label,
      start: Number(data.start),
      end: Number(data.end),
      cnvType: data.cnvType.label === 'del' ? 'loss' : 'gain',
    })
    setErrorMessage(error)
    setLoading(false)
  }

  return (
    <Paper sx={{ padding: 2, flex: 1 }}>
      <Stack spacing={2} alignItems='center'>
        <Typography variant='h4'>MarCNV</Typography>
        <Stack spacing={2} direction='row' alignItems='center'>
          <FormInputComboBox name='chrom' control={control} label='Chromosome' disabled={loading} options={chromosomes} sx={{ minWidth: 170 }} required />
          <Typography>:</Typography>
          <FormInputText
            name='start'
            control={control}
            label='Location start'
            inputProps={{ inputMode: 'numeric' }}
            disabled={loading}
            validator={validateStart}
            sx={{ minWidth: 170 }}
            required
          />
          <Typography>-</Typography>
          <FormInputText
            name='end'
            control={control}
            label='Location end'
            inputProps={{ inputMode: 'numeric' }}
            disabled={loading}
            validator={(value) => validateEnd(value, locStart)}
            sx={{ minWidth: 170 }}
            required
          />
          <FormInputComboBox name='cnvType' control={control} label='CNV type' disabled={loading} options={cnvTypes} sx={{ minWidth: 170 }} required />
          <SubmitButton loading={loading} id='login' text='Annotate CNV' onClick={handleSubmit(onSubmit)} size='large' sx={{ minWidth: 220 }} />
        </Stack>
        {errorMessage && <Alert severity={'error'}>{errorMessage}</Alert>}
      </Stack>
    </Paper>
  )
}

export default SearchCNV
