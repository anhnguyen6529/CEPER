import ceperApi from "./api";

const HSBAApi = {
    getOneHSBAByPID: async (apiData) => 
        ceperApi.get(`/user/hsba/${apiData.pid}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`} }),
    updateHSBA: async (apiData) => 
        ceperApi.post(`/user/hsba/${apiData.pid}`, apiData, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
    transferFaculty: async (apiData) => 
        ceperApi.post(`/user/hsba/${apiData.pid}/transfer-faculty`, apiData, { 
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`} 
        })
}

export default HSBAApi;