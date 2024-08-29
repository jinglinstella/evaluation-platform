import { ApexOptions } from 'apexcharts';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import ButtonBase from '@mui/material/ButtonBase';
import Card, { CardProps } from '@mui/material/Card';

import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import StatsView from 'src/components/stats-view/stats-view';

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    categories?: string[];
    colors?: string[][];
    series: {
      year: string;
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    options?: ApexOptions;
  };
   stats: any;
}

export default function AppAreaInstalled({ title, subheader, chart, stats, ...other }: Props) {
  const theme = useTheme();

  const currentYear = new Date().getFullYear();

  const {
    colors = [
      // [theme.palette.primary.light, theme.palette.primary.main],
      // [theme.palette.warning.light, theme.palette.warning.main],
      ["#9FCB44","#9FCB44"],
      ["#4CA6E6","#4CA6E6"],
      ["#6B73DD","#6B73DD"],
      ["#F2873E","#F2873E"],
      ["#A7477B","#A7477B"],
    ],
    series,
    options,
  } = chart;

  const categories = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ]

  const popover = usePopover();

  const [seriesData, setSeriesData] = useState(`${currentYear}`);

  const chartOptions = useChart({
    colors: colors.map((colr) => colr[1]),
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: colors.map((colr) => [
          { offset: 0, color: colr[0], opacity: 1 },
          { offset: 100, color: colr[1], opacity: 1 },
        ]),
      },
    },
    xaxis: {
      categories,
    },
    legend: {position: "right"},
    ...options,
  });

  const handleChangeSeries = useCallback(
    (newValue: string) => {
      popover.onClose();
      setSeriesData(newValue);
    },
    [popover]
  );

  return (
    <Box position="relative" paddingTop="147px">
      <Box sx={{position: "absolute", top: 0, left: '10px', width: "calc(100% - 20px)", height: "150px"}}>
      <StatsView items={[
        { stat: "Total Schools", iconPath: "/assets/evaluations/school.svg", value: stats.total_schools },
        { stat: "In Progress", iconPath: "/assets/evaluations/pending.svg", value: stats["in_progress"] },
        { stat: "Completed", iconPath: "/assets/evaluations/completed.svg", value: stats.completed }
      ]} attributes={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}/>
      </Box>
      <Card {...other}>
        <CardHeader
          title={title}
          subheader={subheader}
          action={
            <ButtonBase
              onClick={popover.onOpen}
              sx={{
                pl: 1,
                py: 0.5,
                pr: 0.5,
                borderRadius: 1,
                typography: 'subtitle2',
                bgcolor: 'background.neutral',
              }}
            >
              {seriesData}

              <Iconify
                width={16}
                icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                sx={{ ml: 0.5 }}
              /> 
            </ButtonBase>
          }
        />

        {series.map((item) => (
          <Box key={item.year} sx={{ mt: 1, mx: 3 }}>
            {item.year === seriesData && (
              <Chart
                dir="ltr"
                type="line"
                series={item.data}
                options={chartOptions}
                width="100%"
                height={290}
              />
            )}
          </Box>
        ))}
      </Card>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {series.map((option) => (
          <MenuItem
            key={option.year}
            selected={option.year === seriesData}
            onClick={() => handleChangeSeries(option.year)}
          >
            {option.year}
          </MenuItem>
        ))}
      </CustomPopover>
    </Box>
  );
}
