import ceperApi from "./api";

const danhSachHSBAApi = {
    getNewPID: async () => 
        ceperApi.get(`/user/danh-sach-hsba/new-pid`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`} }),
    getDanhSachHSBA: async (apiData) => 
        ceperApi.get(`/user/danh-sach-hsba`, { 
            params: { doctorID: apiData.doctorID }, 
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
        }),
    createNewHSBA: async (apiData) => 
        ceperApi.post(`/user/danh-sach-hsba`, apiData, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`} })
}

export default danhSachHSBAApi;