import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher2, endpoints, axiosInstance2 } from 'src/utils/axios';
import { EvaluationItemDetails, Metric, MetricReport } from 'src/types/evaluation';
import {SurveyData} from 'src/sections/eval-report/report/survey-panel';
import axios, { AxiosRequestConfig } from 'axios';
import { HOST_API } from 'src/config-global';

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);


export function getSurveyData(evaluation_id: string, survey_index: number, token?: string){

    const customFetcher = async (args: string | [string, AxiosRequestConfig]) => {
        const [url, config] = Array.isArray(args) ? args : [args];
    
        const res = await axiosInstance.get(url, {...config, headers: {
            token: token
        }});
    
        return res.data;
    };

    const { data, isLoading: isLoading, error: error1, mutate } = useSWR(`/survey/get_survey_and_responses/${evaluation_id}/${survey_index}`, token ? customFetcher : fetcher2);
    const memoizedValue = useMemo(
        () => ({
          surveyData: (data?.data as SurveyData) || null,
          isLoading: isLoading,
        }),
        [data, isLoading, error1]
      );
    return {...memoizedValue, mutate};
}

// Use separate file for processing data from backend
export function getReportData(eval_id: string, token?: string) {

    const customFetcher = async (args: string | [string, AxiosRequestConfig]) => {
        const [url, config] = Array.isArray(args) ? args : [args];
    
        const res = await axiosInstance.get(url, {...config, headers: {
            token: token
        }});
    
        return res.data;
    };
  
    const { data, isLoading: isLoading, error: error1, mutate } = useSWR(`/evaluation/${eval_id}/metric_report`, token ? customFetcher : fetcher2);
    const { data: eval_data, isLoading: isLoadingEval, error: error2 } = useSWR(`/evaluation/${eval_id}`, token ? customFetcher : fetcher2);
    let overallScore = 0

    if (data) {
        const metricReport = data?.data as MetricReport
        let surveyScore: number | null = metricReport.survey.score ? metricReport.survey.score*100 : null
        let nonemptyScores = [metricReport.class.stats.overall, metricReport.prep.stats.overall,  surveyScore].filter(x => x !== null && x !== undefined) as number[]
        overallScore = nonemptyScores.length > 0 ? Math.round(nonemptyScores.reduce((a, b) => a + b, 0) / nonemptyScores.length) : 0
    }

    let classTotal = 0, classExpected = 0, prepTotal = 0, prepExpected = 0, otherTotal = 0, otherExpected = 0
    if (eval_data?.data) {
        const classMetrics = eval_data.data.class_metrics as Metric[] | null
        const prepMetrics = eval_data.data.prep_metrics as Metric[] | null
        const otherMetrics = eval_data.data.other_metrics as Metric[] | null
        classMetrics?.forEach(m => {
            classExpected += m.target_responses ?? 0
            let maxResponses = 0
            if (m.target_responses) {
                maxResponses = m.target_responses
                if (m.target_responses===0) maxResponses = m.total_responses
            } else {
                maxResponses = m.total_responses
            }
            classTotal += Math.min(m.total_responses, maxResponses)
        })
        prepMetrics?.forEach(m => {
            prepExpected += m.target_responses ?? 0
            let maxResponses = 0
            if (m.target_responses) {
                maxResponses = m.target_responses
                if (m.target_responses===0) maxResponses = m.total_responses
            } else {
                maxResponses = m.total_responses
            }
            prepTotal += Math.min(m.total_responses, maxResponses)
        })
        otherMetrics?.forEach(m => {
            otherExpected += m.target_responses ?? 0
            let maxResponses = 0
            if (m.target_responses) {
                maxResponses = m.target_responses
                if (m.target_responses===0) maxResponses = m.total_responses
            } else {
                maxResponses = m.total_responses
            }
            otherTotal += Math.min(m.total_responses, maxResponses)
        })
    }

    const memoizedValue = useMemo(
        () => ({
            reportData: (data?.data as MetricReport) || undefined,
            metaData: {
                classTotal, classExpected, prepTotal, prepExpected, otherTotal, otherExpected
            },
            isLoading: isLoading || isLoadingEval,
            overallScore: overallScore,
            evalData: eval_data?.data as EvaluationItemDetails
        }),
        [data?.data, eval_data?.data, error1, error2, isLoading || isLoadingEval]
    );
  
    return {...memoizedValue, mutate};
  }


  export async function requestReport(pageUrl: string, token: string | null) {
    const result = await axiosInstance2.post("/generate-eval-report", {
      url: pageUrl, 
      token: token
    }, {
      responseType: 'arraybuffer', 
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return result;
  }

