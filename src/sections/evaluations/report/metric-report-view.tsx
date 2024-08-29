import React, { Fragment, useRef, useState, RefObject, ForwardedRef } from "react"
import Stack from "@mui/material/Stack"
import Iconify from "src/components/iconify"
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from '@mui/material/Tabs';
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from '@mui/material/Divider';
import ReportStatItem from 'src/components/eval_results/ReportStateItem';
import { useTheme } from "@mui/material/styles";
import ArcBar from "./arc-bar";
import { MetricReport, MetricReportInstance } from "src/types/evaluation";
import ReportOverviewChart from "src/components/eval_results/ReportOverviewChart";
import Label from "src/components/label";
import Level1MetricPieChart from "src/components/eval_results/Level1MetricPieChart";
import { shadows } from "src/theme/shadows";
import Comment from "./Comment"
import { useImperativeHandle, forwardRef } from 'react';
import Popover from '@mui/material/Popover';
import CustomPopover, { usePopover, MenuPopoverArrowValue } from 'src/components/custom-popover';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import ScoreRadarChart from "./radar-subject-view";
import UnitMetricView from "./unit-metric-view";

const Accordion = styled((props: AccordionProps)=> (
    <MuiAccordion disableGutters elevation={0} {...props} />
  ))(({ theme }) => ({
    border: 'none',
    borderBottom: 0,
    '&:before': {
      display:'none',
    },
    borderRadius: '15px'
  }));


type MetricReportViewRefs = {
    ref1: HTMLDivElement | null;
    ref2: HTMLDivElement | null;
};


interface Props {
    name: string
    instance: MetricReportInstance
    totalResponses: number
    target: number
    exportMode: boolean
    startNum: number
}

export type MetricReportViewHandles = {
    loadAllData: () => void;
    // Other methods or properties
};

interface SeriesItem {
    label: string;
    value: number;
}

const colors=["#27097A","#39928F","#1C497D","#00B8D9"];
const bgColors=["rgba(39, 9, 122, 0.24)","rgba(57, 146, 143, 0.24)","rgba(28, 73, 125, 0.24)","rgba(0, 184, 217, 0.24)"]

function getSeries(data: MetricReportInstance): SeriesItem[] {
    const formStats = data.stats.form_stats;
    let series: SeriesItem[] = [];
    for (let i=0; i<formStats.length; i++){
        series.push({ 
            // label: `${data.metric_names ? data.metric_names[i] : `表格 ${i+1}`}: ${formStats[i][0] === null ? "无数据" : Math.round(formStats[i][0]!) + "/" + Math.round(formStats[i][1]!)}`, 
            label: `${data.metric_names ? data.metric_names[i] : `Form ${i+1} `}: ${formStats[i][0] === null ? "No Data" : `Score${Math.round(formStats[i][2] ?? 0.1)}`}`, 
            value: formStats[i][2] ?? -1
        });
    }
    return series;
}

function getColors(seriesLength: number) {
    const theme = useTheme();
    return ["#24315F", "#307A96", "#A5CA46", "#F2873E", "#CC536D", "#A7477B", "#4E3A73", "#1C497D", "#F5AB1B", "#7B417D", "#41A77A", "#E86959"].slice(0, seriesLength)
}

function ProgressItem({label, totalAmount, value, sectionIndex}:any) {
    const getColorByIndex = (sectionIndex:any) => {
      // Ensure the index is within the bounds of the colors array
      const colorIndex = sectionIndex % colors.length;
      return colors[colorIndex];
    };
    const getBgColorByIndex = (sectionIndex:any) => {
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
            {Math.round(value)}/
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
export interface MetricReportRef {
    closeAllPopOvers: () => void;
}

//<MetricReportView name="好课堂" instance={evaluation.class} target={metaData.classExpected} totalResponses={metaData.classTotal}/>
//<MetricReportView name="备课学科组建设" instance={evaluation.prep} target={metaData.prepExpected} totalResponses={metaData.prepTotal}/>
const MetricReportView = forwardRef<MetricReportRef, Props>(
    ({ instance, name, exportMode, startNum, ...others }, ref) => {
        const closeAllPopOvers = () => {
            totalScorePopover.onClose();
            formNumberPopover.onClose();
            responseNumberPopover.onClose();
        };

        useImperativeHandle(ref, () => ({
            closeAllPopOvers,
        }));
    const [selectedForm, setSelectedForm] = useState(0);
   
    const statsByForm = instance.stats.form_stats.map((v:any) => v[0]).filter((v:any) => v !== null) as number[]
    const statsByFormPercent = instance.stats.form_stats.map((v:any) => v[2]).filter((v:any) => v !== null) as number[]
    const theme = useTheme();
    const totalScorePopover = usePopover();
    const formNumberPopover = usePopover();
    const responseNumberPopover = usePopover();
    
    const renderFormSections = (formIndex:any) => {
        if (instance.stats.form_stats[formIndex][0] === null || instance.scores[formIndex]===null) {
            return <Typography variant="subtitle1" textAlign="center">{`${instance.metric_names[formIndex]} No Score`}</Typography>;
        }
        const form = instance.rubrics[formIndex]; //this contains the sections for certain general subject, i.e., student performance, teacher performance
        return (
            <>  
                {form?.map((section:any, sectionIndex:any) => {
                    const rubricStatsForForm = instance.stats.rubric_stats[formIndex];
                    const totalSectionScore = rubricStatsForForm ? rubricStatsForForm[sectionIndex] : 0;
                    const maxSectionScore = form[sectionIndex].maxPoints;

                    return (
                        
                        <Box key={sectionIndex} display="grid" sx={{ backgroundColor: "rgba(255, 255, 255, 0.60)", gridTemplateColumns: "0.5fr 1fr", gap: "15px" }}>
                            <Card sx={{p: 1}} style={{justifyContent: "center", alignItems:"center"}}>
                                <Typography key={sectionIndex} variant="h5" p={2}>{section.name}</Typography>
                                <Level1MetricPieChart
                                    chart={{
                                        series: [
                                            { 
                                                label: "指标总分",
                                                //percent: instance.stats.rubric_stats[selectedForm]?.[sectionIndex] ?? 0 // (totalSectionScore / maxSectionScore) * 100,
                                                percent: (totalSectionScore / maxSectionScore) * 100 ?? 0 
                                            },
                                        ],
                                    }}
                                    totalSectionScore={totalSectionScore}
                                    maxSectionScore={maxSectionScore} 
                                    sectionIndex={sectionIndex}
                                />
                            </Card>

                            <Card sx={{p: 1}} style={{justifyContent: "center", alignItems:"center"}}>
                                <Typography variant="h5" p={2}>Sub-criteria Score</Typography>
                                {
                                    section.criteria.map((subCriteria: any, subCriteriaIndex: any) => {//section means "Student Performance" etc
                                    
                                        const subCriteriaScore=instance.scores[formIndex]![sectionIndex][subCriteriaIndex]; //i.e., general subject1["Student Performance"]["Collaboration"]
                                        const maxSubCriteriaScore=section.criteria[subCriteriaIndex].maxPoints;

                                        return (
                                            <Stack spacing={4} sx={{ px: 3, py: 3 }} key={subCriteriaIndex}>
                                                <ProgressItem
                                                    label={instance.rubrics[formIndex][sectionIndex].criteria[subCriteriaIndex].description} totalAmount={maxSubCriteriaScore}
                                                    value={subCriteriaScore}
                                                    sectionIndex={sectionIndex}
                                                />
                                            </Stack>                 
                                        );
                                    })
                                }
                            </Card>

                        </Box>                
                    );
                })}
        
                <Comment instance={instance} selectedForm={selectedForm} exportMode={exportMode}/>

            </>
        
        );
    };

    const renderForms = () => {
        if (exportMode) {
            return instance.rubrics.map((_:any, index:any) => renderFormSections(index))
        } 
        return renderFormSections(selectedForm)
    };

    return <Box mx={{md: 3, sm: 1, xs: 0}} mb={4}>
        {/* Overall Stats     */}
        <Accordion sx={{ mt: 4, background: '#ffffff', border: 'none',}} defaultExpanded={true}>
            <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />} >
                <Typography variant="h6" mb={1}>{``+name + " Overall Stats"}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container mt={-1} spacing={2}>
                    <Grid md={4.5} sm={12} xs={12} item>
                        <Box
                            sx={{
                                background: 'linear-gradient(180deg, #141D33 0%, #1F315F 100%)', 
                                minHeight: '200px',
                                boxShadow: '0px 12px 24px -4px rgba(145, 158, 171, 0.12), 0px 0px 2px 0px rgba(145, 158, 171, 0.20)',
                                borderRadius: 2
                            }}
                            display="flex" flexDirection="column" justifyContent="center"
                        >
                            <ArcBar total={100} chart={{series: Math.round(instance.stats.overall ?? 0)}}
                                aria-owns={totalScorePopover.open ? 'arc-popover' : undefined}
                                aria-haspopup="true"
                                onMouseEnter={totalScorePopover.onOpen}
                                onMouseLeave={totalScorePopover.onClose}
                            />
                            <Popover
                                id="arc-popover"
                                open={Boolean(totalScorePopover.open)}
                                anchorEl={totalScorePopover.open}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                onClose={totalScorePopover.onClose}
                                disableRestoreFocus
                                sx={{ pointerEvents: 'none',}}
                            >
                                <Box sx={{ p: 2, maxWidth: 280 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                    {name+" Total Score %"}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {`由本调研中包含的所有${name}评分表格的平均得分算出。其中每个${name}评分表的得分由该表格的所有填写的平均分得出。每个${name}评分表格、每个评价人回答的权重相等。区间：0-100%。100%为满分。`}
                                    </Typography>
                                </Box>
                            </Popover>
                        </Box>

                    </Grid>

                    <Grid md={7.5} sm={12} xs={12} item>
                        <Box
                            sx={{
                            background: 'linear-gradient(180deg, #141D33 0%, #1F315F 100%), var(--background-paper, #FFF)', 
                            minHeight: '200px',
                            boxShadow: '0px 12px 24px -4px rgba(145, 158, 171, 0.12), 0px 0px 2px 0px rgba(145, 158, 171, 0.20)',
                            borderRadius: 2,
                            height: "100%",
                            }}
                        >
                            <Stack direction="row" height="100%" divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed', justifyContent: "center" }} />}>
                                <Box
                                    sx={{ 
                                        width: "50%",
                                        display: "flex",        
                                        alignItems: "center",    
                                        justifyContent: "center" 
                                    }}
                                >
                                    <Box 
                                        aria-owns={formNumberPopover.open ? 'form-popover' : undefined}
                                        aria-haspopup="true"
                                        onMouseEnter={formNumberPopover.onOpen}
                                        onMouseLeave={formNumberPopover.onClose}
                                        sx={{ 
                                            height: '50%', 
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                    <ReportStatItem title={`Forms #`} 
                                        value={instance.stats.form_stats.length} 
                                        icon="solar:bill-list-bold-duotone" 
                                        color={theme.palette.info.main}/>
                                    </Box>
                                </Box>
                                <Popover
                                    id="form-popover"
                                    open={Boolean(formNumberPopover.open)}
                                    anchorEl={formNumberPopover.open}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    onClose={formNumberPopover.onClose}
                                    disableRestoreFocus
                                    sx={{ pointerEvents: 'none',}}
                                >
                                    <Box sx={{ p: 2, maxWidth: 280 }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                        {`${name} Form #`}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {`该数字为本调研${name}部分包含的评分表格的数量。`}
                                        </Typography>
                                    </Box>
                                </Popover>
                                <Box
                                    sx={{ 
                                        width: "50%",
                                        display: "flex",        
                                        alignItems: "center",    
                                        justifyContent: "center" 
                                    }}
                                >
                                    <Box 
                                        aria-owns={responseNumberPopover.open ? 'score-record-popover' : undefined}
                                        aria-haspopup="true"
                                        onMouseEnter={responseNumberPopover.onOpen}
                                        onMouseLeave={responseNumberPopover.onClose}
                                        sx={{ 
                                            height: '50%', 
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                    <ReportStatItem title="Score Records" value={others.totalResponses} 
                                        total={others.target} size={100} 
                                        icon="solar:file-check-bold-duotone" 
                                        showTotal={true}
                                        color={theme.palette.success.main}/>
                                    </Box>
                                </Box>
                                <Popover
                                    id="score-record-popover"
                                    open={Boolean(responseNumberPopover.open)}
                                    anchorEl={responseNumberPopover.open}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    onClose={responseNumberPopover.onClose}
                                    disableRestoreFocus
                                    sx={{ pointerEvents: 'none',}}
                                >
                                    <Box sx={{ p: 2, maxWidth: 280 }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                        {`${name} Scoring`}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {`该数据为${name}部分所有表格的收到评价次数 / 预期的评价次数算出。`}
                                        </Typography>
                                    </Box>
                                </Popover>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>

            </AccordionDetails>
        </Accordion>

        {/* Stats By Subject */}
        <Accordion sx={{ mt: 4, background: '#ffffff', border: 'none',}}defaultExpanded={true}>
            <AccordionSummary
                expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />} // Triangle icon for expanding/collapsing
            >
                <Typography variant="h6" mb={1}>{``+name + " Stats By Subject"}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {
                instance.response_scores.length > 0 && others.totalResponses > 0 ? 
                    <>
                        <Stack spacing={3}>
                            <Stack spacing={1}>
                                <Typography variant="h6" mb={1}>{"Average Score By Subject"}</Typography>
                                <ScoreRadarChart scores={instance.response_scores} subjects={instance.subjects}/>
                            </Stack>
                            <Stack spacing={1}>
                                <Typography variant="h6" mb={1}>{"Performance By Subject"}</Typography>
                                <UnitMetricView metaRadarData={instance}></UnitMetricView>
                            </Stack>
                            <></>
                        </Stack>
                        
                    </>
                    :
                    <Typography variant="subtitle1" textAlign="center">No Data</Typography>
                }                  
            </AccordionDetails>
        </Accordion>

        {/* Stats By Form */}
        <Accordion sx={{ mt: 4, background: '#ffffff', border: 'none',}}defaultExpanded={true}>
            <AccordionSummary
                expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />} // Triangle icon for expanding/collapsing
            >
                <Typography variant="h6" mb={1}>{``+name + " Stats By Form"}</Typography>
            </AccordionSummary>
            <AccordionDetails>   
                {/* Summary */}
                <Grid xs={12} item>
                <div ref={ref as RefObject<HTMLDivElement>} {...others}>
                {
                    others.totalResponses === 0 ? 
                    <Typography variant="subtitle1" textAlign="center" margin={5}>{`${name} No Data`}</Typography>
                    :<ReportOverviewChart
                    instance={instance}
                    maxScore={statsByForm.length > 0 ? Math.round(Math.max(...statsByFormPercent)) : "No Data"}
                    minScore={statsByForm.length > 0 ? Math.round(Math.min(...statsByFormPercent)) : "No Data"}                     
                    title={name+" Total Score By Form"} // here "Form" means the general subject
                    chart={{
                        series: getSeries(instance), 
                        colors: getColors(instance.stats.form_stats.length),
                    }}
                    sx={{mt: 2, mb: 5}}
                />
                }             
                </div>
                </Grid>
                
                {/* Details */}
                {statsByForm.length > 0 && (<Tabs
                    sx={{
                        px: 2.5, boxShadow: shadows("light")[4],
                        backgroundColor: "#FFF", borderRadius: 1, marginBottom: "20px",
                    }}
                    indicatorColor="secondary"
                    value={selectedForm}
                >
                    {instance.rubrics.map((form: any, index: any) => { //for each general subject, render a Tab
                        if (instance.stats.form_stats[index] === null) {
                            return <Fragment />
                        }
                        const label = Array.isArray(instance.metric_names) && instance.metric_names.length > index 
                        ? instance.metric_names[index]
                        : `Form #${index + 1}`;
            
                        const isDataAvailable = instance.stats.form_stats[index][2] !== null;
                    
                        const tabIconColor = isDataAvailable ? "success" : "grey";

                        return <Tab 
                            key={index} 
                            onClick={() => setSelectedForm(index)}
                            iconPosition="end"
                            value={index}
                            label={label}
                            icon={
                                <Label 
                                    variant="filled" 
                                    style={{ backgroundColor: isDataAvailable ? 'green' : 'grey' }}> 
                                    {isDataAvailable 
                                        ? `Score: ${instance.stats.form_stats[index][2]}` 
                                        : "No Data"}
                                </Label>
                            }
                            />
                    })}
                </Tabs>
                )}

                <Card sx={{ p: 2, backgroundColor: "#fcfcfc", display: 'flex', flexDirection: "column", rowGap: "15px" }}>
                    {instance.rubrics.length === 0 ?
                        <Typography variant="subtitle1" textAlign="center">{`${name} No Data`}</Typography>:
                        renderForms()
                    }
                </Card>
            </AccordionDetails>
        </Accordion>
        </Box>
    

});

export default MetricReportView;