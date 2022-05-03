import ceperApi from "./api";

const HSBAApi = {
    getOneHSBAByPID: async (apiData) => 
        ceperApi.get(`/user/hsba/${apiData.pid}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`} }),
    updateHSBA: async (apiData) => 
        ceperApi.post(`user/hsba/${apiData.pid}`, apiData, { headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        } })
}

export default HSBAApi;