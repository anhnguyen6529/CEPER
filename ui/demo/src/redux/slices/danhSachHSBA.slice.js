import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    hienTai: [
        { 
            pid: '123456', 
            hoTen: 'Nguyễn Văn A',
            ngaySinh: '1997-01-02',
            gioiTinh: 'Nam',
            khoa: 'Cấp cứu',
            phong: '302',
            giuong: '08',
            benhDieuTri: 'Sốt nhiễm siêu vi ngày 4',
            tinhTrangHienTai: 'Giảm đau đầu, hạ sốt',
            ngayVaoVien: '2021-11-08'
        },
        { 
            pid: '102345', 
            hoTen: 'Nguyễn Thị B',
            ngaySinh: '2000-01-20',
            gioiTinh: 'Nữ',
            khoa: 'Khám bệnh',
            phong: '201',
            giuong: '02',
            benhDieuTri: 'Rối loạn tiêu hoá',
            tinhTrangHienTai: 'Đỡ',
            ngayVaoVien: '2021-06-07'
        },
        { 
            pid: '200001', 
            hoTen: 'Phạm Quang C',
            ngaySinh: '1990-12-24',
            gioiTinh: 'Nam',
            khoa: 'Cấp cứu',
            phong: '302',
            giuong: '04',
            benhDieuTri: 'Đau tim',
            tinhTrangHienTai: 'Không thay đổi',
            ngayVaoVien: '2021-10-20'
        },
        { 
            pid: '165423', 
            hoTen: 'Lê Thị D',
            ngaySinh: '1992-04-06',
            gioiTinh: 'Nữ',
            khoa: 'Hô hấp',
            phong: '102',
            giuong: '06',
            benhDieuTri: 'Suy hô hấp',
            tinhTrangHienTai: 'Diễn biến nặng hơn',
            ngayVaoVien: '2021-12-12',
        }
    ],
    raVien: [
        {
            pid: '143256', 
            khoa: 'Cấp cứu',
            hoTen: 'Trần Văn A',
            ngaySinh: '1994-04-16',
            gioiTinh: 'Nam',
            ngayVaoVien: '2021-08-04',
            ngayRaVien: '2021-06-18',
            chanDoanKhiRaVien: 'Sốt siêu vi',
            ketQuaDieuTri: 'Đỡ, giảm'
        },
        {
            pid: '132456', 
            khoa: 'Nhi',
            hoTen: 'Nguyễn Thị B',
            ngaySinh: '2012-03-15',
            gioiTinh: 'Nữ',
            ngayVaoVien: '2021-06-12',
            ngayRaVien: '2021-06-15',
            chanDoanKhiRaVien: 'Viêm dạ dày ruột',
            ketQuaDieuTri: 'Khỏi'
        },
    ]
}

const danhSachHSBASlice = createSlice({
    name: 'danhSachHSBA',
    initialState,
    reducers: {}
})

export const danhSachHSBAReducer = danhSachHSBASlice.reducer;
export const danhSachHSBAActions = danhSachHSBASlice.actions;

export default danhSachHSBASlice;