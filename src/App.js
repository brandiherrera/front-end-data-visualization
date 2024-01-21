import React, { useState, useEffect } from "react"
import { Box, Typography } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'

import {primary, theme} from './themeUtil'
import DataVisualization from "./DataVisualization"

const App = () => {
  const [dataset, setDataset] = useState([])

  const loadData = () => {
    // Here, you would normally fetch data from an API
    // fetch('/api/data-endpoint')
    //     .then(response => response.json())
    //     .then(data => setData(data))
    const { data } = require('./data.json')
    setDataset(data)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Box
      className="App"
        sx={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <Box sx={{pl: "40px"}}>
          <Typography variant="h3" align="left">
            visualize your <span style={{color: primary}}>data</span>
          </Typography>
        </Box>
        <DataVisualization data={dataset} />
      </Box>
    </ThemeProvider>
  )
}

export default App
