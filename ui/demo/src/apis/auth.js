import axios from "axios";
import ceperApi, { DOMAIN_URL } from "./api";

const authApi = {
    login: async (apiData) => 
        axios.post(`${DOMAIN_URL}/login`, apiData),
    logout: async () =>
        axios.get(`${DOMAIN_URL}/logout`),
    getNotifications: async (apiData) => 
        ceperApi.get(`/user/${apiData.userID}/notifications`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`} }),
    markNotificationSeen: async (apiData) => 
        ceperApi.get(`/user/${apiData.userID}/notifications/${apiData.notificationID}`, { 
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`} 
        }),
    changeAccentColor: async (apiData) => 
        ceperApi.get(`/user/${apiData.userID}/settings/appearance/accent-color`, {
            params: { color: apiData.color },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`} 
        }),
    toggleAutoUpdateWithProcessResult: async (apiData) => 
        ceperApi.get(`/user/${apiData.userID}/settings/functionality/auto-update-with-process-result`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`} 
        })
}

export default authApi;