import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
import React, { CSSProperties }from 'react';

const colors=["#27097A","#39928F","#1C497D","#00B8D9"];
const bgColors=["rgba(39, 9, 122, 0.24)","rgba(57, 146, 143, 0.24)","rgba(28, 73, 125, 0.24)","rgba(0, 184, 217, 0.24)"]

interface ProgressBarProps {
  percentage: number;
}

export default function ProgressBar ({ percentage }: any){
  const progressBarContainerStyle: CSSProperties = {
      position: 'relative',
      width: '100%',
      height: '14.239px',
    };
  
    const progressBarBackgroundStyle: CSSProperties = {
      width: '100%',
      background: '#D9D9D9',
      borderRadius: '10px',
      height: '100%',
      top:'0',
      left:'0',
      position: 'absolute'
    };

    const innerProgressBarStyle: CSSProperties = {
      position: 'absolute',
      width: `${percentage}%`,
      background: 'linear-gradient(90deg, #AEE470 0%, #7BC9E3 96.34%)',
      borderRadius: '10px',
      height: '100%',
    };
  
  return (
      <div style={progressBarContainerStyle}>
      <div style={progressBarBackgroundStyle}></div>
      <div style={innerProgressBarStyle}></div>
    </div>
  );
};





type ItemProps = {
  label: string;
  value: number;
  totalAmount: number;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  data: ItemProps[];
}


// ----------------------------------------------------------------------

type ProgressItemProps = {
  // progress: ItemProps;
  progress: any;
};




function ProgressItem({label, totalAmount, value}:any) {


  // const index=sectionIndex % 4;

  // const getColorByIndex = (sectionIndex:any) => {
  //   // Ensure the index is within the bounds of the colors array
  //   const colorIndex = sectionIndex % colors.length;
  //   return colors[colorIndex];
  // };

  // const getBgColorByIndex = (sectionIndex:any) => {
  //   // Ensure the index is within the bounds of the colors array
  //   const colorIndex = sectionIndex % colors.length;
  //   return bgColors[colorIndex];
  // };




  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {label}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {value}/
        </Typography>

        <Typography variant="subtitle2">{totalAmount}</Typography>



      </Stack>

      <LinearProgress
        variant="determinate"
        value={(value/totalAmount) * 100}
        //style={{ backgroundColor: getColorByIndex(sectionIndex) }}


        color={
          (label === 'Total Income' && 'info') ||
          (label === 'Total Expenses' && 'warning') ||
          'primary'
        }

        sx={{
          backgroundColor: "#D9D9D9", // Background color
          '& .MuiLinearProgress-bar': {
            background: "linear-gradient(90deg, #AEE470 0%, #7BC9E3 96.34%)", // Color of the progress bar
          },
        }}

      />
    </Stack>
  );
}
