import React from 'react'
import { Box, Link, Paper, Stack, Typography } from '@mui/material'

const IntroCard: React.FC = () => {
  return (
    <Paper sx={{ padding: 2, flex: 1 }}>
      <Stack spacing={2} alignItems='center'>
        <Typography variant='h4'>Interpretation of copy-number variants</Typography>
        <Stack alignItems='flex-start'>
          <Typography variant='subtitle1' component='div'>
            Method for automated prediction of pathogenicity of CNVs. The clinical impact of an CNV is predicted with two complementary tools and their
            combination:
          </Typography>
          <Typography variant='subtitle1' component='div'>
            <Box sx={{ fontWeight: 'bold', display: 'inline' }}>Machine learning prediction</Box> - impact of a CNV is predicted based on CNVs with known impact
            and their similarity to input CNV <br />
            <Box sx={{ fontWeight: 'bold', display: 'inline' }}>ACMG guidelines</Box> - impact of a CNV is predicted based on automatic evaluation of{' '}
            <Link variant='subtitle1' href='https://pubmed.ncbi.nlm.nih.gov/31690835' target='_blank' rel='noreferrer'>
              ACMG guidelines
            </Link>
            <br />
            <Box sx={{ fontWeight: 'bold', display: 'inline' }}>Combined prediction</Box> - combination of the two previous approaches
          </Typography>
          <Typography variant='subtitle1'>
            Further information can be found in (we also encourage you to cite it if you find this tool helpful):
            <br />
            <Link variant='subtitle1' href='https://www.nature.com/articles/s41598-021-04505-z' target='_blank' rel='noreferrer'>
              Gažiová, M., Sládeček, T., Pös, O. et al. Automated prediction of the clinical impact of structural copy number variations. Sci Rep 12, 555
              (2022).
            </Link>
            <br />
            Free for non-commercial use.
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default IntroCard
