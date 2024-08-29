'use client';

import { ApexOptions } from 'apexcharts';

import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import { styled, useTheme } from '@mui/material/styles';

import Chart, { useChart } from 'src/components/chart';
import { useState, useEffect } from 'react';
import { SUBJECTS } from 'src/types/evaluation';
import { Container } from '@mui/material';
// ----------------------------------------------------------------------

const CHART_HEIGHT = 400;

const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    // borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
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
export interface RadarDataProps {
    subjects: (number[] | null)[],
    scores: (number[] | null)[]
}
// ----------------------------------------------------------------------
const template_subject = [[1,3,2,5], [6,7,8]];
const template_score = [[0.96, 0.76, 0.80, 0.75],[0.85, 0.89, 0.76]];
// const template_subject = [[1,2], [2,1]];
// const template_score = [[0.88, 0.94], [0.62, 0.86]];
const color = "#4CA6E6";

export default function ScoreRadarChart({subjects, scores}: RadarDataProps){

    const [subject, setSubject] = useState(subjects);
    const [score, setScore] = useState(scores);

    const toRadarData = (su:number[][], sc:number[][]) => {
        var categories:string[] = [];
        var indices:number[] = [];
        su.forEach((form: number[])=>{
            form.forEach((s:number) => {
                if (categories.indexOf(SUBJECTS[s]) == -1){
                    categories.push(SUBJECTS[s]);
                    indices.push(s);
                }
            })
        })
        const scores = indices.map((item:number)=>{
            var sum:number = 0;
            var count:number = 0;
            su.forEach((form:number[], i:number)=>{
                form.forEach((s:number, j:number)=>{
                    if (s == item){
                        sum += sc[i][j];
                        count += 1;
                    }
                })
            })
            return Math.round(100 * sum / count);
        })
        // console.log({categories:categories, scores:scores})
        return {categories:categories, scores:scores};
    }

    const [radarData, setRadarData] = useState(toRadarData(subject, score));

    useEffect(()=>{
        setRadarData(toRadarData(subject, score))
    }, [subject, score]);

    return <RadarChart
    title={radarData.categories.length > 2?"各科平均成绩雷达图":"各科平均成绩"}
    chart={{
      categories: radarData.categories,
      series: [
        { name: '所有评分表平均', data: radarData.scores },
      ],
      colors: [color],
    }}
    />
}

function RadarChart({ title, subheader, chart, ...other }: Props) {
  const theme = useTheme();

  const { series, colors, categories, options } = chart;

  const barChartOptions = useChart({
    colors,
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.38,
    },
    dataLabels: {
        enabled: true,
        style: {
            fontSize: '16px',
        }
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: [...Array(6)].map(() => theme.palette.text.secondary),
        },
      },
    },
    plotOptions: {  
        bar: {
            distributed: true,   // Enabling column-wise colors
        }
    },
    ...options,
  });

  const radarChartOptions = useChart({
    colors,
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.38,
    },
    dataLabels: {
      enabled: true,
    },
    yaxis:{
      tickAmount: 5, 
      min: 0, 
      max: 100
    },
    tooltip: {
        enabled: true,
        enabledOnSeries: [0],
        shared: true,
        intersect: false,
        y: {
          formatter: function(val) {
            return `${val}`
          }
        }
      },
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: [...Array(6)].map(() => theme.palette.text.secondary),
        },
      },
    },
    plotOptions: {  
        radar:{
            polygons: {
                strokeColors: '#e8e8e8',
                connectorColors: '#e8e8e8',
                fill: {
                    colors: ['#f8f8f8', '#fff']
                }
            }
        }
    },
    ...options,
  });

  return (
    <Container>

      { categories.length > 2 ?  (<StyledChart
        dir="ltr"
        type="radar"
        series={series}
        options={radarChartOptions}
        width="100%"
        height={400}
      />) : 
      (<StyledChart
        dir="ltr"
        type="bar"
        series={series}
        options={barChartOptions}
        width="100%"
        height={400}
      />)}
      </Container>
  );
}
