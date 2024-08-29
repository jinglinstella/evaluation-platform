'use client';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { getEvaluations } from '../data';
import Typography from '@mui/material/Typography';
import EvalSum from '../data/list_evaluations_summary.json'; //for simplicity, just use mock data
import TrendLineChart from '../trends';
import SchoolRankingCard from '../school-ranking';
import { ProcessedRankingData } from 'src/types/evaluation';
import { useSettingsContext } from 'src/components/settings';
import EvalCard from 'src/sections/overview/EvalCard';

// Object.entries is a method that returns an array of a given object's own enumerable string-keyed property [key, value] pairs. 
// This method is useful for converting an object into an array format that can be iterated over using array methods like forEach, map, etc
//a json object can also be viewed as series of key value pairs where key is the property and value is the value of that property

type MonthlyData={
    name: string,
    data: number[]
}

type YearlyData = {
    year: string;
    data: MonthlyData[];
  };

type SchoolData ={
    schoolName: string;
    avgScore: number | null;
}

// horizontal bar login logout is located at src/layouts/common

export default function OverviewAppView(){
    const settings = useSettingsContext();
    // const {data, isLoading} = getEvaluations();//async
    // if (isLoading || data === undefined || data===null) { 
    //     return <div>Loading...</div>
    // } 

    const history=EvalSum.data.history;
    const rankings=EvalSum.data.rankings;
    const evaluations=EvalSum.data.evaluations;
    const stats = EvalSum.data.stats;

    const processedHistory: {[year: string]: MonthlyData[]}={}; //{} means initialize it to be empty
    const levelMapping: string[] = ["Primary School", "Middle School", "High School", "University", "Vocational School"];

    Object.entries(history).forEach(([level, records])=>{
        records.forEach((record)=>{
            const year=record.year.toString();
            const monthIndex=record.month-1;

            // "||: provide a fallback value if the left-hand side is undefined, null, or otherwise falsy
            //map: for each element in levelMapping, turn it into an object like this: {name: "primary school", data: [0,0,...0]}
            // "2023":[ //levelMapping will turn into this array, give it to processedHistory[2023]
            //     {name: "Primary School", data:[0.795, 0, 0, 0,...0.7, 0...]} //level: 0
            //     {name: "Middle School", data:[0.795, 0, 0, 0,...0.7, 0...]} //level: 1
            //     ....
            // ]
            processedHistory[year] = processedHistory[year] || levelMapping.map(name => ({ name, data: Array(12).fill(0) }));
            if(processedHistory[year][parseInt(level)]){
                processedHistory[year][parseInt(level)].data[monthIndex]=record.score !==null? Math.round(record.score): 0;
            }
        })
    })

    const series: YearlyData[]=Object.entries(processedHistory).map(([year, data])=>({
        year: year,
        data: data
    }))

    const processedRankings: ProcessedRankingData[] = [];

    Object.entries(rankings).forEach(([year,levels])=>{
        Object.entries(levels).forEach(([level, schools])=>{
            schools.forEach((school)=>{
                processedRankings.push({
                    id: 0,
                    level: level,
                    schoolName: school.school_name,
                    scores: {[year]: school.avg_score}
                })
            })
        })
    })

    processedRankings.sort((a,b)=>{
        const score1=a.scores[Object.keys(a.scores)[0]];
        const score2=b.scores[Object.keys(b.scores)[0]];
        return score2 !==null ? score2-(score1?? 0): -1;
    }).map((item, index)=>({...item, id: index+1}));

    // console.log("processedRankings: ", processedRankings);

    return(
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            {/* must add this line to make the grid split work  */}
            <Grid container spacing={3}> 
                <Grid xs={12} md={12}>
                    <Typography variant="h4">Overview</Typography>
                </Grid>
                <Grid xs={12} md={7} lg={8}>
                    <TrendLineChart
                        title="Trend"
                        chart={{series: series}}
                        stats={stats}
                    />
                </Grid>
                <Grid xs={12} md={5} lg={4}>
                    <SchoolRankingCard isLoading={false} data={processedRankings}/>
                </Grid>
                {evaluations && evaluations.map((evaluation:any) => (
                    // <Grid xs={12} sm={6} md={3}>
                    <Grid key={evaluation.uuid}>
                    <Box sx={{ width: '348px' }}>
                    <EvalCard key={evaluation.uuid} {...evaluation}/>
                    </Box>
                    </Grid>
                ))} 
            </Grid>
        </Container>
    )
}
