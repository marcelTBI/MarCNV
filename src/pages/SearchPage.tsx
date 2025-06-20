import React, { useCallback, useState } from 'react'
import { Box, Stack } from '@mui/material'

import SearchCNVCard, { CNVStats } from '../components/SearchCNVCard'
import ACMGCard, { SectionResponse, SectionResponses } from '../components/ACMGCard'
import ISVCard, { ResultISV } from '../components/ISVCard'
import { backendRequest } from '../functions/restFetch'
import CombinedCard from '../components/CombinedCard'
import IntroCard from '../components/IntroCard'

const SearchPage: React.FC = () => {
  const [pickedSections, setPickedSections] = useState<SectionResponses>({})
  const [searchQuery, setSearchQuery] = useState<CNVStats | undefined>()
  const [resultISV, setResultISV] = useState<ResultISV | undefined>()
  const [acmgScore, setAcmgScore] = useState<number | undefined>()

  const submitData = async (data: CNVStats) => {
    // query all APIs
    const promises = ['1', '2', '3', '4', '5'].map((num) => {
      const endpoint = `${process.env.REACT_APP_BACKEND_URL}/api/acmg/section${num}/${data.chrom}/${data.start}/${data.end}/${data.cnvType}`
      return backendRequest({ endpoint: endpoint })
    })
    const results = await Promise.all(promises)
    const endpoint = `${process.env.REACT_APP_BACKEND_URL}/api/cnv/${data.chrom}:${data.start}-${data.end}/risk/${data.cnvType}`
    const resultISV = await backendRequest({ endpoint: endpoint })
    // check if all is OK:
    const allOK = results.map((res) => res.status).every((status) => status === 200) && resultISV.status === 200
    if (allOK) {
      // save results and query
      setSearchQuery(data)
      setResultISV(resultISV.json as ResultISV)
      setPickedSections(Object.assign({}, ...results.map((res, idx) => ({ [`section` + String(idx + 1)]: res.json as SectionResponse }))))
      return ''
    }
    // return error messages(s)
    const res = results.map((res) => res.errorMessage).find((err) => err !== '')
    return res ?? resultISV.errorMessage
  }

  const onChangeScore = useCallback((num: number) => {
    setAcmgScore(num)
  }, [])

  const finalScore =
    acmgScore ??
    Object.values(pickedSections)
      .map((response) => response.score)
      .reduce((partialSum, a) => partialSum + a, 0)

  const cnvString = searchQuery
    ? ` - ${searchQuery.chrom}:${searchQuery.start.toLocaleString('en-US')}-${searchQuery.end.toLocaleString('en-US')} (${searchQuery.cnvType})`
    : ''

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <Stack spacing={3} padding={3}>
        <IntroCard />
        <SearchCNVCard submitData={submitData} />
        {resultISV && <CombinedCard title={'Combined prediction' + cnvString} riskISV={resultISV.overall_risk} scoreACMG={finalScore} />}
        {resultISV && <ISVCard title={'Machine learning prediction' + cnvString} resultISV={resultISV} />}
        {Object.keys(pickedSections).length !== 0 && searchQuery && (
          <ACMGCard title={'ACMG guidelines' + cnvString} def={pickedSections} cnvType={searchQuery.cnvType} onChangeScore={onChangeScore} />
        )}
      </Stack>
    </Box>
  )
}

export default SearchPage
