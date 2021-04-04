import axios from 'axios';

const request = axios.create({
  timeout: 1000, // 超时时间
});
request.interceptors.response.use((res) => {
  // 原先默认情况是返回res，所以用到的数据是res.data.data
  // 现在直接返回res.data,所以用到的数据是res.data
  return res.data;
});

export default request;
