import axios from "axios";
import ceperApi, { DOMAIN_URL } from "./api";

const authApi = {
    login: async (apiData) => 
        axios.post(`${DOMAIN_URL}/login`, apiData),
    logout: async () =>
        axios.get(`${DOMAIN_URL}/logout`),
    getNotifications: async (apiData) => 
        ceperApi.get(`/users/${apiData.userID}/notifications`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`} }),
    markNotificationSeen: async (apiData) => 
        ceperApi.get(`/users/${apiData.userID}/notifications/${apiData.notificationID}`, { 
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`} 
        }),
}

export default authApi;