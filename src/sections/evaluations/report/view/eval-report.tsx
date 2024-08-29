'use client';
import React, { useRef, useState, useCallback, ReactElement } from "react"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import LoadingButton from "@mui/lab/LoadingButton";
import { RouterLink } from "src/routes/components"
import Iconify from "src/components/iconify"
import { grey } from "src/theme/palette";
import Dialog from "@mui/material/Dialog";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from '@mui/material/Container';
import { getReportData, requestReport } from "../data";
import { LoadingScreen } from "src/components/loading-screen";
import ProgressPercentCircle from 'src/components/eval_results/progress-percent-circle';
import { useBoolean } from "src/hooks/use-boolean";
import Slider from "@mui/material/Slider"
import { axiosInstance2 } from "src/utils/axios";
import { useTheme } from "@mui/material/styles";
import { useSettingsContext } from 'src/components/settings';
import MetricReportView, { MetricReportViewHandles } from "../metric-report-view";
import SurveyVisualizationTabs from "src/sections/evaluations/report/survey-visualization";
import Popover from '@mui/material/Popover';
import CustomPopover, { usePopover, MenuPopoverArrowValue } from 'src/components/custom-popover';
import { useSnackbar } from 'src/components/snackbar';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import { MetricReportRef } from "../metric-report-view";
import MockData from 'src/sections/evaluations/report/mock-data/metric_report_mock.json';
import {LinearProgress } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { bgBlur } from 'src/theme/css';
import { SurveyInstance } from "src/types/evaluation";

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


interface Props {
    eval_id: string
}

export default function EvalReport({ eval_id }: Props) {

    const [isSaving, setIsSaving] = useState(false);
    const [progress, setProgress] = React.useState(0);
    const classMetricReportRef = useRef<MetricReportRef>(null);
    const prepMetricReportRef = useRef<MetricReportRef>(null); 
    const otherMetricReportRef = useRef<MetricReportRef>(null);
    const surveyRef = useRef();
    const [exportMode, setExportMode] = useState(false);

    //const { reportData: evaluation, overallScore, isLoading, mutate: reloadData, metaData } = getReportData(eval_id);
    const evaluation = JSON.parse(JSON.stringify(MockData));
    const isLoading = useState(false);
    const overallScore = 90;

    const surveyDialogOpen = useBoolean(false)
    const isSavingSurveyValue = useBoolean(false)
    const temporarySurveyScore = useRef<number | null>(null)
    const theme = useTheme()
    const settings = useSettingsContext();
    const overallPopover = usePopover(); 
    const classOverallPopover = usePopover(); 
    const prepOverallPopover = usePopover();
    const otherOverallPopover = usePopover();
    const surveyOverallPopover = usePopover(); 
    const { enqueueSnackbar } = useSnackbar();

    // if (isLoading || evaluation === undefined) { 
    //     return <LoadingScreen /> 
    // } else if (evaluation === null) {
    //     return <>Not Found</>
    // }

    const saveHtmlFile = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("accessToken");

            const increaseProgress = setInterval(() => {
                setProgress((oldProgress) => {
                    const newProgress = oldProgress + 10;
                    if (newProgress > 90) {
                        clearInterval(increaseProgress);
                        return 90;
                    }
                    return newProgress;
                });
            }, 1000); 

            const response = await fetch('http://localhost:3101/evaluation/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    url:  `http://${window.location.host}/print-evaluation/${eval_id}?token=${encodeURIComponent(token ?? '')}`,
                    schoolName: evaluation.school_name,
                }),
            });

            clearInterval(increaseProgress); 
            setProgress(100);
               
            // const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const blob = await response.blob();
            // Download
            let tmp = document.createElement('a');
            tmp.href = URL.createObjectURL(blob)
            tmp.target = '_blank';
            tmp.download = `report-${evaluation.school_name}.pdf`;
            tmp.click();
            enqueueSnackbar("Report downloaded successfully", { variant: "success" });
        } catch (error) {
            console.error('Failed to download the file', error);
            enqueueSnackbar('Failed to download the file', { variant: 'error' });
        }
        setIsSaving(false);
    };

    return <>
    {/* If isSaving, show the progress bar */}
    {isSaving && <Box position="fixed" display="flex" justifyContent="center" alignItems="center" 
        sx={{borderTop: "1px solid #f1f1f1"}} 
        style={{left: 0, right: 0, bottom: 0, height: 80, zIndex: 100, ...bgBlur({ color: theme.palette.background.neutral, opacity: 0.6 })}}>  
        <Box sx={{ width: '20%', mr: 1}}>
            <LinearProgress 
                variant="determinate" value={progress} 
                sx={{ height: "10px", backgroundColor: 'white', '& .MuiLinearProgress-bar': {backgroundColor: "#0066A0", height: "100%",}, }}
            />
        </Box>    
    </Box>}
    <Container maxWidth={settings.themeStretch ? false : 'xl'} id="eval-report">
        {/* Header */}
        <Stack spacing={1.5} display="flex" direction="row" justifyContent="space-between" sx={{mb: -5, mx: 2,color: grey[700]}}>
            <Button
                component={RouterLink}
                // href={`/evaluations/${eval_id}/details`}
                href={`/overview`}
                startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            >
                Return To Overview
            </Button>

            <LoadingButton size="large" type="submit" loading={isSaving} disabled={isSaving} onClick={saveHtmlFile}
                sx={{ px: 3, mx:1, backgroundColor:"#1B294E", color:"white", "&:hover": {backgroundColor: "#1E2C51"} }}
                startIcon={<DownloadIcon />} 
            >
                Download PDF
            </LoadingButton>
        </Stack>

        <Typography variant="h3" textAlign="center" mb={4} mx={18}>{evaluation.school_name + " - Evaluation Report"}</Typography>
        {/* Overall */}
        <Box mx={{md: 3, sm: 2, xs: 0}}>
            <Typography variant="h4">{`Overall`}</Typography>
            <Stack
                direction="row" justifyContent="space-evenly" alignItems="stretch"
                my={2} py={3} mb={5} borderRadius={2}
                sx={{
                    background: 'linear-gradient(92deg, #141D33 15.1%, #1F315F 102.34%)',
                    minHeight: '180px'
                }}
            >
                {/* Overall Score */}
                <Box sx={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    px: 3,
                    rowGap: 1
                }}>
                    <Typography 
                        variant="h1" 
                        sx={{
                            background: "var(--number-gradient, linear-gradient(180deg, #92F3CA 18.75%, rgba(42, 188, 251, 0.74) 85.94%))",
                            backgroundClip: "text", WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent", flexShrink: 0,
                            lineHeight: 1.1,
                        }}
                        aria-owns={overallPopover.open ? 'overall-popover' : undefined}
                        aria-haspopup="true"
                        onMouseEnter={overallPopover.onOpen}
                        onMouseLeave={overallPopover.onClose}
                    >
                        {overallScore}
                    </Typography>
                    <Popover
                        id="overall-popover"
                        open={Boolean(overallPopover.open)}
                        anchorEl={overallPopover.open}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={overallPopover.onClose}
                        disableRestoreFocus
                        sx={{ pointerEvents: 'none',}}
                    >
                        <Box sx={{ p: 2, maxWidth: 280 }}>
                            <Typography variant="subtitle1" gutterBottom>Total Score %</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {"Calculated as 1/3 * (Class Score, Subject Score, Survey Score). If there is no Survey Score, use 1/2 * (Class Score, Subject Score). Range: 0-100. Max: 100."}
                            {/* {"由 1/3*（好课堂评价得分、学科组建设得分、问卷调研得分）算出。若暂无问卷得分，则由1/2 *（好课堂得分、学科组建设得分)得出。区间：0-100。100分为满分。"} */}
                            </Typography>
                        </Box>
                    </Popover>

                    <Typography variant="subtitle1" color="#ffffffe0" textAlign="center" sx={{}}>Total Score</Typography>
                </Box>

                {/* Separator 1 */}
                <Box width={0} sx={{borderRight: "1px solid #ffffff2a"}} />

                {/* Class metrics */}
                <Stack sx={{alignItems: "center", color: "white", justifyContent: "space-between"}}>
                    <ProgressPercentCircle
                        chart={{
                            series: [{ 
                                label: "", 
                                percent: Math.round(evaluation.class.stats.overall ?? -1), 
                                // provide a default value when left is null or undefined
                            }]
                        }}
                        width={"120px"}
                        height={"115px"}
                        i={0}
                        aria-owns={classOverallPopover.open ? 'class-popover' : undefined}
                        aria-haspopup="true"
                        onMouseEnter={classOverallPopover.onOpen}
                        onMouseLeave={classOverallPopover.onClose}
                    />
                    <Popover
                        id="class-popover"
                        open={Boolean(classOverallPopover.open)}
                        anchorEl={classOverallPopover.open}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={classOverallPopover.onClose}
                        disableRestoreFocus
                        sx={{ pointerEvents: 'none',}}
                    >
                        <Box sx={{ p: 2, maxWidth: 280 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                 {/* 好课堂评价部分总得分（百分比） */}
                                 Course Total Score %
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {"由本调研中包含的所有好课堂评分表格的平均得分算出。其中每个好课堂评分表的得分由该表格的所有填写的平均分得出。每个好课堂评分表格、每个评价人回答的权重相等。区间：0-100%。100%为满分。"}
                            </Typography>
                        </Box>
                    </Popover>
                    <Typography variant="subtitle1" sx={{opacity: 0.75}} textAlign="center">Course Evaluation Overall</Typography>
                </Stack>

                {/* Prep metrics */}
                <Stack sx={{alignItems: "center", color: "white", justifyContent: "space-between"}}>
                    <ProgressPercentCircle
                        chart={{
                            series: [{ 
                                label: "", 
                                percent: Math.round(evaluation.prep.stats.overall ?? -1),
                            }],
                        }}
                        width={"120px"}
                        height={"115px"}
                        i={1}
                        aria-owns={prepOverallPopover.open ? 'prep-popover' : undefined}
                        aria-haspopup="true"
                        onMouseEnter={prepOverallPopover.onOpen}
                        onMouseLeave={prepOverallPopover.onClose}
                    />
                    <Popover
                        id="prep-popover"
                        open={Boolean(prepOverallPopover.open)}
                        anchorEl={prepOverallPopover.open}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={prepOverallPopover.onClose}
                        disableRestoreFocus
                        sx={{ pointerEvents: 'none',}}
                    >
                        <Box sx={{ p: 2, maxWidth: 280 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                {/* 学科组建设部分总得分（百分比） */}
                                Subject Total Score %
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {"由本调研中包含的所有学科组建设评分表格的平均得分算出。其中每个学科组建设评分表的得分由该表格的所有填写的平均分得出。每个学科组建设评分表格、每个评价人回答的权重相等。区间：0-100%。100%为满分。"}
                            </Typography>
                        </Box>
                    </Popover>
                    <Typography variant="subtitle1" sx={{opacity: 0.75}} textAlign="center">Subject Evaluation Overall</Typography>
                </Stack>
                
                {/* Surveys */}
                <Stack sx={{alignItems: "center", color: "white", justifyContent: "space-between"}}  aria-owns={surveyOverallPopover.open ? 'survey-popover' : undefined}
                            aria-haspopup="true"
                            onMouseEnter={surveyOverallPopover.onOpen}
                            onMouseLeave={surveyOverallPopover.onClose}>
                    {evaluation.survey.score === null ?
                        <Box flexGrow="3" display="flex" flexDirection="column" justifyContent="center"
                        >
                            <Button variant="soft" sx={{fontSize: 15, color: "#fffffff0", height: "45px", width: "130px"}} onClick={surveyDialogOpen.onTrue}>Set Survey Score</Button>
                        </Box>
                        :
                        (
                        <>
                        <ProgressPercentCircle
                            chart={{
                                series: [{ 
                                    label: "", 
                                    percent: Math.round(evaluation.survey.score*100 ?? 0),
                                }],
                            }}
                            width={"120px"}
                            height={"115px"}
                            i={2}
                            aria-owns={surveyOverallPopover.open ? 'survey-popover' : undefined}
                            aria-haspopup="true"
                            onMouseEnter={surveyOverallPopover.onOpen}
                            onMouseLeave={surveyOverallPopover.onClose}
                        />
                        <Button variant="soft" size="small" sx={{fontSize: 15, color: "#fffffff0"}} onClick={surveyDialogOpen.onTrue}>Adjust Survey Score</Button>
                    </>
                    )                       
                    }
                    <Typography variant="subtitle1" sx={{opacity: 0.75}} textAlign="center">Survey Overall</Typography>
                </Stack>
                <Popover
                        id="survey-popover"
                        open={Boolean(surveyOverallPopover.open)}
                        anchorEl={surveyOverallPopover.open}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={surveyOverallPopover.onClose}
                        disableRestoreFocus
                        sx={{ pointerEvents: 'none',}}
                    >
                        <Box sx={{ p: 2, maxWidth: 280 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Survey Total Score %
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {"问卷部分得分由用户设置。若暂无得分，请为多方问卷部分打分。区间：0-100%。100%为满分。"}
                            </Typography>
                        </Box>
                </Popover>
                
                <Dialog open={surveyDialogOpen.value} onClose={surveyDialogOpen.onFalse} fullWidth maxWidth="sm">
                    <DialogTitle>请设置该调研的问卷总分 (0-100)。</DialogTitle>
                    <DialogContent sx={{mx: 2, py: 2, overflow: "visible"}}>
                        <Slider
                            defaultValue={evaluation.survey.score ? evaluation.survey.score*100: 50}
                            step={10}
                            valueLabelDisplay="on"
                            valueLabelFormat={v => `${v} 分`}
                            min={0}
                            size="medium"
                            marks={[{value: 0, label: "0 分"}, {value: 100, label: "100 分"}]}
                            max={100}
                            onChangeCommitted={(_, value) => {
                                temporarySurveyScore.current = value as number
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button disabled={isSavingSurveyValue.value} variant="outlined" onClick={surveyDialogOpen.onFalse}>
                            取消
                        </Button>
                        <LoadingButton disabled={isSavingSurveyValue.value} loading={isSavingSurveyValue.value} variant="contained" color="primary" onClick={() => {
                            if (temporarySurveyScore.current === null) {
                                enqueueSnackbar("分数无效，请重新设置分数。", {variant: "error"})
                                return
                            }
                            isSavingSurveyValue.setValue(true)
                            axiosInstance2.post(`/evaluation/${eval_id}/survey_score/${temporarySurveyScore.current/100.0}`).then(async (response) => {
                                if (response.data.success) {
                                    enqueueSnackbar("分数设置成功。", {variant: "success"})
                                    surveyDialogOpen.setValue(false)
                                    // await reloadData()
                                } else {
                                    enqueueSnackbar("分数设置失败，请重试。", {variant: "error"})
                                }
                               
                            }).catch((err:any) => {
                                enqueueSnackbar("分数设置失败，请重试。", {variant: "error"})
                                console.log(err)
                            })
                            .finally(() => {
                                isSavingSurveyValue.setValue(false)
                            })
                        }}>
                            保存评分
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            </Stack>
            
            {
                evaluation.class.rubrics.length > 0 &&
                <Accordion
                key={'class'}
                
                sx={{
                    mt: 4,
                    background: 'linear-gradient(102deg, #F1F9FE 8.4%, #F6FDFD 83.36%)',
                    border: 'none',
                }}
                
                defaultExpanded={true}
                onChange={(event, expanded) => {
                        if (!expanded) {
                            classMetricReportRef?.current?.closeAllPopOvers()
                        }
                }}
                >
                    <AccordionSummary
                        expandIcon={<Iconify icon="eva:arrow-ios-downward-fill"/>} // Triangle icon for expanding/collapsing
                    >
                    <Typography variant="h5">
                        {/* {"好课堂评价部分数据总结"} */}
                        {"Course Evaluation Summary"}
                    </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                    { evaluation.class.rubrics.length === 0 ? 
                            <Typography variant="subtitle1" align="center">
                                {/* {"本调研不包含任何好课堂评估表"} */}
                                {"No Course Evaluation Score"}
                            </Typography> :
                            <MetricReportView name="Course Evaluation" startNum={2} ref={classMetricReportRef} 
                            instance={evaluation.class} 
                            // target={metaData.classExpected} totalResponses={metaData.classTotal} 
                            target={20} totalResponses={10} 
                            exportMode={exportMode}/>
                    }
                    </AccordionDetails>

                </Accordion>
            }
            {
                evaluation.prep.rubrics.length > 0 &&
                <Accordion
                key={'prep'}
                sx={{
                    mt: 4,
                    background: 'linear-gradient(102deg, #F1F9FE 8.4%, #F6FDFD 83.36%)',
                    border: 'none',
                }}
                defaultExpanded={true}
                onChange={(event, expanded) => {
                        if (!expanded) {
                            prepMetricReportRef?.current?.closeAllPopOvers()
                        }
                }}
                >
                    <AccordionSummary
                        expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />} // Triangle icon for expanding/collapsing
                    >
                    <Typography variant="h5">{"学科组建设部分数据总结"}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {evaluation.prep.rubrics.length === 0 ? 
                            <Typography variant="subtitle1" align="center">{"本调研不包含任何学科组建设评估表"}</Typography> :
                            <MetricReportView name="学科组建设" startNum={3} ref={prepMetricReportRef} 
                            instance={evaluation.prep} 
                            //target={metaData.prepExpected} totalResponses={metaData.prepTotal} 
                            target={20} totalResponses={10} 
                            exportMode={exportMode}/>
                        }
                    </AccordionDetails>
                </Accordion>
            }
                
            <Accordion
              key={'survey'}
              sx={{
                mt: 4,
                background: 'linear-gradient(102deg, #F1F9FE 8.4%, #F6FDFD 83.36%)',
                border: 'none',
              }}
              defaultExpanded={true}
            >
              <AccordionSummary
                expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />} // Triangle icon for expanding/collapsing
              >
              <Typography variant="h5">{"Survey"}</Typography>
              </AccordionSummary>
              <AccordionDetails>
              <Box mx={{md: 3, sm: 2, xs: 0}} mt={1}>
                <SurveyVisualizationTabs 
                ref={surveyRef} 
                evaluation_id={eval_id} 
                exportMode={exportMode} 
                />                
             </Box>
              </AccordionDetails>
            </Accordion>
           
        </Box>
    </Container>
    </>
}