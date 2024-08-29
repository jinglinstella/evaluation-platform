import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
import Iconify from 'src/components/iconify';
import { useCallback, useState } from 'react';
import { RankingItem, ProcessedRankingData } from 'src/types/evaluation';
import { Button, ButtonBase, Skeleton, useTheme } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { grey } from 'src/theme/palette';

interface Props extends CardProps {
  isLoading: boolean
  // data?: RankingItem[]
  data?: ProcessedRankingData[]
}

export default function SchoolRankingCard(props: Props) {

  const currentYear = new Date().getFullYear();

  const popoverLevel = usePopover();
  const popoverYear = usePopover();
  const [level, setLevel] = useState(0)
  const [academicYear, setAcademicYear] = useState(currentYear)
  const handleChangeLevel = useCallback(
    (newValue: number) => {
      popoverLevel.onClose();
      setLevel(newValue);
      console.log("level:",level);
    },
    [popoverLevel]
  );
  const handleChangeYear = useCallback(
    (newValue: number) => {
      popoverYear.onClose();
      setAcademicYear(newValue);
      console.log("academicYear",academicYear);
    },
    [popoverYear]
  );
  
  if (!props.data || props.data.length === 0) {
    return <Card sx={{height: '500px', position: 'relative'}}>
      <CardHeader title={"School Ranking"} />
      <Stack spacing={3} sx={{ px: 3, py: 2 }} position="absolute" top="50px" width="100%" bottom="0" overflow={"scroll"}>
        {Array(10).fill(0).map(_ => <Skeleton height={30} variant="rectangular" sx={{flexShrink: 0}}/>)}
      </Stack>
    </Card>
  }

  const filtered = props.data
                    .filter(item => item.scores[academicYear] !== undefined && parseInt(item.level) === level)
                    .sort((a, b) => b.scores[academicYear] - a.scores[academicYear])

  return (
      <Card sx={{height: '500px'}}>
        <CardHeader
          title="School Ranking"
          action={
            <Stack direction="row" spacing={0.5}>
              <ButtonBase
                onClick={popoverLevel.onOpen}
                sx={{py: 0.5, pr: 0.5, borderRadius: 1, width: '100px',
                  typography: 'subtitle2',
                  bgcolor: 'background.neutral',
                }}
              >
                {["Primary School", "Middle School", "High School"][level]}
                <Iconify
                  width={16}
                  icon={popoverLevel.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                  sx={{ml: 0.5}}
                />
              </ButtonBase>

              <ButtonBase
                onClick={popoverYear.onOpen}
                sx={{pl: 1, py: 0.5, pr: 0.5, borderRadius: 1, width: '75px',
                  typography: 'subtitle2',
                  bgcolor: 'background.neutral',
                }}
              >
                {academicYear}
                <Iconify
                  width={16}
                  icon={popoverYear.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase>
            </Stack>
          }
        />
                
        <Stack direction="row" sx={{px: 2, paddingTop: 2, paddingBottom: '2px'}} spacing={1} color={"#707070"}>
          <Typography variant="subtitle2" sx={{width: '50px', textAlign: 'center'}}>Ranking</Typography>
          <Typography variant="subtitle2" sx={{textAlign: 'center', flexGrow: 2}}>School</Typography>
          <Typography variant="subtitle2" sx={{width: '55px', textAlign: 'left'}}>Total Score</Typography>
        </Stack>
        <Stack spacing={0} sx={{ px: 2 }}>
          {filtered.length > 0 ?
            filtered.map((item, i) => <RankingRow key={i} item={item} rank={i + 1} year={academicYear}/>)
            : 
            <Typography variant="subtitle2" sx={{
              textAlign: "center",
              color: "gray",
              opacity: 0.5,
              lineHeight: "360px"
            }}>No data</Typography>
          }
        </Stack>

        {/* this controls the drop down menu */}
        <CustomPopover open={popoverLevel.open} onClose={popoverLevel.onClose} sx={{width: '150px'}}>
          {["Primary School", "Middle School", "High School"].map((option, i) => (
            <MenuItem
              key={option}
              selected={i === level}
              onClick={() => handleChangeLevel(i)}
            >
              {option}
            </MenuItem>
          ))}
        </CustomPopover>

        <CustomPopover open={popoverYear.open} onClose={popoverYear.onClose} sx={{width: '110px'}}>
          {[2021, 2022, 2023].map((option) => (
            <MenuItem
              key={option}
              selected={option === academicYear}
              onClick={() => handleChangeYear(option)}
            >
              {option}
            </MenuItem>
          ))}
        </CustomPopover>
      </Card>
  );
}

// ----------------------------------------------------------------------

type RankingRowProps = {
  // item: RankingItem
  item: ProcessedRankingData
  rank: number
  year: number
};

function RankingRow({ item, rank, year }: RankingRowProps) {
  const theme = useTheme()

  let color = "#dadada"
  if (rank === 1) {
    color = "rgb(159, 203, 68)"
  } else if (rank <= 3) {
    color = "rgb(54, 121, 222);"
  }
  return (
    <Button onClick={() => {}} sx={{ padding: '0px', borderRadius: '4px', '&:hover': {
      backgroundColor: 'inherit', // Set the hover background color to be the same as the default
      color: 'inherit', // Set the hover text color to be the same as the default
      boxShadow: 'none', // Remove the box shadow on hover
    }}}  >

      <Stack direction="row" alignItems="center" spacing={3} sx={{
        padding: '10px 10px',
        borderBottom: theme.palette.mode === "light" ? `1px solid ${grey[200]}` : `1px solid ${grey[700]}`,
        width: '100%'
      }}>
        <Avatar alt={`${rank}`} sx={ {
          bgcolor: color, color: "white",
          width: 29,
          height: 29,
          fontSize: 15
        }}>{`${rank}`}</Avatar>

        <Typography variant="subtitle2" sx={{flexGrow: 2, textAlign: 'left'}}>{item.schoolName}</Typography>
        <Typography variant="subtitle1" sx={{width: '45px', textAlign: 'left'}}>{item.scores[year]!=null ? item.scores[year].toFixed(1) : "暂无分数"}</Typography>

      </Stack>
    </Button>
  );
}


