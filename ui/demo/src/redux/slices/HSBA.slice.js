import { createSlice } from "@reduxjs/toolkit";
import HSBAThunk from "../thunks/HSBA.thunk";

const initialState = {
    loading: true,
    error: '',
    pid: '',
    khoa: '',
    giuong: '',
    phong: '',
    hanhChinh: {
        hoTen: '',
        ngaySinh: '',
        gioiTinh: '',
        ngheNghiep: '',
        noiLamViec: '',
        quocTich: '',
        danToc: '',
        soCCCD: '',
        doiTuong: '',
        dienThoai: '',
        soNha: '',
        thonPho: '',
        phuongXa: '',
        tinhTP: '',
        quanHuyen: '',
        soTheBHYT: '',
        noiDangKyKCBBanDau: '',
        giaTriTu: '',
        giaTriDen: '',
        nguoiNha: {
            hoTen: '',
            diaChi: '',
            dienThoai: '',
            quanHeVoiBenhNhan: '',
        }
    },
    phieuTDDiUngThuoc: {
        thuocDiUng: '',
        kieuDiUng: '',
        benhKemTheo: '',
    },
    lyDoVaoVien: {
        lyDo: '',
        ngayVaoVien: '',
        vaoNgayThu: '',
        chanDoanNoiGioiThieu: '',
        noiGioiThieu: ''
    },
    hoiBenh: {
        tienSu: '',
        benhSu: '',
    },
    khamBenh: {
        khamToanThan: '',
        tuanHoan: '',
        hoHap: '',
        tieuHoa: '',
        than: '',
        thanKinh: '',
        coXuongKhop: '',
        taiMuiHong: '',
        rangHamMat: '',
        mat: '',
        noiTiet: '',
    },
    chanDoanBanDau: '',
    phuongPhapDieuTri: '',
    chanDoanKhiRaVien: {
        chanDoan: '',
        ngayRaVien: '',
    },
    tomTatBenhAn: '',
    phieuTDChucNangSong: {
        data: [],
    },
    toDieuTri: {
        data: [],
    },
    phieuChamSoc: {
        data: [],
    }
}

const HSBASlice = createSlice({
    name: 'HSBASlice',
    initialState,
    reducers: {
        updateBenhNhanSection: (state, action) => {
            action.payload.map((field) => {
                return state.hanhChinh[field.name] = field.value;
            })
        },
        updateBacSiSection: (state, action) => {
            return {
                ...state,
                [action.payload.section]: action.payload.data
            }
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(HSBAThunk.getOneHSBAByPID.fulfilled, (state, action) => {
            return {
                ...state,
                error: '',
                loading: false,
                ...action.payload
            }
        })
        .addCase(HSBAThunk.getOneHSBAByPID.pending, (state) => {
            return {
                ...state,
                loading: true
            }
        })
        .addCase(HSBAThunk.getOneHSBAByPID.rejected, (state, action) => {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        })
    }
})

export const HSBAReducer = HSBASlice.reducer;
export const HSBAActions = HSBASlice.actions;

export default HSBASlice;
