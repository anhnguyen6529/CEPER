import ceperApi from "./api";

const HSBAApi = {
    getOneHSBAByPID: async (apiData) => 
        ceperApi.get(`/user/hsba/${apiData.pid}`),
    updateHSBA: async (apiData) => 
        ceperApi.put(`user/hsba/${apiData.pid}`, apiData)
}

export default HSBAApi;