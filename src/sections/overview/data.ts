import useSWR from 'swr';
import { useMemo, useEffect, useState } from 'react';
import axios from 'axios';

import { fetcher2, endpoints } from 'src/utils/axios';
import { EvaluationItemStatus } from 'src/types/evaluation';

// https://www.youtube.com/watch?v=QZNloKwHxPo

// export const axiosInstance2 = axios.create({ baseURL: BACKEND_API }); //All requests made using axiosInstance will be prefixed with BACKEND_API.
// const BACKEND_API = "http://api.linghangxiong.com"

// axiosInstance2.interceptors.request.use(req => {
//   // req.headers.token = localStorage.getItem("accessToken")
//   // return req
//   const accessToken = localStorage.getItem("accessToken");
//   console.log("Access Token:", accessToken); 
//   req.headers.token = accessToken;
//   return req;
// })

// export const fetcher2 = async (args: string | [string, AxiosRequestConfig]) => {
//     const [url, config] = Array.isArray(args) ? args : [args];
//     console.log("url: ", url);
//     const res = await axiosInstance2.get(url, { ...config }); //perform GET with the token attached
//     return res.data;
//   };

// const fetcher = (...args)=>fetch(...args).then(response=>response.json);
// //...args is the url you want to use


export function getEvaluations() {
  
    //useSWR is a library that provides "data","isLoading", "error", etc
    //what does eval_data look like? refer to list_evaluations_summary.json
    const { data: eval_data, isLoading: isLoading1, error } = useSWR("/evaluation/list_evaluations", fetcher2); 

    const { data: ranking_data, isLoading: isLoading2, error: error2 } = useSWR("/school/list_schools", fetcher2);
  
    //useMemo: This hook memoizes the returned value to prevent unnecessary recalculations on each render 
    // unless the dependencies change.
    const memoizedValue = useMemo(
      () => ({
        data: {
            list_evaluations: (eval_data?.data.evaluations as EvaluationItemStatus[]) || [],
            rankings: ranking_data?.data || [],
        },
        isLoading: isLoading1 || isLoading2
      }),
      [eval_data?.data, error, isLoading1 || isLoading2, error2]
    );

    console.log("Memoized Value:", memoizedValue); // Log the memoized value
  
    return memoizedValue; //returns the memoized value containing the combined data and loading state.
  }


  //the traditional useEffect approach
  function getEvaluationsUseEffect() {
    const [evalData, setEvalData] = useState([]);
    const [rankingData, setRankingData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const evalResponse = await axios.get("/evaluation/list_evaluations");
          setEvalData(evalResponse.data);
          const rankingResponse = await axios.get("/school/list_schools");
          setRankingData(rankingResponse.data);
        } catch (err) {
          setError(err);
        }
        setIsLoading(false);
      };
  
      fetchData();
    }, []);
  
    return { data: { evaluations: evalData, rankings: rankingData }, isLoading, error };
  }
  

