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
  totalSectionScore: any;
  maxSectionScore: any;
  sectionIndex:any;
}

export default function BookingCheckInWidgets({ chart, totalSectionScore, maxSectionScore, sectionIndex,...other }: Props) {
  const theme = useTheme();

  const smUp = useResponsive('up', 'sm');

  const index=sectionIndex % 4;

  // const total=100;

  const {
    colors = [
      // [theme.palette.primary.light, theme.palette.primary.main],
      // [theme.palette.warning.light, theme.palette.warning.main],
      ["#27097A","#27097A"],
      ["#39928F","#39928F"],
      ["#1C497D","#1C497D"],
      ["#00B8D9","#00B8D9"],
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
          // name: { show: false },
          name: { offsetY: 10}, //name controls the label
          value: { //value is the percentage you passed in to control the circle
            offsetY: 15,

            fontSize: theme.typography.subtitle2.fontSize as string,
            show: false, // Hide the percentage value

            color: theme.palette.primary.main, 

          },
          total: {
            label: `${totalSectionScore}/${maxSectionScore}`,

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
              width="100%"
              height="100%"
      />

    
    
    </Card>
  );
}
