'use client';
import React, { useRef, useState, useEffect, useCallback, ReactElement } from "react"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from '@mui/material/Container';
import { LoadingScreen } from "src/components/loading-screen";
// import htmlToPDF from 'src/sections/evaluations/html2pdf'
import SurveyBarChart from 'src/sections/overview/analytics/analytics-conversion-rates';
import { getSurveyData } from 'src/sections/evaluations/report/data';
import { string } from "yup";
import SurveyTable from "src/sections/evaluations/report/survey-table";
// import MockSurveyRes1 from "src/sections/evaluations/report/survey-res1.json";
// import MockSurveyRes2 from "src/sections/evaluations/report/survey-res2.json";
// import MockSurveyRes3 from "src/sections/evaluations/report/survey-res3.json";

interface SurveyPanelProps {
    evaluation_id: string;
    survey_index: number;
    survey_title: string;
    titleIndex: number;
    pageNumber?: number;
    token?:string;
}

interface SurveyChoice{
    text:string;
    value:string;
}

interface SurveyElement{
    name: string;
    type: string;
    title: string;
    choices?: SurveyChoice[];
    otherText?:string;
    showOtherItem?:boolean;
}

interface SurveyPage{
    name: string;
    elements: SurveyElement[];
}

interface SurveyQuestionData{
    uuid:string;
    version:number;
    data:{
        pages:SurveyPage[];
        title:string;
    };
    creation_date:string;
    last_modified:string;
    target_group:number;
    levels:number[];
    total_questions:number;
    deleted:number;
}

interface SurveyResponseData{
    [key:string]:string | string[] | undefined;
    //actual data includes a key ("问题2-Comment") that might have an undefined value
}

interface SurveyResponse{
    survey_id: string;
    version: number;
    evaluation_id: string;
    response_data: SurveyResponseData;
    submission_date: string;
}

export interface SurveyData{
    survey: SurveyQuestionData;
    responses: SurveyResponse[];
}

interface ChartSeriesItem{
    label: string;
    value: number;
}

export interface ChartsDataItem{
    title: string;
    series: ChartSeriesItem[];
}

export interface TablesDataItem{
  title: string;
  series: string[];
}

const processDataForTables = (jsonData: SurveyData):TablesDataItem[]=>{
  const {survey, responses} = jsonData;
  let TablesData: TablesDataItem[]=[];
  survey.data.pages.forEach((page: SurveyPage)=>{
    page.elements.forEach(element=>{
      if(element.type!=="text") return;
      let textResponses: string[]=[];
      responses.forEach((response:SurveyResponse)=>{
        //extract the response corresponding to the question
        const responseData=response.response_data[element.name];
        if (responseData !== undefined) { // skip undefined values
          if (Array.isArray(responseData)) {
            textResponses = textResponses.concat(responseData);
          } else {
            textResponses.push(responseData);
          }
        }     
      })
      TablesData.push({
        title: element.title,
        series: textResponses
      });
    })
  })
  return TablesData;

}

const processDataForCharts = (jsonData: SurveyData):ChartsDataItem[] => {
    const { survey, responses } = jsonData;
  
    //initialize an array to hold the chart data for each question
    let chartsData: ChartsDataItem[]=[];
  
    survey.data.pages.forEach((page: SurveyPage)=> {
      page.elements.forEach(element => {
        //skip text questions
        if (element.type === "text" || !element.choices) return;
  
        //initialize a map to count choices
        let choiceCounts = new Map<string, number>();
  
        //initialize choiceCounts with available choices
        element.choices.forEach(choice => {
          choiceCounts.set(choice.value, 0);
        });
  
        //count the frequencies of each choice in responses; one element means one question
        responses.forEach((response:SurveyResponse) => {
          const responseData = response.response_data[element.name];
          if (!responseData) return; //skip if no response data for this question
  
          if (Array.isArray(responseData)) {
            //checkbox question, multiple choices possible; responseData=["item1","item2"...]
            responseData.forEach(item => {
              choiceCounts.set(item, (choiceCounts.get(item) || 0) + 1);
            });
          } else {
            //radio question, single choice; responseData="item 1"
            choiceCounts.set(responseData, (choiceCounts.get(responseData) || 0) + 1);
          }
        });
  
        //each question(element) has a choiceCounts map
        //convert choiceCounts to the expected chart series format
        const series = Array.from(choiceCounts, ([value, count]) => ({
          label: element.choices?.find(choice => choice.value === value)?.text || (element.otherText? element.otherText : "Unknown"),
          value: count
        }));
  
        chartsData.push({
          title: element.title,
          series: series
        });
      });
    });
  
    return chartsData;
};

const pageStyle = {
    width: '210mm',     
    height: '297mm',    
    margin: '0 auto',   
    overflow: 'hidden', 
    //pageBreakAfter: 'always',
    // paddingLeft: '10mm',
    // paddingRight: '20mm',
    // paddingTop: '20mm',
    // paddingBottom: '5mm',
    flexWrap: 'wrap', 
    alignItems: 'flex-start', 
    justifyContent: 'space-around', 
};

interface Total{
  type: string,
  data: ChartsDataItem | TablesDataItem
}

export default function SurveyPanel({ evaluation_id, survey_index, survey_title, titleIndex, pageNumber, token}: SurveyPanelProps) {
    const { surveyData, isLoading, mutate} = getSurveyData(evaluation_id, survey_index, token);
    // const MockSurveyData=[MockSurveyRes1, MockSurveyRes2, MockSurveyRes3];
    // const surveyData=MockSurveyData[survey_index].data;
    const responseSize=surveyData?.responses.length;
    const chartsData = surveyData ? processDataForCharts(surveyData) : [];
    const tablesData = surveyData ? processDataForTables(surveyData) : [];
    // console.log("chartsData", chartsData);
    // console.log("tablesData", tablesData);
    let total: Total[]=[];
    chartsData.forEach((item)=>{
      const a={
        type: "chart",
        data: item,
      }
      total.push(a);
    })
    tablesData.forEach((item)=>{
      const a={
        type: "table",
        data: item,
      }
      total.push(a);
    })

    const groupedData=[];
    for(let i=0; i<total.length; i+=3){
      groupedData.push(total.slice(i,i+3));
    }

    if (isLoading || surveyData===null) { 
      return <LoadingScreen /> 
    }

    return (
      <>
      <style>
          {`
          @media print {
              .page {
                  page-break-after: auto;
                  page-break-inside: avoid;
              }
          }
          `}
      </style>

      {groupedData.map((group, index) => (
        <Box  id={`page${(pageNumber || 0) + index}`} key={index} sx={pageStyle}className='page'> 
          {survey_index===0 && (<Typography variant="h6" mb={1}>{"四、多方问卷填写数据"}</Typography>)}
          <Typography variant="h6" mb={2}>{`${titleIndex}.${survey_index+1} ${survey_title}`}</Typography>
          <Typography variant="h6" mb={2}>{`填写人数: ${responseSize}`}</Typography>
          {group.map((item, idx) => {
            if (item.type === 'table') {
              const { title, series } = item.data as TablesDataItem;
              return <SurveyTable key={idx} title={`${titleIndex}.${survey_index + 1}.${idx+index+1} ${title}`} series={series}/>;
            } else {
              const {title, series} = item.data as ChartsDataItem;
              return (
                <SurveyBarChart
                  key={idx}
                  title={`${titleIndex}.${survey_index + 1}.${idx+index*3+1} ${title}`} 
                  subheader=""
                  chart={{ series: series }}
                />
              );
            }
          })}
        </Box>
      ))}
      </>
      );
}