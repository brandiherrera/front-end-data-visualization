import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  typography: {
    fontFamily: [
      'Inter',
      'sans-serif'
    ].join(','),
  },
  palette: {
    primary: {
      main: '#3E63DD',
    },
    secondary: {
      main: '#FF6666',
    },
  },
})

export const primary = theme.palette.primary.main
export const secondary = theme.palette.secondary.main

export const lightGray = "#F2F2F2"