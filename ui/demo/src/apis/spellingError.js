import ceperApi from "./api";

const spellingErrorApi = {
    getProcessResult: async (apiData) =>
        ceperApi.get(`/spelling-error/process-result`, { params: { text: apiData } })
}

export default spellingErrorApi;