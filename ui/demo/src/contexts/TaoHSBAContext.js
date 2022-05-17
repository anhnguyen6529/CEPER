import { createContext } from "react";

export const initialValues = {
    pid: "",
    avatar: "",
    ngayVaoVien: null,
    khoa: "",
    phong: "",
    giuong: "",
    mach: "",
    nhietDo: "",
    huyetAp: ["", ""],
    nhipTho: "",
    canNang: "",
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
        quanHeVoiBenhNhan: "",
        soCCCD: ""
    },
    bacSiPhuTrach: {
        id: "",
        name: ""
    }
}

export const initialErrors = {
    pid: "",
    avatar: "",
    ngayVaoVien: "Vui lòng nhập Ngày vào viện",
    khoa: "",
    phong: "Vui lòng nhập Phòng",
    giuong: "Vui lòng nhập Giường",
    mach: "Vui lòng nhập Mạch",
    nhietDo: "Vui lòng nhập Nhiệt độ",
    huyetAp: "Vui lòng nhập Huyết áp",
    nhipTho: "Vui lòng nhập Nhịp thở",
    canNang: "Vui lòng nhập Cân nặng",
    hoTen: "Vui lòng nhập Họ và tên",
    ngaySinh: "Vui lòng nhập Ngày sinh",
    gioiTinh: "Vui lòng nhập Giới tính",
    ngheNghiep: "",
    danToc: "",
    quocTich: "",
    soCCCD: "",
    dienThoai: "",
    noiLamViec: "",
    soNha: "",
    thonPho: "",
    phuongXa: "Vui lòng nhập Phường/Xã",
    quanHuyen: "Vui lòng nhập Quận/Huyện",
    tinhTP: "Vui lòng nhập Tỉnh/Thành phố",
    doiTuong: "Vui lòng nhập Đối tượng",
    soTheBHYT: "",
    noiDangKyKCBBanDau: "",
    giaTriTu: "",
    giaTriDen: "",
    nguoiNha: {
        hoTen: "",
        diaChi: "",
        dienThoai: "",
        quanHeVoiBenhNhan: "",
        soCCCD: ""
    },
    bacSiPhuTrach: "Vui lòng nhập Bác sĩ phụ trách"
}

const TaoHSBAContext = createContext({});

export const TaoHSBAProvider = TaoHSBAContext.Provider;
export const TaoHSBAConsumer = TaoHSBAContext.Consumer;

export default TaoHSBAContext;