import ceperApi from "./api";

const authApi = {
    login: async (apiData) => 
        ceperApi.post('/login', apiData),
    logout: async () =>
        ceperApi.get('/logout')
}

export default authApi;