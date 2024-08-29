import { useTheme } from "@mui/material/styles"
import Card, { CardProps } from '@mui/material/Card';
import { ApexOptions } from 'apexcharts';
import Chart, { useChart } from 'src/components/chart';

interface Props extends CardProps {
    total: number;
    chart: {
      colors?: string[];
      series: number;
      options?: ApexOptions;
    };
  }

export default function ArcBar({ total, chart, ...other }: Props) {
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
        offsetY: -1,
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
          offsetY: -50,
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
              label: "Total Score",
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
          height={300}
        />
  
      </Card>
    );
  }
  