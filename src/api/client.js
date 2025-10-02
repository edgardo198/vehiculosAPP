import axios from 'axios';

const baseURL = import.meta.env?.VITE_API_URL || '/api';
console.log('BASE_URL ->', baseURL);

const api = axios.create({ baseURL });
export default api;


