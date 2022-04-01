import { createContext } from "react";

export const requiredValues = [
    "ngayVaoVien", 
    "khoa", 
    "phong", 
    "giuong", 
    "mach",
    "nhietDo",
    "huyetAp",
    "nhipTho",
    "canNang",
    "hoTen",
    "ngaySinh",
    "gioiTinh",
    "ngheNghiep",
    "danToc",
    "soCCCD",
    "dienThoai",
    "doiTuong",
    "tinhTP",
    "quanHuyen",
    "phuongXa",
    "bacSiPhuTrach"
]

export const initialValues = {
    pid: "",
    avatar: null,
    ngayVaoVien: null,
    khoa: "",
    phong: "",
    giuong: "",
    mach: 0,
    nhietDo: 0,
    huyetAp: [0, 0],
    nhipTho: 0,
    canNang: 0,
    hoTen: "",
    ngaySinh: null,
    gioiTinh: "",
    ngheNghiep: "",
    danToc: "",
    quocTich: "Việt Nam",
    soCCCD: "",
    dienThoai: "",
    noiLamViec: "",
    soNha: "",
    thonPho: "",
    phuongXa: "",
    quanHuyen: "",
    tinhTP: "",
    doiTuong: "",
    soTheBHYT: "",
    noiDangKyKCBBanDau: "",
    giaTriTu: null,
    giaTriDen: null,
    nguoiNha: {
        hoTen: "",
        diaChi: "",
        dienThoai: "",
        quanHeVoiBenhNhan: ""
    },
    bacSiPhuTrach: {
        id: "",
        name: ""
    }
}

const TaoHSBAContext = createContext({});

export const TaoHSBAProvider = TaoHSBAContext.Provider;
export const TaoHSBAConsumer = TaoHSBAContext.Consumer;

export default TaoHSBAContext;