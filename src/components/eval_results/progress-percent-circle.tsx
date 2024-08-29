import { ApexOptions } from 'apexcharts';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';

import { useResponsive } from 'src/hooks/use-responsive';

import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  chart: {
    colors?: string[][];
    series: {
      label: string;
      percent?: any;
      total?: number;
    }[];
    options?: ApexOptions;
  };
  // totalSectionScore: any;
  // maxSectionScore: any;
  i: any;
  width?: string
  height?: string
}

export default function ProgressPercentageCircle({ chart, i, ...other }: Props) {
  const theme = useTheme();

  const smUp = useResponsive('up', 'sm');

  const index=i;

  // const index = sectionIndex % 3;


  const {
    colors = [
      // [theme.palette.primary.light, theme.palette.primary.main],
      // [theme.palette.warning.light, theme.palette.warning.main],

      // <linearGradient id="paint0_linear_108_573" x1="77.8812" y1="15.8647" x2="18.8384" y2="79.6059" gradientUnits="userSpaceOnUse">
      //   <stop stop-color="#A7D9F4"/>
      //   <stop offset="1" stop-color="#64C1DE"/>
      // </linearGradient>

      ["#A7D9F4","#64C1DE"],
      ["#2FC1FF","#638EEF"],
      ["#6B73DD","#6040BB"],
      // ["#00B8D9","#00B8D9"],
    ],
    series,
    options,
  } = chart;

  const chartOptionsCheckIn = useChart({
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[index][0], opacity: 1 },
          { offset: 100, color: colors[index][1], opacity: 1 },
        ],
      },
    },
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    grid: {
      padding: {
        top: -9,
        bottom: -9,
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '64%' },
        track: { margin: 0 },
        dataLabels: {
          name: { show: false },
          value: { //value is the percentage you passed in to control the circle
            offsetY: 8,
            fontSize: theme.typography.subtitle1.fontSize as string,
            // show: false, 
            color: "#FFF", 
            formatter: (val) => {
              return Math.round(val); // Round the value to an integer
            }
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card 
      {...other}
      sx={{
        backgroundColor: 'transparent', // Remove background color
        boxShadow: 'none', // Remove shadow
        // Add other custom styles as needed
        display: 'flex', // Use flexbox
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
      }}
    >

      <Chart
              dir="ltr"
              type="radialBar"
              series={[series[0].percent]} //this number goes to plotOptions.radialBar.dataLabels.value
              options={chartOptionsCheckIn}
              width={other.width ?? "100%"}
              height={other.height ?? "100%"}
      />

    
    
    </Card>
  );
}
