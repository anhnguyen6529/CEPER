import axios from "axios";

export const DOMAIN_URL = 'http://localhost:5000';

const ceperApi = axios.create({
    baseURL: DOMAIN_URL,
});

export default ceperApi;