import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { fCurrency, fShortenNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import { Fragment } from 'react';

// ----------------------------------------------------------------------

type Props = {
  icon: string;
  title: string;
  total?: number;
  percent?: number;
  value: number;
  color?: string;
  size?: number;
  onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave?: () => void;
  showTotal?: boolean;
};

export default function ReportStatItem({ title, total, icon, color, percent, value, size}: Props) {
  return (
    <Stack
      spacing={0}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ width: 1, minWidth: 180 }}
    >

      <Stack spacing={0.5} marginRight='20px'>

        <Typography variant="h2" color="#F2F2F2">
              {value}
              {total !== undefined ? (
                <span style={{
                  color: 'rgba(255, 255, 255, 0.23)',
                  fontFamily: 'Futura',
                  fontSize: '24px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '48px'
                }}>
                  /{total}
                </span>
              ) : <Fragment />}

        </Typography>


        <Typography variant="subtitle1" 
          sx={{
            color: '#D9D9D9',
            fontFamily:'Helvetica',
            fontSize: '20px',
            fontStyle:'normal',
            fontWeight: '700',
            lineHeight: '118%'

          }}
        >{title}</Typography>

      </Stack>

      <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative', minWidth: size ?? 80 }}>
        <Iconify icon={icon} width={64} sx={{ color, position: 'absolute' }} />

        {total && <CircularProgress
          variant="determinate"
          value={value/total*100}
          size={size ?? 112}
          thickness={2}
          sx={{ color, opacity: 0.48 }}
        />}

        {total && <CircularProgress
          variant="determinate"
          value={100}
          size={size ?? 112}
          thickness={3}
          sx={{
            top: 0,
            left: 0,
            opacity: 0.48,
            position: 'absolute',
            color: (theme) => alpha(theme.palette.grey[500], 0.16),
          }}
        />}
      </Stack>


    </Stack>
  );
}
