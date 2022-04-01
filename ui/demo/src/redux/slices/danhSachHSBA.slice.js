import { createSlice } from "@reduxjs/toolkit";
import danhSachHSBAThunk from "../thunks/danhSachHSBA.thunk";

const initialState = {
    hienTai: [
        { 
            pid: '123456', 
            avatar: '',
            trangThai: 'Đã khám',
            hoTen: 'Nguyễn Văn A',
            tuoi: 25,
            gioiTinh: 'Nam',
            khoa: 'Cấp cứu',
            phong: '302',
            giuong: '08',
            benhDieuTri: 'Sốt nhiễm siêu vi ngày 4',
            tinhTrangHienTai: 'Giảm đau đầu, hạ sốt',
            ngayVaoVien: '2021-11-08 14:00'
        },
        { 
            pid: '102345', 
            avatar: '',
            trangThai: 'Đã khám',
            hoTen: 'Nguyễn Thị B',
            tuoi: 22,
            gioiTinh: 'Nữ',
            khoa: 'Khám bệnh',
            phong: '201',
            giuong: '02',
            benhDieuTri: 'Rối loạn tiêu hoá',
            tinhTrangHienTai: 'Đỡ',
            ngayVaoVien: '2021-06-07 08:30'
        },
        { 
            pid: '200001', 
            avatar: '',
            trangThai: 'Đã khám',
            hoTen: 'Phạm Quang C',
            tuoi: 31,
            gioiTinh: 'Nam',
            khoa: 'Cấp cứu',
            phong: '302',
            giuong: '04',
            benhDieuTri: 'Đau tim',
            tinhTrangHienTai: 'Không thay đổi',
            ngayVaoVien: '2021-10-20 09:20'
        },
        { 
            pid: '165423', 
            avatar: '',
            trangThai: 'Đã khám',
            hoTen: 'Lê Thị D',
            tuoi: 29,
            gioiTinh: 'Nữ',
            khoa: 'Hô hấp',
            phong: '102',
            giuong: '06',
            benhDieuTri: 'Suy hô hấp',
            tinhTrangHienTai: 'Diễn biến nặng hơn',
            ngayVaoVien: '2021-12-12 15:40',
        }
    ],
    raVien: [
        {
            pid: '143256', 
            avatar: '',
            trangThai: 'Đã ra viện',
            khoa: 'Cấp cứu',
            hoTen: 'Trần Văn A',
            tuoi: 27,
            gioiTinh: 'Nam',
            ngayVaoVien: '2021-08-04 18:50',
            ngayRaVien: '2021-06-18 18:50',
            chanDoanKhiRaVien: 'Sốt siêu vi',
            tinhTrangRaVien: 'Đỡ, giảm'
        },
        {
            pid: '132456', 
            avatar: '',
            trangThai: 'Đã ra viện',
            khoa: 'Nhi',
            hoTen: 'Nguyễn Thị B',
            tuoi: 9,
            gioiTinh: 'Nữ',
            ngayVaoVien: '2021-06-12 10:10',
            ngayRaVien: '2021-06-15 10:10',
            chanDoanKhiRaVien: 'Viêm dạ dày ruột',
            tinhTrangRaVien: 'Khỏi'
        },
    ],
    creatingMode: false,
    creatingHSBA: false,
    creatingHSBAError: ''
}

const danhSachHSBASlice = createSlice({
    name: 'danhSachHSBA',
    initialState,
    reducers: {
        setCreatingMode: (state, action) => {
            state.creatingMode = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(danhSachHSBAThunk.createNewHSBA.pending, (state) => {
            return {
                ...state,
                creatingHSBA: true
            }
        })
        .addCase(danhSachHSBAThunk.createNewHSBA.fulfilled, (state, action) => {
            return {
                ...state,
                creatingHSBA: false,
                creatingHSBAError: '',
                hienTai: [action.payload, ...state.hienTai],
                creatingMode: false
            }
        })
        .addCase(danhSachHSBAThunk.createNewHSBA.rejected, (state, action) => {
            return {
                ...state,
                creatingHSBA: false,
                creatingHSBAError: action.payload
            }
        })
    }
})

export const danhSachHSBAReducer = danhSachHSBASlice.reducer;
export const danhSachHSBAActions = danhSachHSBASlice.actions;

export default danhSachHSBASlice;