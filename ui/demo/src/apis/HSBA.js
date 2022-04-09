import ceperApi from "./api";

const HSBAApi = {
    getOneHSBAByPID: async (apiData) => 
        ceperApi.get(`/user/hsba/${apiData.pid}`),
}

export default HSBAApi;