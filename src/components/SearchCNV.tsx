import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Divider, Link, Paper, Stack, Typography } from '@mui/material'

import SubmitButton from '../components/SubmitButton'
import FormInputText from '../components/forms/FormInputText'
import FormInputComboBox from '../components/forms/FormInputComboBox'
import { Option } from '../components/forms/FormProps'

type FormInput = {
  chrom: Option
  start: string
  end: string
  cnvType: Option
  nomenclature: string
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

const nomenclatureToInterval = (nomenclature: string) => {
  const regexp = new RegExp('^chr(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|X|Y):[,0-9]+-[,0-9]+$')
  if (!regexp.test(nomenclature)) return
  const [chrom, rest] = nomenclature.split(':')
  const [start, end] = rest.split('-')
  const startNum = Number(start.replaceAll(',', ''))
  const endNum = Number(end.replaceAll(',', ''))
  return [chrom, startNum, endNum] as const
}

const validateNomenclature = (nomenclature: string) => {
  const interval = nomenclatureToInterval(nomenclature)
  if (!interval) return nomenclature === '' || 'Nomenclature not in a proper format (chr5:123456789-234567890)'
  const [, startNum, endNum] = interval
  if (startNum >= endNum) return 'End location is BEFORE start location!'
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
  const { handleSubmit, control, watch, setValue } = useForm<FormInput>({ defaultValues: {} })
  const locStart = watch('start')
  const locEnd = watch('end')
  // const locChrom = watch('chrom')
  const nomenclature = watch('nomenclature')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // convert nomenclature to normal interval
  useEffect(() => {
    const interval = nomenclatureToInterval(nomenclature)
    if (interval) {
      const [chrom, startNum, endNum] = interval
      setValue('start', startNum.toString())
      setValue('end', endNum.toString())
      setValue('chrom', chromosomes.find((value) => value.label === chrom) as Option)
    }
  }, [nomenclature, setValue])

  // convert normal interval to nomenclature - does not work due to update cycles
  /* useEffect(() => {
    console.log(locStart, locEnd, locChrom)
    if (locChrom && locStart && locEnd) {
      setValue('nomenclature', `${locChrom.label}:${locStart.toLocaleString()}-${locEnd.toLocaleString()}`)
    }
  }, [locStart, locEnd, locChrom]) */

  const getSize = () => {
    if (locStart && locEnd && !isNaN(Number(locEnd)) && !isNaN(Number(locStart))) {
      const lengthCNV = Number(locEnd) - Number(locStart)
      if (lengthCNV <= 0) return '--- b'
      if (lengthCNV >= 1000000) return `${(lengthCNV / 1000000).toFixed(0)} Mb`
      if (lengthCNV >= 1000) return `${(lengthCNV / 1000).toFixed(0)} Kb`
      return `${lengthCNV} b`
    }
    return '--- b'
  }

  const onSubmit = async (data: FormInput) => {
    setLoading(true)
    setValue('nomenclature', `${data.chrom.label}:${data.start.toLocaleString()}-${data.end.toLocaleString()}`)
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
      <Stack spacing={3} alignItems='center'>
        <Typography variant='h5'>Interpretation of copy-number variants</Typography>
        <Stack spacing={2} direction='row'>
          <Stack spacing={2} alignItems='center'>
            <Stack spacing={2} direction='row' alignItems='center'>
              <FormInputText
                name='nomenclature'
                control={control}
                label='Nomenclature string'
                disabled={loading}
                validator={validateNomenclature}
                sx={{ minWidth: 350 }}
                placeholder='chr:start-end'
              />
              <Typography> OR </Typography>
            </Stack>
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
            </Stack>
          </Stack>
          <Divider orientation='vertical' flexItem />
          <Stack spacing={2} direction='row' alignItems='center'>
            <FormInputComboBox name='cnvType' control={control} label='CNV type' disabled={loading} options={cnvTypes} sx={{ minWidth: 170 }} required />
            <SubmitButton loading={loading} id='login' text={`Annotate (${getSize()})`} onClick={handleSubmit(onSubmit)} size='large' sx={{ minWidth: 235 }} />
          </Stack>
        </Stack>
        {errorMessage && <Alert severity={'error'}>{errorMessage}</Alert>}
        <Typography align='center' variant='body2'>
          Further information can be found in (we also encourage you to cite it if you find this tool helpful):
          <br />
          <Link variant='body2' href='https://www.nature.com/articles/s41598-021-04505-z' target='_blank' rel='noreferrer'>
            Gažiová, M., Sládeček, T., Pös, O. et al. Automated prediction of the clinical impact of structural copy number variations. Sci Rep 12, 555 (2022).
          </Link>
          <br />
          Free for non-commercial use.
        </Typography>
      </Stack>
    </Paper>
  )
}

export default SearchCNV
