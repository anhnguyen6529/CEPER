import ceperApi from "./api";

const spellingErrorApi = {
    getProcessResult: async (apiData) =>
        ceperApi.get(`/spelling-error/process-result`, { 
            params: { text: apiData }, 
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}  
        })
}

export default spellingErrorApi;