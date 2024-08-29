import { useState, useEffect, useRef } from 'react';
import 'survey-analytics/survey.analytics.min.css';
import { Model } from 'survey-core';
import { VisualizationPanel, localization } from 'survey-analytics';
//import axios from 'axios';
import {  chineseStrings } from '../../../components/eval_results/chinese';
import { axiosInstance2 } from 'src/utils/axios';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { grey } from 'src/theme/palette';
import MockData0 from 'src/sections/evaluations/report/real-data/survey_response0.json'
import MockData1 from 'src/sections/evaluations/report/real-data/survey_response1.json'

localization.locales["zh-cn"] = chineseStrings;
localization.localeNames["zh-cn"] = "中文";
localization.currentLocale = "zh-cn";

interface SurveyDashboardProps {
    evaluation_id: string;
    survey_index: string;
    // onLoaded: any;
}

interface SurveyResponse {
    survey_id: string;
    version: number;
    response_id: number;
    response_data: any;
    submission_date: string;
}

const vizPanelOptions = {
    allowHideQuestions: false,
    allowDynamicLayout: false
};


interface SurveyDashboardProps {
    evaluation_id: string;
    survey_index: string;
    
}

interface SurveyResponse {
    survey_id: string;
    version: number;
    response_id: number;
    response_data: any;
    submission_date: string;
}



function SurveyDashboard({ evaluation_id, survey_index }: SurveyDashboardProps) {
    const [survey_json, setSurveyJson] = useState<any | null>(null);
    const [survey_responses, setSurveyResponses] = useState<any[]>([]);
    const [survey, setSurvey] = useState<Model | null>(null);
    const [vizPanel, setVizPanel] = useState<VisualizationPanel | null>(null);

    // 1. Fetch data.
    useEffect(() => {
        async function fetchSurveyData() {
            try {
                //const response = await axiosInstance2.get(`/survey/get_survey_and_responses/${evaluation_id}/${survey_index}`);
                const response = parseInt(survey_index)===0? MockData0 : MockData1;
                if (response.data) {
                    setSurveyJson(response.data.survey.data);
                    setSurveyResponses(response.data.responses.map((resp: SurveyResponse) => resp.response_data));
                }
            } catch (error) {
                console.error('Error fetching survey data:', error);
            }
        }

        fetchSurveyData();
    }, [evaluation_id, survey_index]);

    // 2. Once data is fetched and state is set, initialize the survey model.
    useEffect(() => {
        if (survey_json && !survey) {
            const newSurvey = new Model(survey_json);
            setSurvey(newSurvey);
        }
    }, [survey_json, survey]);

    // 3. Once the survey model is initialized, set up the visualization panel.
    useEffect(() => {
        if (survey && survey_responses.length > 0 && !vizPanel) {
            const newVizPanel = new VisualizationPanel(
                survey.getAllQuestions(),
                survey_responses,
                vizPanelOptions
            );
            newVizPanel.showToolbar = false;
            setVizPanel(newVizPanel);
        }
    }, [survey, survey_responses, vizPanel]);

    // 4. Render the visualization panel.
    useEffect(() => {
        if (vizPanel) {
            vizPanel.render(`surveyVizPanel-${survey_index}`);
            return () => {
                const element = document.getElementById(`surveyVizPanel-${survey_index}`);
                if (element) {
                    element.innerHTML = "";
                }
            }
        }
    }, [vizPanel]);

    return (
        <Box minHeight="80vh">
            {survey === null ?
                <Typography variant="body2" color={grey[600]} lineHeight="50px">No Data</Typography>
                :
                (survey_responses.length > 0 ?
                    <div id={`surveyVizPanel-${survey_index}`} />
                    // <div id={`surveyVizPanel`} />
                    :
                    <Typography variant="body2" color={grey[600]} lineHeight="50px">No Data</Typography>
                )
            }
        </Box>
    );
}

export default SurveyDashboard;