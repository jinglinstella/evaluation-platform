import { forwardRef } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import ProgressItem from 'src/components/eval_results/ecommerce-sales-overview';
import ProgressPercentCircle from 'src/components/eval_results/progress-percent-circle';
import SilderView from 'src/components/eval_results/slider-view';

// ----------------------------------------------------------------------

export type StatsViewProps = {
    items: {
        value: number
        caption: string
        //iconPath: string
        total: number
    }[]
    attributes?: React.CSSProperties
};

const StatsView = forwardRef<HTMLSpanElement, StatsViewProps>(({ items, attributes, ...other }, ref) => (
  <Stack direction="row" justifyContent={"space-evenly"} marginTop={"16px"} marginBottom={"16px"} sx={{

    height: "100%",

    backgroundColor:"transparent",
    overflow: "visible",
    ...attributes
  }}>

    {items.map((item, i) => {
        return <Stack sx={{
            alignItems: "center",
            color: "#FFF",
            justifyContent: "space-evenly",
            borderLeft: i === 0 ? "1px solid rgba(208, 208, 208, 0.42)" : " ",
        }}>            
            <ProgressPercentCircle
                  chart={{
                    series: [
                      { 
                        label: `${item.caption}`, 
                        percent: (item.value / item.total) * 100,
                        
                      },
                    ],
                  }}

                  i={0}

                  // totalSectionScore={item.value} 
                  // maxSectionScore={item.total} 
                  // sectionIndex={i}

            />

            <Typography variant="subtitle1" sx={{opacity: 0.75}}>{item.caption}</Typography>
      </Stack>
    })}
  </Stack>
));

export default StatsView;
