// create custom axios instance with bearer token
import axios from 'axios';
import { getCookie, getCookies } from 'cookies-next';

const customAxios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

customAxios.interceptors.request.use(async (config) => {
  const token = getCookie('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default customAxios;
