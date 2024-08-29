import { ApexOptions } from 'apexcharts';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Card, { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';

import { fData } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

const GB = 1000000000 * 24;

interface Props extends CardProps {
  total: number;
  // data: {
  //   name: string;
  //   usedStorage: number;
  //   filesCount: number;
  //   icon: React.ReactNode;
  // }[];
  chart: {
    colors?: string[];
    series: number;
    options?: ApexOptions;
  };
}

const renderStorageOverview = (
  <FileStorageOverview
    total={GB}
    chart={{
      series: 76,
    }}
    // data={[
    //   {
    //     name: 'Images',
    //     usedStorage: GB / 2,
    //     filesCount: 223,
    //     icon: <Box component="img" src="/assets/icons/files/ic_img.svg" />,
    //   },
    //   {
    //     name: 'Media',
    //     usedStorage: GB / 5,
    //     filesCount: 223,
    //     icon: <Box component="img" src="/assets/icons/files/ic_video.svg" />,
    //   },
    //   {
    //     name: 'Documents',
    //     usedStorage: GB / 5,
    //     filesCount: 223,
    //     icon: <Box component="img" src="/assets/icons/files/ic_document.svg" />,
    //   },
    //   {
    //     name: 'Other',
    //     usedStorage: GB / 10,
    //     filesCount: 223,
    //     icon: <Box component="img" src="/assets/icons/files/ic_file.svg" />,
    //   },
    // ]}
  />
);


export default function FileStorageOverview({ total, chart, ...other }: Props) {
  const theme = useTheme();

  const { 
    colors = [
      "#006C9C",
      "#C2FF7C",
      

    ], 
    series, 
    options 
  } = chart;

  const chartOptions = useChart({
    chart: {
      offsetY: -16,
      sparkline: {
        enabled: true,
      },
    },
    grid: {
      padding: {
        top: 24,
        bottom: 24,
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: '56%',
        },
        dataLabels: {
          // name: { show: true },
          value: {
            offsetY: -40,
            // formatter: function (val) {
            //   const percent = (val/1);
            //   return percent.toFixed(0)
            // },

            color: "#FFF",

            formatter: function (val:any) {
              console.log(val); 
              return String(Math.round(val * 100)); 
            },

          },

          total: {
            label: "Average Score",
            color: theme.palette.text.disabled,
            fontSize: theme.typography.body2.fontSize as string,
            fontWeight: theme.typography.body2.fontWeight,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0], opacity: 1 },
          { offset: 100, color: colors[1], opacity: 1 },
        ],
      },
    },
    ...options,
  });

  return (
    <Card {...other}
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
        series={[series]}
        options={chartOptions}
        width="100%"
        height={360}
      />

    </Card>
  );
}
