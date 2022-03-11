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
        data: []
    },
    benhAn: {
        thoiGian: '',
        bacSiLamBenhAn: '',
    },
    lyDoVaoVien: {
        lyDo: '',
        ngayVaoVien: '',
        vaoNgayThu: '',
        chanDoanNoiGioiThieu: '',
        noiGioiThieu: ''
    },
    hoiBenh: {
        quaTrinhBenhLy: '',
        tienSu: {
            banThan: '',
            dacDiemLienQuanBenh: [
                { tt: '01', benh: 'Dị ứng', kyHieu: false, thoiGian: '' },
                { tt: '02', benh: 'Ma túy', kyHieu: false, thoiGian: '' },
                { tt: '03', benh: 'Rượu bia', kyHieu: false, thoiGian: '' },
                { tt: '04', benh: 'Thuốc lá', kyHieu: false, thoiGian: '' },
                { tt: '05', benh: 'Thuốc lào', kyHieu: false, thoiGian: '' },
                { tt: '06', benh: 'Khác', kyHieu: false, thoiGian: '' }
            ],
            giaDinh: ''
        }
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
    tomTatBenhAn: '',
    chanDoanBanDau: '',
    tongKetBenhAn: {
        thoiGian: '',
        bacSiDieuTri: ''
    },
    phuongPhapDieuTri: '',
    chanDoanKhiRaVien: {
        chanDoan: '',
        ngayRaVien: '',
    },
    tinhTrangRaVien: '',
    huongDieuTri: '',
    nguoiGiaoHoSo: '',
    nguoiNhanHoSo: '',
    phieuTDChucNangSong: {
        data: [],
    },
    toDieuTri: {
        data: [],
    },
    phieuChamSoc: {
        data: [],
    },
    phieuTDTruyenDich: {
        data: [],
    },
    phieuCongKhaiThuoc: {
        ngayThang: [],
        data: [],
    },
    danhSachYLenh: [],
    edited: {}
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
        },
        updateDinhKemSection: (state, action) => {
            return {
                ...state,
                [action.payload.section]: {
                    ...state[action.payload.section],
                    ...action.payload.value,
                    ...(!!action.payload.newData && { data: [...state[action.payload.section].data, action.payload.newData] } ),
                }
            }
        },
        addDanhSachYLenh: (state, action) => {
            return {
                ...state, 
                danhSachYLenh: [...state.danhSachYLenh, ...action.payload]
            }
        },
        updateDanhSachYLenh: (state, action) => {
            state.danhSachYLenh[action.payload.index] = { ...state.danhSachYLenh[action.payload.index], ...action.payload.value }
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
