import { ApexOptions } from "apexcharts";
import Card, { CardProps } from "@mui/material/Card";
import { styled } from "@mui/material/styles";

import Chart, { useChart } from "src/components/chart";
import { DataItem, subjectData } from "./unit-metric-view";
import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface RadarChartUnitProps {
  radarData: subjectData[];
  categories: DataItem[];
}

export default function RadarChartUnit(props: RadarChartUnitProps) {

  const [series, setSeries] = useState(() =>
    props.categories.map((i) => {
      const lengthData: number[] = [];
      i.secondTarget.forEach(() => lengthData.push(0));

      return props.radarData.map((item) => {
        return {
          name: item.subjectName,
          data: [...lengthData],
        };
      });
    }),
  );

  props.categories.map((firstTarget, firstTargetIndex) => {
    series[firstTargetIndex].forEach((x) => {
      props.radarData.map((s) => {
        if (x.name === s.subjectName) {
          s.firstTarget.map((a) => {
            if (a.firstTargetName === firstTarget.firstTargetName) {
              firstTarget.secondTarget.map((secondTarget, secondTargetIndex) => {
                a.secondTarget.map((b) => {
                  if (b.secondTargetName === secondTarget) {
                    x.data[secondTargetIndex] = b.value[0];
                  }
                });
              });
            }
          });
        }
      });
    });
  });


  return (
    <Stack spacing={1} direction="column">
      {
        props.categories.map((category, index) => {
          return <RadarChart
            key={index}
            title={category.firstTargetName}
            chart={{
              categories: category.secondTarget,
              series: series[index],
            }} />;
        })
      }
    </Stack>
  );
}

interface Props extends CardProps {
  title?: string;
  chart: {
    categories: string[];
    colors?: string[];
    series: {
      name: string;
      data: number[];
    }[];
    options?: ApexOptions;
  };
}

function RadarChart({ title, chart, ...other }: Props) {

  const { series, categories, options } = chart;
  const [selectedSeries, setSelectedSeries] = useState(series);

  // console.log("categories", categories);

  const chartOptions = useChart({
    stroke: {
      width: 2.0,
    },
    fill: {
      opacity: 0.35,
    },
    markers: {
      size: 3,
      hover: {
        size: 6,
      }
    },
    legend: {
      floating: true,
      position: "bottom",
      horizontalAlign: "center",
    },
    xaxis: {
      categories: categories,
    },
    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: (value: number) => `${value.toFixed(1)}`,
      },
    },
    
    yaxis: {
      tickAmount: 5,
      labels: {
        style: {
          colors: "#000000"
        },
        formatter: (value: number) => `${value.toFixed(1)}`,
      },
    },
    ...options,
  });

  const handleSeriesChange = (event: React.SyntheticEvent, value: any) => {
    const lengthData: number[] = [];
    categories.map(() => lengthData.push(0));
    if (value.length === 0) {
      setSelectedSeries([{
        name: "",
        data: lengthData,
      }]);
    } else {
      setSelectedSeries(value);
    }
  };


  return (
    <>
      <Card {...other}
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", m: 1, p: 1, minWidth: "30%" }}>

        <Box display="flex" justifyContent="space-between" width={"100%"} alignItems="center" px={5} pt={2}>

          <Typography variant="h5" noWrap width={"20%"}>{title}</Typography>

          <Autocomplete
            sx={{ m: 1 }}
            multiple
            limitTags={3}
            options={series}
            defaultValue={series}
            onChange={handleSeriesChange}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Please choose subject" />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.name}>
                {option.name}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.name}
                  label={option.name}
                  size="small"
                  variant="soft"
                />
              ))
            }
          />
        </Box>


        <StyledChart
          dir="ltr"
          type={categories.length > 2 ? "radar" : "bar"}
          series={selectedSeries}
          options={chartOptions}
          width={400}
          height={360}
        />
      </Card>
    </>
  );
}


const CHART_HEIGHT = 400;

const LEGEND_HEIGHT = 45;

const StyledChart = styled(Chart)(({}) => ({
  height: CHART_HEIGHT,
  "& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject": {
    height: `100% !important`,
  },
  "& .apexcharts-legend": {
    height: LEGEND_HEIGHT,
    // borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
    display: "block",
    textAlign: "center",
  },
}));