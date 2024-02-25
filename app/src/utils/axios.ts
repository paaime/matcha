import axios from 'axios';

const customAxios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default customAxios;
