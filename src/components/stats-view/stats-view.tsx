import { forwardRef } from 'react';
import { Box, Link, Stack, Typography } from '@mui/material';
import Iconify from '../iconify';
import { RouterLink } from 'src/routes/components';
import { useTheme } from '@mui/system';

// ----------------------------------------------------------------------

export interface StatsItem {
  value: React.ReactNode
  link?: string // For buttons, interpret value as an image path
  stat: string
  iconPath?: string
}

export type StatsViewProps = {
    items: StatsItem[]
    cssTheme?: string
    textShadow?: string
    attributes?: React.CSSProperties
    valueFontSize?: string
};

const StatsView = forwardRef<HTMLSpanElement, StatsViewProps>(({ items, attributes, cssTheme, textShadow, ...props }, ref) => {
    const theme = useTheme()

    return <Stack direction="row" justifyContent={"stretch"} sx={{
        borderRadius: "15px",
        border: "1px solid #C1EEFD",
        height: "max(150px, 100%)",
        backgroundColor: "rgba(11, 34, 47, 0.95)",
        boxShadow: "0px 2px 12px 3px rgba(0, 0, 0, 0.2)",
        overflowX: "hidden",
        [theme.breakpoints.down("md")]: {
            overflowX: "scroll"
        },
        ...attributes
    }}>
        {items.map((item, i) => {
            let content = <Stack sx={{
                position: 'relative',
                padding: "16px",
                alignItems: "center",
                color: "white",
                minWidth: "fit-content",
                overflowY: "hidden",
                justifyContent: "space-evenly",
                flexGrow: 1,
                height: "100%",
                borderLeft: i === 0 ? "" : "1px solid rgba(208, 208, 208, 0.42)",
                background: item.iconPath && `url(${item.iconPath}) center center / 120px 120px no-repeat`
            }} key={i}>            
                {item.link ?
                    item.value
                    :
                    <Typography style={{
                        height: '75px',
                        lineHeight: "75px",
                        whiteSpace: "nowrap"
                    }} sx={{
                        fontWeight: 800,
                        textShadow: textShadow ?? "0px 4px 4px rgba(35, 150, 200, 0.2)",
                        background: cssTheme ?? "linear-gradient(180deg, #92F3CA 18.75%, rgba(42, 188, 251, 0.74) 85.94%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        lineHeight: "normal",
                        [theme.breakpoints.down("md")]: {
                            fontSize: "40px"
                        },
                        fontSize: props.valueFontSize ?? "65px"
                        
                    }}>{item.value}</Typography>
                }
                <Typography variant="subtitle1" sx={{opacity: 0.75, textAlign: 'center'}}>{item.stat}</Typography>
            </Stack>

            if (item.link) {
                content = <Link href={item.link} component={RouterLink} underline="none" color="inherit" sx={{
                    flexGrow: 1,
                    minWidth: "fit-content"
                }}>{content}</Link>
            }

            return content
        })}
    </Stack>
});

export default StatsView;
