import axios from 'axios';

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 10000, // 超时时间
  withCredentials: true,
});
request.interceptors.response.use((res) => {
  // 原先默认情况是返回res，所以用到的数据是res.data.data
  // 现在直接返回res.data,所以用到的数据是res.data
  return res.data;
});

export default request;
