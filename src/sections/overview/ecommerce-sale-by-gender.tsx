import { ApexOptions } from 'apexcharts';

import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import { styled, useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

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
    margin: 0,
    padding: 0, 
  },
}));

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  total: number;
  chart: {
    colors?: string[][];
    series: {
      label: string;
      value: number;
    }[];
    options?: ApexOptions;
  };
}

{/* <Grid xs={12} md={6} lg={4}>
<EcommerceSaleByGender
  title="Sale By Gender"
  total={2324}
  chart={{
    series: [
      { label: 'Mens', value: 44 },
      { label: 'Womens', value: 75 },
    ],
  }}
/>
</Grid> */}

export default function EcommerceSaleByGender({ title, subheader, total, chart, ...other }: Props) {
  const theme = useTheme();

  const {
    colors = [
      // [theme.palette.primary.light, theme.palette.primary.main],
      // [theme.palette.warning.light, theme.palette.warning.main],
      ["#7669DF","#7669DF"],
      ["#4CA6E6","#4CA6E6"],
      ["#93D2EE","#93D2EE"],

    ],
    series,
    options,
  } = chart;

  const chartSeries = series.map((i) => i.value);

  const chartOptions = useChart({
    colors: colors.map((colr) => colr[1]),
    chart: {
      sparkline: {
        enabled: true,
      },
      parentHeightOffset: 0, 
    },
    labels: series.map((i) => i.label),
    legend: {
      show: false,
    },
    // legend: {
    //   floating: true,
    //   position: 'bottom',
    //   horizontalAlign: 'center',
    // },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: colors.map((colr) => [
          { offset: 0, color: colr[0], opacity: 1 },
          { offset: 100, color: colr[1], opacity: 1 },
        ]),
      },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '50%' },
        dataLabels: {
          name:{show:false},
          value: { 
            offsetY: 10,
            color: '#4CA6E6', 
            fontSize: '24px', 
            fontFamily: 'Futura', 
          },
          total: { //"total" shows the addition of all values of the series array
            formatter: () => `${fNumber(total)}`,
            color: '#4CA6E6', 
            fontSize: '16px', 
            fontFamily: 'Futura', 
          },
        },
      },
    },
    ...options,
  });

  return (
    // <Card {...other}>
    //   <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />

      <StyledChart
        dir="ltr"
        type="radialBar"
        series={chartSeries}
        options={chartOptions}
        width="100%"
        height={130}
        style={{ margin: 0 }}
      />
    // </Card>
  );
}
