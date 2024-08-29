import React, { CSSProperties }from 'react';
import Card, { CardProps } from '@mui/material/Card';
import ProgressBar from 'src/sections/overview/progress-bar';
import styles from "./Evaluation.module.css";
import { Box, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import Circle from 'src/sections/overview/ecommerce-sale-by-gender';
import { EvaluationItemDetails } from 'src/types/evaluation';

let cn_mapping: Record<string, string> = {
    ".": "。",
    "School Name": "学校名称",
    "Subject": "科目",
    "Date": "日期",
    "Average Score": "平均分",
    "Max Score": "最高分",
    "Responses": "X人提交",
    "Elementary": "小学",
    "Middle School": "中学",
    "High School": "高中",
    "Unknown Level": "未知"
}

function localizedString(s: string): string {
    if (isChinese()) {
        return cn_mapping[s] ?? s
    } else {
        return s
    }
}

function isChinese(): boolean {
    //return window.location.hostname.endsWith('linghangxiong.com') || window.location.hostname.endsWith('linghangwan.com');
    return false;
}

const calculateAverageScore = (metrics: any) => {
    if(metrics===null){
        return 0;
    }
    const scores = metrics
        .filter((metric:any) => metric.average_score !== null)
        .map((metric:any) => metric.average_score*100);
    const totalScore = scores.reduce((acc:number, score:number) => acc + score, 0);
    const averageScore = scores.length > 0 ? totalScore / scores.length : 0;
    return parseFloat(averageScore.toFixed(1));
};

const calculateTotalResponse = (metrics: any)=>{
    const countArr = metrics.map((metric: any)=>metric.total_responses);
    const count = countArr.reduce((acc:any, c:any)=>acc + c, 0);
    return count;
}

const CheckMark: React.FC=()=>(
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M11.6484 4.64844L12.3516 5.35156L6.5 11.2031L3.64844 8.35156L4.35156 7.64844L6.5 9.79688L11.6484 4.64844ZM8 0C8.73438 0 9.44271 0.09375 10.125 0.28125C10.8073 0.46875 11.4453 0.736979 12.0391 1.08594C12.6328 1.4349 13.1719 1.85156 13.6563 2.33594C14.1406 2.82031 14.5573 3.36198 14.9063 3.96094C15.2552 4.5599 15.5234 5.19792 15.7109 5.875C15.8984 6.55208 15.9948 7.26042 16 8C16 8.73438 15.9063 9.44271 15.7188 10.125C15.5313 10.8073 15.263 11.4453 14.9141 12.0391C14.5651 12.6328 14.1484 13.1719 13.6641 13.6563C13.1797 14.1406 12.638 14.5573 12.0391 14.9063C11.4401 15.2552 10.8021 15.5234 10.125 15.7109C9.44792 15.8984 8.73958 15.9948 8 16C7.26563 16 6.55729 15.9063 5.875 15.7188C5.19271 15.5313 4.55469 15.263 3.96094 14.9141C3.36719 14.5651 2.82813 14.1484 2.34375 13.6641C1.85938 13.1797 1.44271 12.638 1.09375 12.0391C0.744792 11.4401 0.476563 10.8047 0.289063 10.1328C0.101563 9.46094 0.00520833 8.75 0 8C0 7.26563 0.09375 6.55729 0.28125 5.875C0.46875 5.19271 0.736979 4.55469 1.08594 3.96094C1.4349 3.36719 1.85156 2.82813 2.33594 2.34375C2.82031 1.85938 3.36198 1.44271 3.96094 1.09375C4.5599 0.744792 5.19531 0.476563 5.86719 0.289063C6.53906 0.101563 7.25 0.00520833 8 0ZM8 15C8.64062 15 9.25781 14.9167 9.85156 14.75C10.4453 14.5833 11.0026 14.349 11.5234 14.0469C12.0443 13.7448 12.5182 13.3776 12.9453 12.9453C13.3724 12.513 13.737 12.0417 14.0391 11.5313C14.3411 11.0208 14.5781 10.4635 14.75 9.85938C14.9219 9.25521 15.0052 8.63542 15 8C15 7.35938 14.9167 6.74219 14.75 6.14844C14.5833 5.55469 14.349 4.9974 14.0469 4.47656C13.7448 3.95573 13.3776 3.48177 12.9453 3.05469C12.513 2.6276 12.0417 2.26302 11.5313 1.96094C11.0208 1.65885 10.4635 1.42188 9.85938 1.25C9.25521 1.07812 8.63542 0.994792 8 1C7.35938 1 6.74219 1.08333 6.14844 1.25C5.55469 1.41667 4.9974 1.65104 4.47656 1.95313C3.95573 2.25521 3.48177 2.6224 3.05469 3.05469C2.6276 3.48698 2.26302 3.95833 1.96094 4.46875C1.65885 4.97917 1.42188 5.53646 1.25 6.14063C1.07812 6.74479 0.994792 7.36458 1 8C1 8.64062 1.08333 9.25781 1.25 9.85156C1.41667 10.4453 1.65104 11.0026 1.95313 11.5234C2.25521 12.0443 2.6224 12.5182 3.05469 12.9453C3.48698 13.3724 3.95833 13.737 4.46875 14.0391C4.97917 14.3411 5.53646 14.5781 6.14063 14.75C6.74479 14.9219 7.36458 15.0052 8 15Z" fill="white"/>
    </svg>
);

const PendingMark: React.FC=()=>(
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.804 13C4.67139 12.7703 4.45297 12.6027 4.1968 12.5341C3.94063 12.4655 3.66768 12.5014 3.438 12.634L1.706 13.634C1.47819 13.7676 1.31246 13.9858 1.24496 14.2411C1.17747 14.4964 1.21369 14.768 1.34573 14.9967C1.47776 15.2254 1.69489 15.3926 1.94974 15.4617C2.20458 15.5309 2.47644 15.4965 2.706 15.366L4.438 14.366C4.66767 14.2334 4.83526 14.015 4.9039 13.7588C4.97254 13.5026 4.9366 13.2297 4.804 13ZM1.706 6.366L3.438 7.366C3.55177 7.4327 3.67761 7.47623 3.80827 7.4941C3.93894 7.51196 4.07185 7.50381 4.19935 7.4701C4.32685 7.43639 4.44642 7.3778 4.55118 7.29769C4.65594 7.21758 4.74382 7.11754 4.80976 7.00333C4.8757 6.88912 4.9184 6.76299 4.9354 6.63221C4.9524 6.50143 4.94336 6.36858 4.90881 6.24131C4.87426 6.11403 4.81487 5.99485 4.73407 5.89063C4.65327 5.7864 4.55265 5.69918 4.438 5.634L2.706 4.634C2.47644 4.50348 2.20458 4.46906 1.94974 4.53825C1.69489 4.60744 1.47776 4.77462 1.34573 5.00331C1.21369 5.23199 1.17747 5.50362 1.24496 5.75892C1.31246 6.01421 1.47819 6.23245 1.706 6.366ZM4 10C4 9.73478 3.89464 9.48043 3.70711 9.29289C3.51957 9.10536 3.26522 9 3 9H1C0.734784 9 0.48043 9.10536 0.292893 9.29289C0.105357 9.48043 0 9.73478 0 10C0 10.2652 0.105357 10.5196 0.292893 10.7071C0.48043 10.8946 0.734784 11 1 11H3C3.26522 11 3.51957 10.8946 3.70711 10.7071C3.89464 10.5196 4 10.2652 4 10ZM15.196 7C15.3286 7.22967 15.547 7.39726 15.8032 7.4659C16.0594 7.53454 16.3323 7.4986 16.562 7.366L18.294 6.366C18.4086 6.30082 18.5093 6.2136 18.5901 6.10937C18.6709 6.00515 18.7303 5.88597 18.7648 5.75869C18.7994 5.63142 18.8084 5.49857 18.7914 5.36779C18.7744 5.23701 18.7317 5.11088 18.6658 4.99667C18.5998 4.88246 18.5119 4.78242 18.4072 4.70231C18.3024 4.62221 18.1828 4.56361 18.0553 4.5299C17.9278 4.49619 17.7949 4.48804 17.6643 4.5059C17.5336 4.52377 17.4078 4.5673 17.294 4.634L15.562 5.634C15.3323 5.76661 15.1647 5.98503 15.0961 6.2412C15.0275 6.49737 15.0634 6.77032 15.196 7ZM13 4.804C13.2297 4.9366 13.5026 4.97254 13.7588 4.9039C14.015 4.83526 14.2334 4.66767 14.366 4.438L15.366 2.706C15.4327 2.59223 15.4762 2.46639 15.4941 2.33572C15.512 2.20506 15.5038 2.07215 15.4701 1.94465C15.4364 1.81715 15.3778 1.69758 15.2977 1.59282C15.2176 1.48806 15.1175 1.40018 15.0033 1.33424C14.8891 1.26829 14.763 1.2256 14.6322 1.2086C14.5014 1.1916 14.3686 1.20064 14.2413 1.23519C14.114 1.26974 13.9949 1.32913 13.8906 1.40993C13.7864 1.49073 13.6992 1.59135 13.634 1.706L12.634 3.438C12.5014 3.66768 12.4655 3.94063 12.5341 4.1968C12.6027 4.45297 12.7703 4.67139 13 4.804ZM18.294 13.634L16.562 12.634C16.4482 12.5673 16.3224 12.5238 16.1917 12.5059C16.0611 12.488 15.9282 12.4962 15.8007 12.5299C15.6732 12.5636 15.5536 12.6222 15.4488 12.7023C15.3441 12.7824 15.2562 12.8825 15.1902 12.9967C15.1243 13.1109 15.0816 13.237 15.0646 13.3678C15.0476 13.4986 15.0566 13.6314 15.0912 13.7587C15.1257 13.886 15.1851 14.0051 15.2659 14.1094C15.3467 14.2136 15.4474 14.3008 15.562 14.366L17.294 15.366C17.5236 15.4965 17.7954 15.5309 18.0503 15.4617C18.3051 15.3926 18.5222 15.2254 18.6543 14.9967C18.7863 14.768 18.8225 14.4964 18.755 14.2411C18.6875 13.9858 18.5218 13.7676 18.294 13.634ZM14.366 15.562C14.3008 15.4474 14.2136 15.3467 14.1094 15.2659C14.0051 15.1851 13.886 15.1257 13.7587 15.0912C13.6314 15.0566 13.4986 15.0476 13.3678 15.0646C13.237 15.0816 13.1109 15.1243 12.9967 15.1902C12.8825 15.2562 12.7824 15.3441 12.7023 15.4488C12.6222 15.5536 12.5636 15.6732 12.5299 15.8007C12.4962 15.9282 12.488 16.0611 12.5059 16.1917C12.5238 16.3224 12.5673 16.4482 12.634 16.562L13.634 18.294C13.6992 18.4086 13.7864 18.5093 13.8906 18.5901C13.9949 18.6709 14.114 18.7303 14.2413 18.7648C14.3686 18.7994 14.5014 18.8084 14.6322 18.7914C14.763 18.7744 14.8891 18.7317 15.0033 18.6658C15.1175 18.5998 15.2176 18.5119 15.2977 18.4072C15.3778 18.3024 15.4364 18.1828 15.4701 18.0553C15.5038 17.9278 15.512 17.7949 15.4941 17.6643C15.4762 17.5336 15.4327 17.4078 15.366 17.294L14.366 15.562ZM19 9H17C16.7348 9 16.4804 9.10536 16.2929 9.29289C16.1054 9.48043 16 9.73478 16 10C16 10.2652 16.1054 10.5196 16.2929 10.7071C16.4804 10.8946 16.7348 11 17 11H19C19.2652 11 19.5196 10.8946 19.7071 10.7071C19.8946 10.5196 20 10.2652 20 10C20 9.73478 19.8946 9.48043 19.7071 9.29289C19.5196 9.10536 19.2652 9 19 9ZM10 16C9.73478 16 9.48043 16.1054 9.29289 16.2929C9.10536 16.4804 9 16.7348 9 17V19C9 19.2652 9.10536 19.5196 9.29289 19.7071C9.48043 19.8946 9.73478 20 10 20C10.2652 20 10.5196 19.8946 10.7071 19.7071C10.8946 19.5196 11 19.2652 11 19V17C11 16.7348 10.8946 16.4804 10.7071 16.2929C10.5196 16.1054 10.2652 16 10 16ZM7 15.196C6.77032 15.0634 6.49737 15.0275 6.2412 15.0961C5.98503 15.1647 5.76661 15.3323 5.634 15.562L4.634 17.294C4.50348 17.5236 4.46906 17.7954 4.53825 18.0503C4.60744 18.3051 4.77462 18.5222 5.00331 18.6543C5.23199 18.7863 5.50362 18.8225 5.75892 18.755C6.01421 18.6875 6.23245 18.5218 6.366 18.294L7.366 16.562C7.4986 16.3323 7.53454 16.0594 7.4659 15.8032C7.39726 15.547 7.22967 15.3286 7 15.196ZM10 0C9.73478 0 9.48043 0.105357 9.29289 0.292893C9.10536 0.48043 9 0.734784 9 1V3C9 3.26522 9.10536 3.51957 9.29289 3.70711C9.48043 3.89464 9.73478 4 10 4C10.2652 4 10.5196 3.89464 10.7071 3.70711C10.8946 3.51957 11 3.26522 11 3V1C11 0.734784 10.8946 0.48043 10.7071 0.292893C10.5196 0.105357 10.2652 0 10 0Z" fill="white"/>
    </svg>
);

function Status({status}: {status: number}){ //data: evaluations[i]
    return (
        <Box style={{
            borderTopRightRadius: '5px', borderTopLeftRadius: '5px', 
            marginLeft: '10px', 
            background: status===2 ? '#4CB782': "#F2B94A",
            display: 'flex', alignItems:'center', justifyContent:'center', 
            marginTop:'20px', width:'99px',
            textDecoration: 'none'}}>
            <Box style={{marginLeft: '9px', marginRight:'1px',marginBottom:'1px',marginTop:'2.8px'}}>
                {status === 2? <CheckMark/> : <PendingMark/>}
            </Box>
            <Box style={{
                color: '#FFF',
                fontFamily:'Helvetica',
                fontSize:'10px',
                fontStyle:'normal',
                fontWeight:'400',
                lineHeight:'22px',
                marginLeft:'5px',
                marginRight:'9px',
                marginTop:'1px',
            }}>
                {status===2? "Completed" : "Pending"}
            </Box>
        </Box>       
    );
}

function CompleteEvalResults({class_metrics, prep_metrics, surveys}: EvaluationItemDetails){

    const classAvg = calculateAverageScore(class_metrics);
    const prepAvg = calculateAverageScore(prep_metrics);
    const totalSurveys = calculateTotalResponse(surveys);

    return (
            <Stack sx={{width: "80%", marginBottom: "27px", }}>
                <Stack direction="row" sx={{justifyContent: "space-between", textAlign: "center", marginBottom: "10px"}}>
                    <Stack direction="row">
                        <Box style={{width:'15px', height:'15px',background:'#7669DF'}}></Box>
                        <Box sx={{
                            color:"#868686",
                            fontFamily: "Helvetica",
                            fontSize: "14px",
                            fontStyle:"normal",
                            fontWeight:"400",
                            lineHeight: "22px",
                            paddingLeft:"10px",
                            textAlign:"center",
                        }}>
                            Class Eval:
                        </Box>
                    </Stack>
                    <div className={styles.completePercent1}>{`${classAvg}%`}</div>
                </Stack>                   
                <Stack direction="row" sx={{justifyContent: "space-between", textAlign: "center", marginBottom: "10px"}}>
                    <Stack direction="row">
                        <Box style={{width:'15px', height:'15px',background:'#4CA6E6'}}></Box>
                        <Box sx={{
                            color:"#868686",
                            fontFamily: "Helvetica",
                            fontSize: "14px",
                            fontStyle:"normal",
                            fontWeight:"400",
                            lineHeight: "22px",
                            paddingLeft:"10px",
                            textAlign:"center",
                        }}>
                            Prep Eval:
                        </Box>
                    </Stack>
                    <div className={styles.completePercent2}>{`${prepAvg}%`}</div>
                </Stack>               
                <Stack direction="row" sx={{justifyContent: "space-between", textAlign: "center", marginBottom: "10px"}}>
                    <Stack direction="row" sx={{justifyContent: "center"}}>
                        <Box style={{width:'15px', height:'15px',background:'#93D2EE'}}></Box>
                        <Box sx={{
                            color:"#868686",
                            fontFamily: "Helvetica",
                            fontSize: "14px",
                            fontStyle:"normal",
                            fontWeight:"400",
                            lineHeight: "22px",
                            paddingLeft:"10px",
                            textAlign:"center",
                        }}>
                            Survey Results Received:
                        </Box>
                    </Stack>       
                    <div className={styles.completePercent3}>{totalSurveys}</div>
                </Stack>
            </Stack> 

    );
}

function CompleteEvalCard(data: EvaluationItemDetails){ //data: evaluations[i]
    const classAvg = calculateAverageScore(data.class_metrics);
    const prepAvg = calculateAverageScore(data.prep_metrics);
    const hasSurvey = 'survey_score' in data
    let surveyScore = hasSurvey ? data.survey_score : 0;
    if(surveyScore===null){
        surveyScore=0;
    }else if(surveyScore==undefined){
        surveyScore=0;
    }
    // const totalScore = classAvg + prepAvg + surveyScore*100;
    const totalScore = classAvg + prepAvg;

    return (
            <Link href={`/evaluations/report/${data.uuid}`} style={{ textDecoration: 'none' }}>
                <Status status={data.status}/>
                <Card sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: "30px",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "400px",
                    borderRadius:"15px",
                    background: "#F0F0F3",
                    cursor: "pointer",
                    textDecoration: "none",
                    boxShadow: "9.99977px 9.99977px 29.9993px 0px rgba(174, 174, 192, 0.40), 0px 0px 20px 0px rgba(255, 255, 255, 0.70)"              
                }}>
                <SchoolHeader school_name={data.school_name} end_date={data.end_date} status={data.status} level={data.level}/>
                    <Circle total={totalScore} chart={{
                        series:[
                            {label: 'class eval', value: classAvg},
                            {label: 'prep eval', value: prepAvg},
                            ...(hasSurvey ? [{ label: 'survey score', value: surveyScore*100 }] : []) 
                        ]
                    }}
                    />
                    <CompleteEvalResults {...data}/>
                </Card>
            </Link>
    );
};

function PendingResBar({caption, value, total}: {caption: string, value: number, total: number}){
    return(
        <Stack direction="column" sx={{marginBottom: "30px"}}>
            <Stack direction = "row" sx={{height: "15px", justifyContent: "space-between", textAlign: "center", marginBottom: "10px"}}>              
                <Box sx={{
                    color:"#868686",
                    fontFamily: "Helvetica",
                    fontSize: "14px",
                    fontStyle:"normal",
                    fontWeight:"400",
                    lineHeight: "22px",
                    paddingLeft:"10px",
                    textAlign:"center",
                }}>
                    {`${caption}`}:
                </Box>
                <Box sx={{
                    color:"#57ABD7",
                    fontFamily: "Futura",
                    fontSize: "16px",
                    fontStyle:"normal",
                    fontWeight:"700",
                    lineHeight: "22px",
                    paddingRight:"10px",
                    textAlign:"center",
                }}>
                    {`${value}/${total}`}
                </Box>
            </Stack>
            <ProgressBar percentage={(value / total) * 100} /> 
        </Stack>

    );
}
  

const PendingEvalResults: React.FC<any> = ({stats}) =>{

    const classMetricTarget = (stats.class_metric_response >0 && stats.class_metric_target === 0) ? 1 : stats.class_metric_target;
    const prepMetricTarget = (stats.class_metric_response >0 && stats.class_metric_target === 0) ? 1 : stats.class_metric_target;

    return (
        <>
            <Stack direction="column" sx={{width: "80%", justifyContent: "space-evenly", marginBottom: "20px"}}>
                <PendingResBar caption={"Course Eval"} value={stats.class_metric_response} total={classMetricTarget}/>
                <PendingResBar caption={"Prep Eval"} value={stats.prep_metric_response} total={prepMetricTarget}/>
                <PendingResBar caption={"Survey Results Received"} value={stats.survey_response} total={stats.survey_target}/>          
            </Stack> 
        </>
    );
}

function SchoolHeader({school_name, end_date, status, level}:{school_name: string, end_date: string, status: number, level: number}){
    const schoolLevelTag = (level: number): string => {
        switch (level) {
            case 0:
                return localizedString("Elementary");
            case 1:
                return localizedString("Middle School");
            case 2:
                return localizedString("High School");
            case 3:
                return localizedString("University");
            case 4:
                return localizedString("Vocational School");
            default:
                return localizedString("Unknown");
        }
    };
    const tagColor = [
        {level: 0, color:"#9FCB44"},
        {level: 1, color:"#4CA6E6"},
        {level: 2, color:"#6B73DD"},
        {level: 3, color:"#F2873E"},
        {level: 4, color:"#A7477B"},
    ];

    function getColorByLevel(level: number) {
        const tag = tagColor.find(tag => tag.level === level);
        return tag ? tag.color : "D5D5D7"; 
    }

    const dateObj = new Date(end_date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const formattedDate = `${year}-${month}`;

    return(
        <Stack direction="column" sx={{width: "80%"}}>
            <Box sx={{
                color: "#000",
                fontFamily: "Helvetica",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: "700",
                lineHeight: "22px",
                marginBottom: "5px"
            }}>
                <Typography variant='h6'>{school_name}</Typography>              
            </Box>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Box>Date: {formattedDate}</Box>
                <Box sx={{
                    borderRadius: "21px", color: "#FAFAFA", fontFamily: "Helvetica",
                    fontSize:"11px", fontStyle:"normal", fontWeight: "400", lineHeight:"22px",
                    background: getColorByLevel(level),
                    paddingLeft: "10px", paddingRight:"10px", 
                }}>    
                    <Typography sx={{ fontSize: '11px', paddingTop: "3px"}}>{schoolLevelTag(level)}</Typography>                 
                </Box>
            </Stack>

            <Box sx={{
                width: "80%",
                // marginBottom: "7px",
                marginTop: "15px"
            }}>
                <Typography variant='h6'>
                    {status === 2 ? "Overall Score" : "In Progress"}
                </Typography>
            </Box>

        </Stack>
    );

}

function PendingEvalCard(data: EvaluationItemDetails){
    return (
    <Link href={`/evaluations/report/${data.uuid}`} style={{ textDecoration: 'none' }}>
        <Status status={data.status}/>
        <Card sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "30px",
            justifyContent: "space-between",
            width: "100%",
            height: "400px",
            borderRadius:"15px",
            background: "#F0F0F3",
            boxShadow: "9.99977px 9.99977px 29.9993px 0px rgba(174, 174, 192, 0.40), 0px 0px 20px 0px rgba(255, 255, 255, 0.70)"              
        }}>
            <SchoolHeader school_name={data.school_name} end_date={data.end_date} status={data.status} level={data.level}/>
            <PendingEvalResults stats={data.stats}/>
        </Card>
    </Link>
    );
};

function EvalCard (data: EvaluationItemDetails){
    // console.log("EvaluationItemDetails: ", data);
    return (
        <Box className={styles.evaluationCard}>
            {data.status===2 ? (
                    // this is how to pass down an object
                    <CompleteEvalCard {...data} /> 
                ) : (
                    <PendingEvalCard {...data} />
            )}
        </Box>
    );
};

export default EvalCard;
