import ceperApi from "./api";

const danhSachHSBAApi = {
    getNewPID: async () => 
        ceperApi.get(`/user/danh-sach-hsba/new-pid`),
    getDanhSachHSBA: async (apiData) =>
        ceperApi.get(`/user/danh-sach-hsba`, { params: { doctorID: apiData.doctorID }}),
    createNewHSBA: async (apiData) => 
        ceperApi.post(`/user/danh-sach-hsba`, apiData)
}

export default danhSachHSBAApi;