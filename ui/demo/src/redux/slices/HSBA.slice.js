import { createSlice } from "@reduxjs/toolkit";
import HSBAThunk from "../thunks/HSBA.thunk";

const ATTACHED_FIELDS = ["toDieuTri", "phieuChamSoc", "phieuTDTruyenDich", "phieuTDChucNangSong", "phieuTDDiUngThuoc", "phieuCongKhaiThuoc"];

export const initialHSBAState = {
    pid: '',
    avatar: '',
    trangThai: '',
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
            soCCCD: ''
        }
    },
    benhAn: {
        thoiGian: '',
        bacSiLamBenhAn: {
            id: '',
            name: ''
        },
    },
    lyDoVaoVien: {
        lyDo: '',
        ngayVaoVien: '',
        vaoNgayThu: 0,
        chanDoanNoiGioiThieu: '',
        noiGioiThieu: ''
    },
    hoiBenh: {
        quaTrinhBenhLy: '',
        tienSu: {
            banThan: '',
            dacDiemLienQuanBenh: [
                { tt: '01', benh: 'Dị ứng', kyHieu: false, diNguyen: [''], thoiGian: [0] },
                { tt: '02', benh: 'Ma túy', kyHieu: false, thoiGian: 0 },
                { tt: '03', benh: 'Rượu bia', kyHieu: false, thoiGian: 0 },
                { tt: '04', benh: 'Thuốc lá', kyHieu: false, thoiGian: 0 },
                { tt: '05', benh: 'Thuốc lào', kyHieu: false, thoiGian: 0 },
                { tt: '06', benh: [''], kyHieu: false, thoiGian: [0] }
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
        bacSiDieuTri: {
            id: '',
            name: ''
        }
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
    toDieuTri: {
        data: [] //[{ ngayGio: '', khoaDieuTri: '', chanDoan: '', dienBienBenh: '', yLenh: '', bacSiGhi: '' }],
    },
    phieuChamSoc: {
        data: [] //[{ ngayGio: '', khoa: '', theoDoiDienBien: [''], thucHienYLenh: [''], xacNhan: [''], dieuDuongGhi: '' }],
    },
    phieuTDTruyenDich: {
        data: [] //[{ ngayThang: '', khoa: '', values: [{ tenDichTruyen: '', soLuong: 0, loSanXuat: '', tocDo: 0, thoiGianBatDau: '', thoiGianKetThuc: '', BSChiDinh: '', DDThucHien: '' }] }],
    },
    phieuTDChucNangSong: {
        data: [] //[{ ngayGio: '', khoa: '', mach: 0, nhietDo: 0, huyetAp: '', nhipTho: 0, canNang: 0, dieuDuongGhi: '' }],
    },
    phieuTDDiUngThuoc: {
        data: [] //[{ ngayGioDungThuoc: '', khoa: '', thuocDiUng: [''], kieuDiUng: '', bieuHienLamSang: '', bacSiXacNhan: '', ghiChu: '' }]
    },
    phieuCongKhaiThuoc: {
        ngayThang: [],
        data: [] //[{ tenThuoc: '', donVi: '', ngayThang: [''], tongSo: 0, donGia: 0, thanhTien: 0, ghiChu: '' }],
    },
    danhSachYLenh: [] //[{ khoa: '', yLenh: '', xacNhan: '' }]
}

const initialState = {
    loading: true,
    updating: false,
    confirmUpdate: false,
    attachedSecUpdated: false, 
    setting: false,
    loadingError: '',
    settingError: '',
    transfering: false,
    transferingError: '',
    updatingRoomBed: false,
    updatingRoomBedError: false,
    ...initialHSBAState
}

const HSBASlice = createSlice({
    name: 'HSBASlice',
    initialState,
    reducers: {
        updateSection: (state, action) => {
            return {
                ...state,
                [action.payload.section]: action.payload.data
            }
        },
        openClinicalAttachedSection: (state, action) => {
            state[action.payload.section] = { ...state[action.payload.section], updated: false };
        },
        updateAttachedSection: (state, action) => {
            state[action.payload.section] = { ...state[action.payload.section], ...action.payload.value, data: action.payload.newData, updated: true };
            if (ATTACHED_FIELDS.filter(field => field !== action.payload.section).every(section => 
            typeof state[section].updated === 'undefined' || state[section].updated)) {
                state.attachedSecUpdated = true;
            }
        },
        update: (state) => {
            return {
                ...state,
                updating: true
            }
        },
        confirmUpdate: (state) => {
            return {
                ...state,
                updating: false, 
                confirmUpdate: true
            }
        },
        resetState: (state) => {
            return {
                ...state, 
                updating: false,
                confirmUpdate: false,
                setting: false
            }
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(HSBAThunk.getOneHSBAByPID.fulfilled, (state, action) => {
            if (action.payload.token) {
                localStorage.setItem('token', action.payload.token);
                delete action.payload.token
            }
            
            return {
                ...state,
                loadingError: '',
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
                loadingError: action.payload
            }
        })
        .addCase(HSBAThunk.updateHSBA.pending, (state) => {
            return {
                ...state,
                setting: true
            }
        })
        .addCase(HSBAThunk.updateHSBA.fulfilled, (state) => {
            return {
                ...state,
                setting: false,
                settingError: ''
            }
        })
        .addCase(HSBAThunk.updateHSBA.rejected, (state, action) => {
            return {
                ...state,
                setting: false,
                settingError: action.payload
            }
        })
        .addCase(HSBAThunk.transferFaculty.pending, (state) => {
            return {
                ...state,
                transfering: true
            }
        })
        .addCase(HSBAThunk.transferFaculty.fulfilled, (state, action) => {
            const { khoa, phong, giuong } = action.payload
            return {
                ...state,
                transfering: false,
                transferingError: '',
                khoa: khoa,
                phong: phong,
                giuong: giuong
            }
        })
        .addCase(HSBAThunk.transferFaculty.rejected, (state, action) => {
            return {
                ...state,
                transfering: false,
                transferingError: action.payload
            }
        })
        .addCase(HSBAThunk.updateSickRoomBed.pending, (state) => {
            return {
                ...state,
                updatingRoomBed: true
            }
        })
        .addCase(HSBAThunk.updateSickRoomBed.fulfilled, (state, action) => {
            const { phong, giuong } = action.payload
            return {
                ...state,
                updatingRoomBed: false,
                updatingRoomBedError: '',
                phong: phong,
                giuong: giuong
            }
        })
        .addCase(HSBAThunk.updateSickRoomBed.rejected, (state, action) => {
            return {
                ...state,
                updatingRoomBed: false,
                updatingRoomBedError: action.payload
            }
        })
    }
})

export const HSBAReducer = HSBASlice.reducer;
export const HSBAActions = HSBASlice.actions;

export default HSBASlice;
