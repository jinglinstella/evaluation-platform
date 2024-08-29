import { ApexOptions } from 'apexcharts';

//import CardHeader from '@mui/material/CardHeader';
//import Card, { CardProps } from '@mui/material/Card';
//import { styled, useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';


//import Chart from 'react-apexcharts'; // Import Chart from react-apexcharts
import { Card, CardHeader, ThemeProvider, createTheme } from '@mui/material';
import { styled } from '@mui/system';
import { CardProps } from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

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
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

const theme = createTheme({
  direction: 'rtl', // 'ltr' for left-to-right, 'rtl' for right-to-left
});

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

export default function EcommerceSaleByGender({ title, subheader, total, chart, ...other }: Props) {
  const theme = useTheme();

  const {
    colors = [
      [theme.palette.primary.light, theme.palette.primary.main],
      [theme.palette.warning.light, theme.palette.warning.main],
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
    },
    labels: series.map((i) => i.label),
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
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
        hollow: { size: '68%' },
        dataLabels: {
          value: { offsetY: 16 },
          total: {
            formatter: () => fNumber(total),
          },
        },
      },
    },
    ...options,
  });

  // To adjust the CSS styles of the Card component in your BookingCheckInWidgets component, 
  // you can use the sx prop provided by Material-UI to apply custom styles. 
  // You can remove the background color and shadow by setting appropriate values for the sx prop.

  return (
    <Card 
      {...other}

      sx={{
        backgroundColor: 'transparent', // Remove background color
        boxShadow: 'none', // Remove shadow
        // Add other custom styles as needed
      }}
    >
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />

      <StyledChart
        dir="ltr"
        type="radialBar"
        series={chartSeries}
        options={chartOptions}
        width="100%"
        height={300}
      />
    </Card>
  );

  // const StyledChart: StyledComponent<Props & MUIStyledCommonProps<Theme>, {}, {}>
}
