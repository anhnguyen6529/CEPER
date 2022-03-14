import { createSlice } from "@reduxjs/toolkit";
import HSBAThunk from "../thunks/HSBA.thunk";

const initialState = {
    loading: true,
    update: false,
    save: false,
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
    toDieuTri: {
        data: [{ ngayGio: '', dienBienBenh: '', yLenh: '', bacSiGhi: '' }],
    },
    phieuChamSoc: {
        data: [{ ngay: '', gio: '', theoDoiDienBien: [], thucHienYLenh: [], xacNhan: [], dieuDuongGhi: '' }],
    },
    phieuTDTruyenDich: {
        data: [{ ngayThang: '', values: [{ tenDichTruyen: '', soLuong: 0, loSanXuat: '', tocDo: 0, thoiGianBatDau: '', thoiGianKetThuc: '', BSChiDinh: '', DDThucHien: '' }] }],
    },
    phieuTDChucNangSong: {
        data: [{ ngayGio: '', mach: 0, nhietDo: 0, huyetAp: '', nhipTho: 0, canNang: 0, dieuDuongGhi: '' }],
    },
    phieuTDDiUngThuoc: {
        data: [{ ngayGioDungThuoc: '', thuocDiUng: [], kieuDiUng: '', bieuHienLamSang: '', bacSiXacNhan: '', ghiChu: '' }]
    },
    phieuCongKhaiThuoc: {
        ngayThang: [],
        data: [{ tenThuoc: '', donVi: '', ngayThang: [], tongSo: 0, donGia: 0, thanhTien: 0, ghiChu: '' }],
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
        updatePhieuCongKhaiThuoc: (state, action) => { 
            state.phieuCongKhaiThuoc.ngayThang = action.payload.value.ngayThang;
            action.payload.newData.forEach((data) => {
                const index = state.phieuCongKhaiThuoc.data.map(d => d.tenThuoc).findIndex(d => d === data.tenThuoc);
                if (index === -1) {
                    state.phieuCongKhaiThuoc.data = [...state.phieuCongKhaiThuoc.data, data];
                } else {
                    state.phieuCongKhaiThuoc.data[index] = { 
                        ...state.phieuCongKhaiThuoc.data[index],
                        ngayThang: data.ngayThang.map((nth, id) => id < state.phieuCongKhaiThuoc.data[index].ngayThang.length
                            ? nth + state.phieuCongKhaiThuoc.data[index].ngayThang[id] : nth),
                        tongSo: data.tongSo + state.phieuCongKhaiThuoc.data[index].tongSo, 
                        thanhTien: data.thanhTien + state.phieuCongKhaiThuoc.data[index].thanhTien,
                        ghiChu: state.phieuCongKhaiThuoc.data[index].ghiChu.concat(`\n${data.ghiChu}`)
                    };
                }
            });
        },
        addDanhSachYLenh: (state, action) => {
            return {
                ...state, 
                danhSachYLenh: [...state.danhSachYLenh, ...action.payload]
            }
        },
        updateDanhSachYLenh: (state, action) => {
            state.danhSachYLenh[action.payload.index] = { ...state.danhSachYLenh[action.payload.index], ...action.payload.value }
        },
        save: (state) => {
            return {
                ...state,
                save: true
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
