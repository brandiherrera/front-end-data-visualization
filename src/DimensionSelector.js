import React from "react"
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Slider,
  Typography,
} from "@mui/material"

import {primary} from './themeUtil'

const DimensionSelector = ({
  dimensionBounds,
  dimensionOptions,
  dimensionRanges,
  selectedDimensions,
  setDimensionRanges,
  setSelectedDimensions,
}) => {
  const handleCheckboxChange = event => {
    const value = event.target.name
    setSelectedDimensions(prevDimensions =>
      event.target.checked
        ? [...prevDimensions, value]
        : prevDimensions.filter(dim => dim !== value)
    )

    if (!event.target.checked) {
      setDimensionRanges(prevRanges => {
        const newRanges = { ...prevRanges }
        delete newRanges[value]
        return newRanges
      })
    }
  }

  const handleSliderChange = (dimension, newValue) => {
    setDimensionRanges({
      ...dimensionRanges,
      [dimension]: { min: newValue[0], max: newValue[1] },
    })
  }

  return (
    <Grid item xs={12} md={2}>
      <Typography variant="subtitle2" fontWeight={600} color={primary}>
        Dimensions | Ranges
      </Typography>
      <Divider sx={{mt: "12px"}} />
      {dimensionOptions.map(dimension => (
        <Box sx={{p: "12px 0"}}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedDimensions.includes(dimension)}
                onChange={handleCheckboxChange}
                name={dimension}
              />
            }
            label={dimension}
          />
          <Slider
            disabled={!selectedDimensions.includes(dimension)}
            value={[
              dimensionRanges[dimension]?.min || dimensionBounds[dimension]?.min || 0,
              dimensionRanges[dimension]?.max || dimensionBounds[dimension]?.max || 100
            ]}
            color="primary"
            onChange={(event, newValue) => handleSliderChange(dimension, newValue)}
            valueLabelDisplay="auto"
            min={dimensionBounds[dimension]?.min || 0}
            max={dimensionBounds[dimension]?.max || 100}
          />
        </Box>
      ))}
    </Grid>
  )
}

export default DimensionSelector