import { createContext } from "react";

export const initialErrors = {
    "Lý do vào viện": {
        lyDo: true,
        vaoNgayThu: true,
        noiGioiThieu: true
    },
    "Hỏi bệnh": {
        quaTrinhBenhLy: true
    },
    "Chẩn đoán ban đầu": true,
    "Phương pháp điều trị": true,
    "Chẩn đoán khi ra viện": {
        chanDoan: true,
        ngayRaVien: true
    },
    "Tình trạng người bệnh ra viện": true
}

const HSBAContext = createContext({});

export const HSBAProvider = HSBAContext.Provider;
export const HSBAConsumer = HSBAContext.Consumer;

export default HSBAContext;