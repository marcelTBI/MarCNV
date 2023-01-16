import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Box, Divider, Link, Paper, Stack, Typography } from '@mui/material'

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
  { id: 0, label: 'Deletion' },
  { id: 1, label: 'Duplication' },
]

type Example = {
  cnvType: Option
  nomenclature: string
  label: string
}

const examples: Example[] = [
  { cnvType: cnvTypes[0], nomenclature: 'chr16:34,289,161-34,490,212', label: 'Benign DUP. 16p11.2' },
  { cnvType: cnvTypes[0], nomenclature: 'chr4:80,000-2,020,000', label: 'Wolf-Hirschhorn' },
  { cnvType: cnvTypes[0], nomenclature: 'chr5:0-15,680,000', label: 'Cri-du-chat' },
  { cnvType: cnvTypes[0], nomenclature: 'chr15:22,760,000-28,560,000', label: 'Willi/Angelman' },
  { cnvType: cnvTypes[0], nomenclature: 'chr22:18,660,000-21,520,000', label: 'DiGeorge' },
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
  const locChrom = watch('chrom')
  //const nomenclature = watch('nomenclature')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const updateRanges = useCallback(
    (nomenclature: string) => {
      const interval = nomenclatureToInterval(nomenclature)
      if (interval) {
        const [chrom, startNum, endNum] = interval
        setValue('start', startNum.toString())
        setValue('end', endNum.toString())
        setValue('chrom', chromosomes.find((value) => value.label === chrom) as Option)
      }
    },
    [setValue]
  )

  /* // convert nomenclature to normal interval (converted directly in onChange callback)
  useEffect(() => {
    updateRanges(nomenclature)
  }, [nomenclature, updateRanges])*/

  // convert normal interval to nomenclature
  useEffect(() => {
    if (locChrom && locStart && locEnd) {
      setValue('nomenclature', `${locChrom.label}:${locStart.toLocaleString()}-${locEnd.toLocaleString()}`)
    }
  }, [locStart, locEnd, locChrom, setValue])

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
      cnvType: data.cnvType.label === 'Deletion' ? 'loss' : 'gain',
    })
    setErrorMessage(error)
    setLoading(false)
  }

  const runExample = async (example: Example) => {
    setValue('nomenclature', example.nomenclature)
    updateRanges(example.nomenclature)
    setValue('cnvType', example.cnvType)
    await handleSubmit(onSubmit)()
  }

  return (
    <Paper sx={{ padding: 2, flex: 1 }}>
      <Stack spacing={2} alignItems='center'>
        <Typography variant='h5'>Interpretation of copy-number variants</Typography>
        <Stack alignItems='flex-start'>
          <Typography variant='body2' component='div'>
            Method for automated prediction of pathogenicity of CNVs. The clinical impact of an input CNV is predicted with two complementary tools and their
            combination:
          </Typography>
          <Typography variant='body2' component='div'>
            <Box sx={{ fontWeight: 'bold', display: 'inline' }}>Machine learning prediction</Box> - impact of a CNV is predicted based on CNVs with known impact
            and their similarity to input CNV <br />
            <Box sx={{ fontWeight: 'bold', display: 'inline' }}>ACMG guidelines</Box> - impact of a CNV is predicted based on automatic evaluation of{' '}
            <Link variant='body2' href='https://pubmed.ncbi.nlm.nih.gov/31690835' target='_blank' rel='noreferrer'>
              ACMG guidelines
            </Link>
            <br />
            <Box sx={{ fontWeight: 'bold', display: 'inline' }}>Combined prediction</Box> - combination of the two previous approaches
          </Typography>
          <Typography variant='body2'>
            Further information can be found in (we also encourage you to cite it if you find this tool helpful):
            <br />
            <Link variant='body2' href='https://www.nature.com/articles/s41598-021-04505-z' target='_blank' rel='noreferrer'>
              Gažiová, M., Sládeček, T., Pös, O. et al. Automated prediction of the clinical impact of structural copy number variations. Sci Rep 12, 555
              (2022).
            </Link>
            <br />
            Free for non-commercial use.
            <br />
            Usage: Define your CNV finding by one of the option below:
          </Typography>
        </Stack>
        <Divider flexItem>Nomenclature input</Divider>
        <Stack spacing={2} direction='row' alignItems='center' alignSelf='flex-start'>
          <FormInputText
            name='nomenclature'
            control={control}
            label='Nomenclature string'
            disabled={loading}
            validator={validateNomenclature}
            sx={{ minWidth: 350 }}
            placeholder='e.g. chr1:15,560,138-15,602,954'
            onChange={(event) => updateRanges(event.target.value)}
          />
          <FormInputComboBox name='cnvType' control={control} label='CNV type' disabled={loading} options={cnvTypes} sx={{ minWidth: 170 }} required />
          <SubmitButton loading={loading} id='login' onClick={handleSubmit(onSubmit)} size='large' sx={{ minWidth: 235 }}>
            Annotate ({getSize()})
          </SubmitButton>
        </Stack>
        <Divider flexItem>Positional input</Divider>
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
          <SubmitButton loading={loading} id='login' onClick={handleSubmit(onSubmit)} size='large' sx={{ minWidth: 235 }}>
            Annotate ({getSize()})
          </SubmitButton>
        </Stack>
        {errorMessage && <Alert severity={'error'}>{errorMessage}</Alert>}
        <Divider flexItem>Examples</Divider>
        <Stack spacing={2} direction='row'>
          {examples.map((example) => (
            <SubmitButton variant='contained' key={example.nomenclature} size='small' loading={loading} onClick={() => runExample(example)}>
              {example.label} <br /> {example.nomenclature}
            </SubmitButton>
          ))}
        </Stack>
      </Stack>
    </Paper>
  )
}

export default SearchCNV
