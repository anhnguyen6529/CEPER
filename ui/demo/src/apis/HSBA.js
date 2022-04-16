import ceperApi from "./api";

const HSBAApi = {
    getOneHSBAByPID: async (apiData) => 
        ceperApi.get(`/user/hsba/${apiData.pid}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`} }),
}

export default HSBAApi;