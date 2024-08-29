import React, { useState, useEffect, Fragment, forwardRef, useImperativeHandle } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import SurveyDashboard from './survey-dashboard'
//import axios from 'axios';
import Card from "@mui/material/Card";
import { axiosInstance2 } from 'src/utils/axios';
import { shadows } from 'src/theme/shadows';
import MockData from 'src/sections/evaluations/report/real-data/individual_evaluation.json'


interface SurveyVisualizationTabsProps {
    evaluation_id: string;
    exportMode: boolean;
    onImagesCaptured?: any;
    // onSurveyLoaded: any;
    // setTotalSurveys: any;
}


const SurveyVisualizationTabs = forwardRef(({ evaluation_id, exportMode, onImagesCaptured}: SurveyVisualizationTabsProps, ref) => {
    // const [value, setValue] = useState<number | false>(false); // initialized to false
    const [value, setValue] = useState<number>(0);
    const [surveys, setSurveys] = useState<any[]>([]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        const fetchSurveys = async () => {
        try {
            //const response = await axiosInstance2.get(`/evaluation/${evaluation_id}`);
            const response = MockData;
            if (response.success && response.data.surveys.length > 0) {
                setSurveys(response.data.surveys);
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

    const renderSurveyTabPanels = () => {
        
        return surveys.map((survey, index) => (
            <div
                role="tabpanel"
                hidden={!exportMode && value !== index} // Hide in non-export mode when not selected
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                key={survey.survey_id}
            >
                {/* Render SurveyDashboard for each survey in export mode, or for the selected one in normal mode */}
                {(exportMode || value === index) && (
                    <div id={`survey-dashboard-${index}`} className="sa-question">
                    <SurveyDashboard
                    evaluation_id={evaluation_id} 
                    survey_index={String(index)} 
                    />
                    </div>
                )}
            </div>
        ));
    };

    return (
        surveys.length > 0 ? (
            <>
                <Card sx={{ borderBottom: 1, borderColor: 'divider', borderRadius: 1, px: 2, boxShadow: shadows("light")[3] }}>
                    <Tabs value={value} onChange={handleChange} aria-label="survey tabs">
                        {surveys.map((survey, index) => (
                            <Tab label={survey.title} {...a11yProps(index)} key={survey.survey_id} />
                        ))}
                    </Tabs>
                </Card>
                {renderSurveyTabPanels()} 
            </>
        ) : (
            <Fragment />
        )
    );
});

export default SurveyVisualizationTabs;