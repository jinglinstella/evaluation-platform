'use client';

import React, { CSSProperties }from 'react';
import Tooltip from '@mui/material/Tooltip';
import styles from "./EvalResults.module.css";
import Button from '@mui/material/Button';
import ProgressItem from './ecommerce-sales-overview';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import { useSettingsContext } from 'src/components/settings';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import FileStorageOverview from 'src/components/eval_results/file-storage-overview';
import ReportStatItem from 'src/components/eval_results/ReportStateItem';
import Divider from '@mui/material/Divider';
import ProgressPercentCircle from 'src/components/eval_results/progress-percent-circle';

import { useState, useEffect, useCallback } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import EvalStatsView from 'src/components/eval_results/eval-stats-view';
//import TeachingStatsView from 'src/components/eval-results/teaching-stats-view';
import CategoriesView from 'src/components/eval_results/banking-expenses-categories';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';

// import evalResultData from '../../app/data/evalResultData.json';
// import sourceData from '../../app/data/evalResultData2.json';

import Level1MetricPieChart from './Level1MetricPieChart';
import Label from '../label/label';
import SurveyHome from 'src/sections/evaluations/report/survey-dashboard';
import SurveyVisualization from 'src/sections/evaluations/report/survey-visualization';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ButtonBase, Skeleton, } from '@mui/material';
import ComponentBlock from 'src/components/from_stella/component-block';
import Slider from '@mui/material/Slider';

interface Rubric {
  description: string;
}

interface Data {

  rubrics: Rubric[][];
  scores: any;
  stats: any;
}

interface SeriesItem {
  label: string;
  value: number;
}

function getSeries(data: Data): SeriesItem[] {
  const rubrics = data.rubrics;
  const scores = data.scores;

  const formStats = data.stats.form_stats;

  let series: SeriesItem[] = [];

  for (let i=0; i<formStats.length; i++){
    series.push({ label: `form${i+1}`, value: formStats[i][0] !== null ? formStats[i][0] : 0.1 });
  }

  return series;
}

function getColors(seriesLength: number) {

  const theme = useTheme();

  return [
    theme.palette.primary.main,
    theme.palette.warning.dark,
    theme.palette.success.darker,
    theme.palette.error.main,
    theme.palette.info.dark,
    theme.palette.info.darker,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ].slice(0, seriesLength)
}

interface EvalScores {

  scores: number[][][];
}

function getMaxMinTotalScore(evalScores: EvalScores): { maxTotalScore: any, minTotalScore: any } {
  const scores = evalScores.scores;

  if (!scores || scores.some(group => group === null || group.some(subGroup => subGroup === null))) {
    return { maxTotalScore: "None", minTotalScore: "None" };
  }

  let totalScores = scores.map(scoreGroup => {
    return scoreGroup.reduce((groupTotal, scoreSubGroup) => {
      return groupTotal + scoreSubGroup.reduce((subGroupTotal, score) => subGroupTotal + score, 0);
    }, 0);
  });

  let maxTotalScore = Math.max(...totalScores);
  let minTotalScore = Math.min(...totalScores);

  return { maxTotalScore, minTotalScore };
}

function Overview ({data, maxScore, minScore, series, newColors} : any){

  const theme = useTheme();

    // check if 'scores' is an array containing only 'null'
    if (Array.isArray(data.scores) && data.scores.length === 1 && data.scores[0] === null) {
      return (        
        <Grid xs={12} md={12} spacing={2}>
          <Typography variant="h4" className={styles.title2}>No Results Available</Typography>
        </Grid>
      );
    }

  return (
    <>
      
      <Grid xs={5}>
          <Box
            sx={{
              background: 'linear-gradient(180deg, #141D33 0%, #1F315F 100%)', 
              minHeight: '100px',
              boxShadow: '0px 12px 24px -4px rgba(145, 158, 171, 0.12), 0px 0px 2px 0px rgba(145, 158, 171, 0.20)',
              borderRadius: '15px',
          }}
          >

            <FileStorageOverview total={100} chart={{series: data.stats.overall}}
            />

          </Box>
          
        </Grid>

        <Grid xs={7}>

          <Box
            sx={{
              background: 'linear-gradient(180deg, #141D33 0%, #1F315F 100%), var(--background-paper, #FFF)', 
              minHeight: '100px',
              boxShadow: '0px 12px 24px -4px rgba(145, 158, 171, 0.12), 0px 0px 2px 0px rgba(145, 158, 171, 0.20)',
              borderRadius: '15px',
              height: "100%"
            }}
          >
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ height: "100%"}}
            >
              <ReportStatItem title="Forms" value={data.stats.form_stats.length} icon="solar:bill-list-bold-duotone" color={theme.palette.info.main}/>

              <ReportStatItem title="Responses" value={10} total={12} icon="solar:file-check-bold-duotone" color={theme.palette.success.main}/>

            </Stack>

          </Box>

        </Grid>

        <Grid xs={12}>

          <CategoriesView

            maxScore={maxScore}
            minScore={minScore}

            chart={{
              series: series, 
              colors: newColors,
            }}
          />

        </Grid>
    </>
  );

}



function EvalResults(id: any){

  const[sourceData, setSourceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSurvey, setIsLoadingSurvey] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [evaluationId, setEvaluationId] = useState(id.id);
  const [anchorEl, setAnchorEl] = useState(null);

  const [surveyScore, setSurveyScore] = useState(-1);
  const popoverLevel = usePopover();
  const [popoverOpen, setPopoverOpen] = useState(false); 

  const handleChangeLevel = useCallback(
    (newValue: number) => {
      popoverLevel.onClose();
      setSurveyScore(newValue);
      
    },
    [popoverLevel]
  );

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  useEffect(() => {
      const fetchData = async () => {
          if (!id) return;
          // const evaluationId = id.id; 
          setEvaluationId(id.id);
          console.log("Evaluation ID: ", evaluationId); 

          setIsLoading(true);
          setError(null);
          try {

              const response = await fetch(`http://api.linghangxiong.com/evaluation/${evaluationId}/metric_report`);
              //const response = await fetch('http://api.linghangxiong.com/evaluation/29009d0c-3b2c-4241-a459-03732da8476e/metric_report');
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              console.log("source data:", data);

              setSourceData(data);
          } catch (error) {

              console.error('Error fetching data:', error);
              setError(error);
          } finally {
              setIsLoading(false);
          }
      };

      fetchData();
  }, [id]);

   if (isLoading) {
      return <div>Loading...</div>; 
  }

//   useEffect(() => {
//     const fetchData = async () => {
//         if (!id) return;
//         // const evaluationId = id.id; 
//         setEvaluationId(id.id);
//         console.log("Evaluation ID: ", evaluationId); 

//         setIsLoading(true);
//         setError(null);
//         try {

//             const response = await fetch(`http://api.linghangxiong.com/evaluation/${evaluationId}`);
//             //const response = await fetch('http://api.linghangxiong.com/evaluation/29009d0c-3b2c-4241-a459-03732da8476e/metric_report');
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const data = await response.json();
//             // console.log(response);
//             console.log("survey score:", data.data.survey_score);

//             setSurveyScore(data.data.survey_score);
//         } catch (error) {

//             console.error('Error fetching data:', error);
//             setError(error);
//         } finally {
//             setIsLoadingSurvey(false);
//         }
//     };

//     fetchData();
// }, [id]);

  // if (isLoadingSurvey) {
  //     return <div>Loading...</div>; // Or any other loading indicator
  // }

  // if (error) {
  //     return <div>Error fetching data: {error.message}</div>;
  // }

  // if (!sourceData) {
  //     return <div>No data available</div>;
  // }

  const updateSurveyScore = async (newScore:any) => {

    setSurveyScore(newScore);
    setPopoverOpen(false);
  

    try {
      const response = await fetch(`http://api.linghangxiong.com/evaluation/${evaluationId}/survey_score/${newScore}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({ survey_score: surveyScore })

      });
      if (response.ok) {
       
        console.log("Survey score updated successfully.");
      } else {
        
        console.error("Failed to update survey score.");
      }
    } catch (error) {
      
      console.error("Error during fetch: ", error);
    }
  };

  const backgroundStyle = {
    background: "linear-gradient(146deg, rgba(76, 202, 241, 0.34) -3.25%, rgba(7, 24, 39, 0.00) 63.1%)"
  };


  const theme = useTheme();

  const settings = useSettingsContext();

  const seriesClass = getSeries(sourceData.data.class);
  const seriesPrep = getSeries(sourceData.data.prep);


  const newColors = getColors(seriesClass.length);

  const maxScoreClass=getMaxMinTotalScore(sourceData.data.class).maxTotalScore;
  const minScoreClass=getMaxMinTotalScore(sourceData.data.class).minTotalScore;

  const maxScorePrep=getMaxMinTotalScore(sourceData.data.prep).maxTotalScore;
  const minScorePrep=getMaxMinTotalScore(sourceData.data.prep).minTotalScore;



  return (

    <div style={backgroundStyle}>

    <Container maxWidth={settings.themeStretch ? false : 'xl'}>

      <Grid container spacing={3}>

        <Grid xs={12} md={12}>
          <Typography variant="h2" className={styles.title0}
          
          >School Report</Typography>
        </Grid>

        <Grid xs={12} md={12}>
          <Typography variant="h3" className={styles.title1}>Overall Summary</Typography>
        </Grid>


        <Grid xs={12}>

          <Stack direction="row" justifyContent={"space-evenly"} alignItems={"center"}
            sx={{background: 'linear-gradient(92deg, #141D33 15.1%, #1F315F 102.34%)', minHeight: '100px', borderRadius: '15px'}}          
          >

            <Box sx={{ width: '30%', }}><OverallScore score={87}/></Box>
              
            
            <Box sx={{width: '70%'}}>
              {/* <EvalStatsView items={[
                { caption: "Teaching", value: 70, total:100 },
                { caption: "Course Preparation", value: 87, total:100 },
                { caption: "Surveys", value: surveyScore, total:100 }
              ]} attributes={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}/> */}
                <Stack direction="row" justifyContent={"space-evenly"} marginTop={"16px"} marginBottom={"16px"} sx={{
                  height: "100%",
                  backgroundColor:"transparent",
                  overflow: "visible",
                }}>

                  <Stack sx={{alignItems: "center", color: "#FFF", 
                    justifyContent: "space-evenly",
                    borderLeft: "1px solid rgba(208, 208, 208, 0.42)" ,
                  }}>        

                    <ProgressPercentCircle
                      chart={{
                        series: [
                          { 
                            label: "Teaching", 
                            percent: (70 / 100) * 100,
                            
                          },
                        ],
                      }}

                      i={0}
                    />
                    <Typography variant="subtitle1" sx={{opacity: 0.75}}>Teaching</Typography>
                  </Stack>

                  <Stack sx={{alignItems: "center", color: "#FFF", 
                    justifyContent: "space-evenly",
                  }}>        

                    <ProgressPercentCircle
                      chart={{
                        series: [
                          { 
                            label: "Course reparation", 
                            percent: (87 / 100) * 100,
                            
                          },
                        ],
                      }}
                      i={1}
                    />
                    <Typography variant="subtitle1" sx={{opacity: 0.75}}>Course Preparation</Typography>
                  </Stack>

                  <Stack sx={{alignItems: "center", color: "#FFF", 
                    justifyContent: "space-evenly",
                  }}>    

                    {
                      surveyScore !== -1 ? (                      
                      <>                      
                      <ProgressPercentCircle
                        chart={{
                          series: [
                            { 
                              label: "Surveys", 
                              percent: (surveyScore / 100) * 100,
                              
                            },
                          ],
                          }}

                          i={2}
                      />
                      <ButtonBase>
                        <Typography variant="subtitle1" 
                        onClick={handleClick}
                        sx={{opacity: 0.75}}>Surveys</Typography>
                      </ButtonBase>

                      </>
                      ) : (

                        <>

                          <ButtonBase>
                            <Typography variant="subtitle1" 
                            sx={{opacity: 0.75}}
                            onClick={handleClick}
                            >点击添加评分</Typography>
                          </ButtonBase>

                        </>
                      )
                    }  


                  </Stack>

                  <Popover 
                  // open={popoverOpen} 
                  // onClose={() => setPopoverOpen(false)}
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  > 
                  {/* <CustomPopover open={popoverLevel.open} 
                    onClose={popoverLevel.onClose} 
                    sx={{width: '110px'}}> */}
                                                
                      <ComponentBlock title="Survey Score">
                        <Slider
                          defaultValue={30}
                          // getAriaValueText={valuetext} 
                          valueLabelDisplay="auto"
                          step={10}
                          marks
                          min={10}
                          max={100}
                          onChangeCommitted={(event, newValue) => {
                            updateSurveyScore(newValue);
                            handleClose();
                          }}
                        />
                      </ComponentBlock>
                    {/* </CustomPopover> */}
                   </Popover>

                </Stack>

            </Box>
            

          </Stack>

        </Grid>


        <Grid xs={12} md={12} spacing={2}>
          <Typography variant="h3" className={styles.title1}>Course</Typography>
        </Grid>

        <Grid xs={12} md={12} spacing={2}>
          <Typography variant="h4" className={styles.title2}>Overview Data</Typography>
        </Grid>

        <Overview data={sourceData.data.class} maxScore={maxScoreClass} minScore={minScoreClass} series={seriesClass} newColors={newColors}/>

        <Grid xs={12} md={12} spacing={2}>
          <Typography variant="h4" className={styles.title2}>Form Specific Data</Typography>
        </Grid>

        <Grid xs={12}>

          <EvalForm data={sourceData.data.class}/>

        </Grid>

        <Grid xs={12} md={12} spacing={2}>
          <Typography variant="h3" className={styles.title1}>Prep</Typography>
        </Grid>

        <Grid xs={12} md={12} spacing={2}>
          <Typography variant="h4" className={styles.title2}>Overview Data</Typography>
        </Grid>

        <Overview data={sourceData.data.prep} maxScore={maxScorePrep} minScore={minScorePrep} series={seriesPrep} newColors={newColors}/>

        <Grid xs={12}>

          <EvalForm data={sourceData.data.prep}/>

        </Grid>

        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid 
        xs={12} 
        // md={4}
        >

          {/* <SurveyHome evaluation_id={evaluationId} survey_index={"0"}/> */}
          <SurveyVisualization evaluation_id={evaluationId} />
          
        </Grid>
        </Container>






        
      </Grid>


    </Container>

    </div>

  );
}



function EvalForm({data}:any){

  // const data = sourceData.data.class/prep;

  console.log(data);

  if (Array.isArray(data.scores) && data.scores.length === 1 && data.scores[0] === null) {
    return (        
      <div></div>

    );
  }


  const [selectedForm, setSelectedForm] = useState(0); 

  const handleFormTabClick=({index}:any)=>{
    setSelectedForm(index);
    console.log("selected index:"+index);
  }

  const calculateTotalScore = (scores: number[][]) => {
    return scores.flat().reduce((acc, score) => acc + score, 0);
  };

  return(
    <>
      <Tabs
        sx={{
          px: 2.5,
          //boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.25)",
          backgroundColor: "#FFF", borderRadius:"8px", marginBottom: "20px",
        }}
      >
          {data.rubrics.map((form:any, index:any)=>(
          <Tab 
            key={index} 
            onClick={()=> handleFormTabClick({index})}
            iconPosition="end"
            value={index}
            label={`Form #${index+1}`}
            icon={
              <Label
              variant={
                  'filled'
                }
                color={
                  'success'
                }
              >
                {/* {calculateTotalScore(data.class.scores[index])} */}
                {data.stats.form_stats[index][0]}
              </Label>
            }
          />
        ))}

      </Tabs>

      <Grid xs={12} sx={{backgroundColor: "rgba(255, 255, 255, 0.60)", boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.25)", borderRadius: "10px", padding: "20px"}}>



        { data.scores[selectedForm] === null ? (
            <Typography>暂无数据</Typography> // Display a message when there is no data
          ) : (        
                data.rubrics[selectedForm]?.map((section: any, sectionIndex: any) => {
                  // const totalSectionScore = sum(data.class.scores[selectedForm][sectionIndex]);
                  const totalSectionScore = data.stats.form_stats[selectedForm][0];
                  // const maxSectionScore= data.class.rubrics[selectedForm][sectionIndex].maxPoints;
                  const maxSectionScore = data.stats.form_stats[selectedForm][1];
                  // const description=data.rubrics[selectedForm][sectionIndex].description;

                  return (
                              
                    <Box
                      key={sectionIndex} 
                      sx={{backgroundColor: "rgba(255, 255, 255, 0.60)"}}
                      style={{display:"grid", gridTemplateColumns: "0.5fr 1fr", gap:"30px", marginBottom: '16px', border:"none"}}
                    >

                      <Box className={styles.whiteBg}>

                        <Typography variant="h4" style={{padding: "24px"}}>{section.description}</Typography>
                        
                        <Level1MetricPieChart
                          chart={{
                            series: [
                              { 
                                label: `${totalSectionScore}/${maxSectionScore}`, 
                                percent: (totalSectionScore / maxSectionScore) * 100,
                                
                              },
                              
                            ],
                          }}

                          totalSectionScore={totalSectionScore}
                          maxSectionScore={maxSectionScore} 
                          sectionIndex={sectionIndex}

                        />

                      </Box>

                      <Box 
                        className={styles.whiteBg}
                        style={{justifyContent: "center", alignItems:"center"}}
                      >
                        <Typography variant="h4" style={{padding: "24px"}}>Details</Typography>
                        {section.criteria.map((subCriteria: any, subCriteriaIndex: any) => {
                          
                          const subCriteriaScore=data.scores[selectedForm][sectionIndex][subCriteriaIndex];
                          //const subCriteriaScore=data.class.stats.rubric_stats[selectedForm][sectionIndex][subCriteriaIndex];
                          const maxSubCriteriaScore=section.criteria[subCriteriaIndex].maxPoints;

                          return (
                            
                            <Stack spacing={4} sx={{ px: 3, pt: 3, pb: 5 }}>
                              <ProgressItem label={`Score #${subCriteriaIndex + 1}`} totalAmount={maxSubCriteriaScore} value={subCriteriaScore} sectionIndex={sectionIndex} />
                              {/* <Tooltip title={subCriteria.description} placement="top">
                                <ProgressItem label={`Score #${subCriteriaIndex + 1}`} totalAmount={maxSubCriteriaScore} value={subCriteriaScore} sectionIndex={sectionIndex} />
                              </Tooltip> */}

                            </Stack>                 
                          );
                        })}
                      </Box>
                    </Box>           
                  );
                })
        
              )}

      </Grid>

      
    </>

    
  )

}



function OverallScore({score}:any){
  return (
    <Box sx={{display:'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      
      <Typography variant="h1" className={styles.score}>{score}</Typography>
      <Typography variant="h4" className={styles.p0}>General Score</Typography>
    </Box>
  )
}



export default EvalResults;