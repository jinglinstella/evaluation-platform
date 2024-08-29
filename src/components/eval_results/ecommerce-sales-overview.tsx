import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
// import { makeStyles } from '@mui/material/styles';

// import { makeStyles, createStyles } from '@mui/material/styles';

import { styled } from '@mui/material/styles';



import { fPercent, fCurrency } from 'src/utils/format-number';
import { AnyARecord } from 'dns';

// ----------------------------------------------------------------------

const colors=["#27097A","#39928F","#1C497D","#00B8D9"];
const bgColors=["rgba(39, 9, 122, 0.24)","rgba(57, 146, 143, 0.24)","rgba(28, 73, 125, 0.24)","rgba(0, 184, 217, 0.24)"]



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

function EcommerceSalesOverview({ title, subheader, data, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={4} sx={{ px: 3, pt: 3, pb: 5 }}>
        {data.map((progress) => (
          <ProgressItem key={progress.label} progress={progress} />
        ))}
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ProgressItemProps = {
  // progress: ItemProps;
  progress: any;
};




export default function ProgressItem({label, totalAmount, value, sectionIndex}:any) {


  // const index=sectionIndex % 4;

  const getColorByIndex = (sectionIndex:any) => {
    // Ensure the index is within the bounds of the colors array
    const colorIndex = sectionIndex % colors.length;
    return colors[colorIndex];
  };

  const getBgColorByIndex = (sectionIndex:any) => {
    // Ensure the index is within the bounds of the colors array
    const colorIndex = sectionIndex % colors.length;
    return bgColors[colorIndex];
  };




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
          backgroundColor: getBgColorByIndex(sectionIndex), // Background color
          '& .MuiLinearProgress-bar': {
            backgroundColor: getColorByIndex(sectionIndex), // Color of the progress bar
          },
        }}

      />
    </Stack>
  );
}
