import axios from "axios";
import { DOMAIN_URL } from "./api";

const authApi = {
    login: async (apiData) => 
        axios.post(`${DOMAIN_URL}/login`, apiData),
    logout: async () =>
        axios.get(`${DOMAIN_URL}/logout`)
}

export default authApi;