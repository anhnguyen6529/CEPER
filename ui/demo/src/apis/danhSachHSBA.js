import ceperApi from "./api";

const danhSachHSBAApi = {
    getNewPID: async () => 
        ceperApi.get(`/user/danhSachHSBA/newPID`),
    getDanhSachHSBA: async (apiData) =>
        ceperApi.get(`user/danhSachHSBA`, { params: { doctorID: apiData.doctorID }}),
    createNewHSBA: async (apiData) => 
        ceperApi.post(`user/danhSachHSBA/createHSBA`, apiData)
}

export default danhSachHSBAApi;