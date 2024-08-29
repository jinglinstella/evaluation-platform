import axios, { AxiosRequestConfig } from 'axios';

import { HOST_API, BACKEND_API } from 'src/config-global';
// export const HOST_API = "http://api.linghangxiong.com"
// export const BACKEND_API = "http://api.linghangxiong.com"

// //This interceptor handles responses received from the server.
export const axiosInstance2 = axios.create({ baseURL: BACKEND_API }); //All requests made using axiosInstance will be prefixed with BACKEND_API.
axiosInstance2.interceptors.response.use( 
  (res) => res, //The first function is called on a successful response, simply passing the response through unchanged.
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
  //The second function is called on an error response. It extracts and rejects the error response's data if available; 
  //otherwise, it rejects with a generic error message ('Something went wrong').
);

// This interceptor handles outgoing requests.
axiosInstance2.interceptors.request.use(req => { 
  const accessToken = localStorage.getItem("accessToken");
  console.log("Access Token:", accessToken); 
  const accessToken2="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3MTY5MzI1NzYsImV4cCI6MTcxOTAwNjE3Nn0.RiHM-PHpBWW21LtbdmBrqvVJPKfE4XmLAQU-Waoy5GM"
  req.headers.token = accessToken2; //It retrieves an access token from localStorage and attaches it to the token header of every request.
  return req;
})

//This function is a utility to make GET requests using axiosInstance2.
export const fetcher2 = async (args: string | [string, AxiosRequestConfig]) => { 
  //args can be either a string (the URL) or an array containing the URL and additional Axios configuration options.
  const [url, config] = Array.isArray(args) ? args : [args]; //destructures args into url and config
  console.log(`Fetching data from ${url}`);
  const res = await axiosInstance2.get(url, { ...config });//It makes a GET request to the specified url with any additional config options.
  //The reason axiosInstance2 is able to make a successful GET request to the URL 
  //is due to the token being attached to the request header in the request interceptor. 
  return res.data;
};

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/authentication/me',
    login: '/authentication/login',
    register: '/authentication/register',
    // me: '/api/auth/me',
    // login: '/api/auth/login',
    // register: '/api/auth/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};