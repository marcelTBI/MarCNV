import React, { useState } from 'react'
import { Box, Stack } from '@mui/material'

import SearchCNV, { CNVStats } from '../components/SearchCNV'
import ACMGCard, { SectionResponse, SectionResponses } from '../components/ACMGCard'
import ISVCard, { ResultISV } from '../components/ISVCard'
import { backendRequest } from '../functions/restFetch'

const SearchPage: React.FC = () => {
  const [pickedSections, setPickedSections] = useState<SectionResponses>({})
  const [searchQuery, setSearchQuery] = useState<CNVStats | undefined>()
  const [resultISV, setResultISV] = useState<ResultISV | undefined>()

  const submitData = async (data: CNVStats) => {
    // query all APIs
    const promises = ['1', '2', '3', '4', '5'].map((num) => {
      const endpoint = `${process.env.REACT_APP_BACKEND_URL}/api/acmg/section${num}/${data.chrom}/${data.start}/${data.end}/${data.cnvType}`
      return backendRequest({ endpoint: endpoint })
    })
    const results = await Promise.all(promises)
    const endpoint = `${process.env.REACT_APP_BACKEND_URL}/api/cnv/${data.chrom}:${data.start}-${data.end}/risk/${data.cnvType}`
    const resultISV = await backendRequest({ endpoint: endpoint })
    // save results and query
    setSearchQuery(data)
    setResultISV(resultISV.json as ResultISV)
    setPickedSections(Object.assign({}, ...results.map((res, idx) => ({ [`section` + String(idx + 1)]: res.json as SectionResponse }))))
    // return error messages(s)
    return results
      .map((res) => res.errorMessage)
      .filter((err) => err !== '')
      .join(', ')
  }

  const cnvString = searchQuery
    ? ` - ${searchQuery.chrom}:${searchQuery.start.toLocaleString()}-${searchQuery.end.toLocaleString()} (${searchQuery.cnvType})`
    : ''

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      <Stack spacing={3} padding={3}>
        <SearchCNV submitData={submitData} />
        <Stack spacing={3}>
          <ISVCard title={'ISV decision' + cnvString} resultISV={resultISV} />
          <ACMGCard title={'ACMG guidelines' + cnvString} disabled={searchQuery === undefined} def={pickedSections} cnvType={searchQuery?.cnvType} />
        </Stack>
      </Stack>
    </Box>
  )
}

export default SearchPage
