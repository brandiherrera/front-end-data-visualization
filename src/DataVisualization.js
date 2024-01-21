import React, { useEffect, useState } from "react"
import {
  Box,
  Grid,
  Typography,
} from "@mui/material"
import useMediaQuery from '@mui/material/useMediaQuery'
import * as d3 from "d3"

import {lightGray, primary, secondary, theme} from './themeUtil'
import DimensionSelector from './DimensionSelector'

const DataVisualization = ({ data }) => {
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))
  const [dimensionBounds, setDimensionBounds] = useState({})
  const [dimensionRanges, setDimensionRanges] = useState({})
  const [selectedDimensions, setSelectedDimensions] = useState([])

  const dimensionOptions = data?.length > 0 ? Object.keys(data[0]) : []

  const getFilteredData = () => {
    return data.filter(item => {
      return selectedDimensions.every(dimension => {
        const range = dimensionRanges[dimension]
        const value = item[dimension]
        if (range) {
          const min = range.min !== "" ? range.min : -Infinity
          const max = range.max !== "" ? range.max : Infinity
          return value >= min && value <= max
        }
        return true
      })
    })
  }

  const showSingleDimension = () => {
    d3.select("#visualization").selectAll("*").remove()

    const margin = { top: 10, right: 30, bottom: 30, left: 40 }
    const width = 450 - margin.left - margin.right
    const height = 450

    const svg = d3
      .select("#visualization")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const filteredData = getFilteredData().map(d => d[selectedDimensions])

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData)])
      .range([0, width])

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))

    const histogram = d3
      .histogram()
      .value(d => d)
      .domain(x.domain())
      .thresholds(x.ticks(70))

    const bins = histogram(filteredData)

    const y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(bins, d => d.length)])

    svg.append("g").call(d3.axisLeft(y))

    svg
      .selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", d => `translate(${x(d.x0)},${y(d.length)})`)
      .attr("width", d => x(d.x1) - x(d.x0) - 1)
      .attr("height", d => height - y(d.length))
      .style("fill", primary)

    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + margin.top + 20)
      .text(selectedDimensions[0])

    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 14)
      .attr("x", -margin.top)
      .text("Frequency")
  }

  const showMultipleDimensions = () => {
    d3.select("#visualization").selectAll("*").remove()

    const filteredData = getFilteredData()

    const width = 800
    const height = 500
    const margin = { top: 30, right: 30, bottom: 30, left: 30 }

    const svg = d3
      .select("#visualization")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const x = d3
      .scalePoint()
      .range([0, width - margin.left - margin.right])
      .domain(selectedDimensions)

    const y = {}
    for (const dim of selectedDimensions) {
      y[dim] = d3
        .scaleLinear()
        .domain(d3.extent(data, d => +d[dim]))
        .range([height - margin.top - margin.bottom, 0])
    }

    svg
      .selectAll(".line")
      .data(filteredData)
      .enter()
      .append("path")
      .attr("d", d => d3.line()(selectedDimensions.map((p) => [x(p), y[p](d[p])])))
      .on("mouseover", function() {
        d3.select(this)
          .style("stroke", secondary)
          .style("stroke-width", "2px")
      })
      .on("mouseout", function() {
        d3.select(this)
          .style("stroke", primary)
          .style("stroke-width", "1px")
      })
      .style("fill", "none")
      .style("stroke", primary)
      .style("stroke-width", "1.5px")

    selectedDimensions.forEach(dim => {
      const axis = svg
        .append("g")
        .attr("transform", `translate(${x(dim)},0)`)
        .call(d3.axisLeft(y[dim]))

      axis
        .append("text")
        .attr("class", "axis-label")
        .attr("y", height - margin.bottom)
        .attr("x", 0)
        .attr("dy", "-0.5em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(dim)
    })
  }

  useEffect(() => {
    const bounds = {}
    const dimensionOptions = data?.length > 0 ? Object.keys(data[0]) : []

    dimensionOptions.forEach(dim => {
      const values = data.map(item => item[dim])
      bounds[dim] = {
        min: d3.min(values),
        max: d3.max(values)
      }
    })

    setDimensionBounds(bounds)
  }, [data])

  useEffect(() => {
    if (!selectedDimensions.length)
      d3.select("#visualization").selectAll("*").remove()
    else if (selectedDimensions.length === 1)
      return showSingleDimension()
    else
      return showMultipleDimensions()
  }, [data, dimensionRanges, selectedDimensions])

  return (
    <Box sx={{padding: "40px"}}>
      <Grid container spacing={2}>
        {
          isMdDown &&
          <DimensionSelector
            dimensionBounds={dimensionBounds}
            dimensionOptions={dimensionOptions}
            dimensionRanges={dimensionRanges}
            selectedDimensions={selectedDimensions}
            setDimensionRanges={setDimensionRanges}
            setSelectedDimensions={setSelectedDimensions}
          />
        }
        <Grid item xs={12} md={10}>
          <Box
            sx={{
              overflow: "scroll",
              height: 500,
              p: "12px",
              borderRadius: "12px",
              backgroundColor: lightGray,
            }}
          >
            {
              selectedDimensions.length === 0
              ? <Typography variant="h6">
                  Select dimensions to get started.
                </Typography>
              : <Box id="visualization" />
            }
          </Box>
        </Grid>
        {
          !isMdDown &&
          <DimensionSelector
            dimensionBounds={dimensionBounds}
            dimensionOptions={dimensionOptions}
            dimensionRanges={dimensionRanges}
            selectedDimensions={selectedDimensions}
            setDimensionRanges={setDimensionRanges}
            setSelectedDimensions={setSelectedDimensions}
          />
        }
      </Grid>
    </Box>
  )
}

export default DataVisualization
