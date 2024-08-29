'use client';
import React, { useRef, useState, useEffect, useCallback, ReactElement } from "react"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from '@mui/material/Container';
import { LoadingScreen } from "src/components/loading-screen";
// import htmlToPDF from 'src/sections/evaluations/html2pdf'
// import SurveyBarChart from 'src/sections/overview/analytics/analytics-conversion-rates';
// import { getSurveyData } from 'src/sections/evaluations/report/data';
// import { string } from "yup";
// import { ChartsDataItem, TablesDataItem } from "src/sections/evaluations/report/survey-panel";

interface SurveyTableProps{
    title: string;
    series: string[];
}

export default function SurveyTable({title, series}: SurveyTableProps){

    return (
        <>       
        <Box mb={3}>{title}</Box>
        <Box mr={3}>
        {series.map((text, index)=>{
            if(index===0){
                return <Box py={0.5} px={1} key={index} borderTop="1px solid #0066A0" borderBottom="1px dashed #cfd2d4">
                        {text}
                    </Box>
            }else if(index===series.length-1){
                return <Box py={0.5} px={1} key={index} borderBottom="1px solid #0066A0">
                        {text}
                    </Box>
            }else{
                return <Box py={0.5} px={1} key={index} borderBottom="1px dashed #cfd2d4">
                        {text}
                    </Box>
            }

        })}
        </Box>

        </>
    )

}