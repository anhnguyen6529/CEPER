import ceperApi from "./api";

const HSBAApi = {
    getOneHSBAByPID: async (apiData) => 
        ceperApi.get(`/user/HSBA/${apiData.pid}`),
}

export default HSBAApi;