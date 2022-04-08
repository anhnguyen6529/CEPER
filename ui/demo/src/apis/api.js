import axios from "axios";

const ceperApi = axios.create({
    baseURL: `http://localhost:5000`
});

export default ceperApi;