import axios from 'axios';

export const api = axios.create({
    //baseURL: 'http://192.168.0.13:3333',
    //baseURL: 'https://bolao-copa.mhsw.com.br/',
    baseURL: 'https://server-copa22.vercel.app/',
    timeout: 4000,
})