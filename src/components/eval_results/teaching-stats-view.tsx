import { forwardRef } from 'react';
import { Box, Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export type StatsViewProps = {
    items: {
        value: number
        caption: string
        iconPath: string
        total?: number
    }[]
    attributes?: React.CSSProperties
};

const StatsView = forwardRef<HTMLSpanElement, StatsViewProps>(({ items, attributes, ...other }, ref) => (
  <Stack direction="row" justifyContent={"stretch"} sx={{
    height: "100%",
    overflow: "visible",
    ...attributes
  }}>
    {items.map((item, i) => {
        return <Stack direction="row" alignItems={"center"} sx={{
          
            color: "white",
            justifyContent: "space-evenly",
            flexGrow: 1,
            height: "100%",
            overflow: "visible",
        }}> 

          <Stack>

            <Typography variant="h2" color="#F2F2F2">
            
              {item.value}
              {item.total && (
                <span style={{
                  color: 'rgba(255, 255, 255, 0.23)',
                  fontFamily: 'Futura',
                  fontSize: '24px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '48px'
                }}>
                  /{item.total}
                </span>
              )}

            </Typography>

            <Typography variant="subtitle1" color="#D9D9D9" sx={{opacity: 0.75 }}>{item.caption}</Typography>

          </Stack>
     
          {item.iconPath && <img src={item.iconPath} alt="Icon" />}

          
      </Stack>
    })}
  </Stack>
));

export default StatsView;
