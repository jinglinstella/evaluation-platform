import React, { useState, useEffect, Fragment, forwardRef, useImperativeHandle } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import SurveyDashboard from '../../sections/evaluations/report/survey-dashboard'
//import axios from 'axios';
import Card from "@mui/material/Card";
import { axiosInstance2 } from 'src/utils/axios';
import { shadows } from 'src/theme/shadows';

interface SurveyVisualizationTabsProps {
    evaluation_id: string;
    // exportMode: boolean;
    // onSurveyLoaded: any;
    // setTotalSurveys: any;
}


export default function SurveyVisualizationTabs({ evaluation_id }: SurveyVisualizationTabsProps) {
    // const [value, setValue] = useState<number | false>(false); // initialized to false
    const [value, setValue] = useState<number>(0);
    const [surveys, setSurveys] = useState<any[]>([]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        const fetchSurveys = async () => {
        try {
            const response = await axiosInstance2.get(`/evaluation/${evaluation_id}`);
            // console.log("response.data.data", response.data.data);
            // console.log("response.data.data.responses", response.data.data.responses);
            // console.log("response.data.data.surveys", response.data.data.surveys);
            if (response.data.success && response.data.data.surveys.length > 0) {
                setSurveys(response.data.data.surveys);
                setValue(0); // set to the first tab only if there are surveys
            } else {
                setSurveys([]);
                setValue(0); // reset to 0 if no surveys
            }
        } catch (error) {
            console.error('Error fetching surveys:', error);
        }
        };
        fetchSurveys();
    }, [evaluation_id]);

    function a11yProps(index: number) {
        return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        surveys.length > 0 ? (
            <>
                <Card sx={{ borderBottom: 1, borderColor: 'divider', borderRadius: 1, px: 2, boxShadow: shadows("light")[3] }}>
                    <Tabs value={value} 
                    onChange={handleChange} 
                    aria-label="survey tabs">
                        {surveys.map((survey, index) => (
                            <Tab label={survey.title} {...a11yProps(index)} key={survey.survey_id} />
                        ))}
                    </Tabs>
                </Card>
                {surveys.map((survey, index) => (
                    <div
                        role="tabpanel"
                        //hidden={value !== index}
                        hidden={false}
                        id={`simple-tabpanel-${index}`}
                        aria-labelledby={`simple-tab-${index}`}
                        key={survey.survey_id}
                    >
                        {/* {value === index && (
                            <SurveyDashboard evaluation_id={evaluation_id} survey_index={String(index)} />
                        )} */}
                        <SurveyDashboard evaluation_id={evaluation_id} survey_index={String(index)} />
                    </div>
                ))}
            </>
        ) : (
            <Fragment />
        )
    );
}