import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Divider, Paper, Stack, TextField, Typography } from '@mui/material'

import { Option } from './forms/FormProps'
import { backendRequest } from '../functions/restFetch'
import { scoreSeverity } from '../functions/common'
import FormInputComboBox from './forms/FormInputComboBox'
import LabeledText from './LabeledText'

type FormInput = {
  section1?: Option
  section2?: Option
  section3?: Option
  section4?: Option
  section5?: Option
}

export type SectionResponse = {
  section: string
  option: string
  score: number
  reason: string
}

export type SectionResponses = {
  section1?: SectionResponse
  section2?: SectionResponse
  section3?: SectionResponse
  section4?: SectionResponse
  section5?: SectionResponse
}

type SectionStrings = 'section1' | 'section2' | 'section3' | 'section4' | 'section5'

type Props = {
  title: string
  disabled?: boolean
  def: SectionResponses
  cnvType: 'gain' | 'loss'
  onChangeScore?: (score: number) => void
}

type Section = {
  [key: string]: Record<string, unknown>
}

const getSection = (section: string, acmg: Record<string, Section>) => {
  if (section in acmg) {
    const { name, info, ...others } = acmg[section]
    return Object.keys(others).map((key, id) => ({ label: key, id: id, value: others[key] }))
  }
  return []
}

const ACMGCard: React.FC<Props> = ({ title, def, disabled, cnvType, onChangeScore }) => {
  const [acmg, setAcmg] = useState({})

  const { control, setValue, watch } = useForm<FormInput>({ defaultValues: {} })

  const getScore: (section: SectionStrings) => number = (section: SectionStrings) => {
    const sectionMenuItem = watch(section)
    if (sectionMenuItem !== undefined && def?.[section]?.option === sectionMenuItem?.label) return def?.[section]?.score ?? 0
    const sectionInfo = sectionMenuItem?.value
    if (!sectionInfo) return 0
    return Number(sectionInfo['Suggested points']) ?? (Number(sectionInfo['Max Score']) - Number(sectionInfo['Min Score'])) / 2.0
  }

  let finalScore = 0
  for (const sec of ['1', '2', '3', '4', '5']) {
    finalScore += getScore(`section${sec}` as SectionStrings)
  }
  const finalPrediction = scoreSeverity(finalScore)

  const isModifiedSection = (section: SectionStrings) => {
    const sectionMenuItem = watch(section)
    // is the section modified?
    return sectionMenuItem !== undefined && def?.[section]?.option !== sectionMenuItem?.label
  }

  const modifiedSections = ['1', '2', '3', '4', '5']
    .filter((sec) => isModifiedSection(`section${sec}` as SectionStrings))
    .map((sec) => def?.[`section${sec}` as SectionStrings]?.option)

  const getReason = (section: SectionStrings) => {
    const sectionMenuItem = watch(section)
    // is the section unmodified and filled?
    if (sectionMenuItem !== undefined && def?.[section]?.option === sectionMenuItem?.label) return def?.[section]?.reason ?? 'No reason...'
    // if not, return 'Evidence' if found
    return sectionMenuItem?.value?.['Evidence'] ?? 'No reason...'
  }

  // is the finalScore changes, notify parent
  useEffect(() => {
    onChangeScore?.(finalScore)
  }, [finalScore, onChangeScore])

  // set the predicted values when the acmg data is loaded (this is probably useEffect that can be removed)
  useEffect(() => {
    for (const sec of ['1', '2', '3', '4', '5']) {
      if (def?.[`section${sec}` as SectionStrings]) {
        setValue(
          `section${sec}` as SectionStrings,
          getSection(sec, acmg).find((val) => val.label === def[`section${sec}` as SectionStrings]?.option)
        )
      }
    }
  }, [def, acmg, setValue])

  // fetch acmg data
  useEffect(() => {
    const fetchACMG = async () => {
      const { json } = await backendRequest({ endpoint: `${process.env.REACT_APP_BACKEND_URL}/api/global/acmg_text/${cnvType}` })
      setAcmg(json)
    }

    fetchACMG().catch(console.error)
  }, [cnvType])

  return (
    <Paper sx={{ padding: 2, flex: 1 }}>
      <Stack spacing={2}>
        <Stack direction='row' alignItems='center' display='flex' justifyContent='space-between'>
          <Typography variant='h5'>{title}</Typography>
          {modifiedSections.length > 0 && (
            <Typography variant='body2' sx={{ color: 'red' }}>
              Modified (predicted: {modifiedSections.join(', ')})
            </Typography>
          )}
        </Stack>
        <Stack direction='row' spacing={2} alignItems='center'>
          <LabeledText label='Prediction' text={finalPrediction.label} color='black' fillColor={finalPrediction.fillColor} />
          <LabeledText label='Score' text={finalScore.toString()} />
        </Stack>
        <Divider />
        {['1', '2', '3', '4', '5'].map((sec) => (
          <Stack spacing={2} key={sec}>
            <Stack direction='row' spacing={2} alignItems='center'>
              <FormInputComboBox
                name={`section${sec}` as const}
                label={`Section ${sec}`}
                control={control}
                options={getSection(sec, acmg)}
                disabled={disabled}
                size='small'
                fullWidth
              />
              <TextField disabled label='Score' size='small' value={getScore(`section${sec}` as SectionStrings)} />
            </Stack>
            <TextField disabled label='Reason' size='small' variant='standard' value={getReason(`section${sec}` as SectionStrings)} multiline />
          </Stack>
        ))}
      </Stack>
    </Paper>
  )
}

export default ACMGCard
