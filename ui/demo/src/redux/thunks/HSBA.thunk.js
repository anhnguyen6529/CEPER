import { createAsyncThunk } from "@reduxjs/toolkit";

const PHIEUTDDIUNGTHUOC = {
    data: [
        { ngayGioDungThuoc: '2021-11-08 09:30', diNguyen: ['Bigentil (Netilmicin)', 'Ofloxacin'], nghiNgo: true, chacChan: false, bieuHienLamSang: 'Mề đay, đau đầu, khó thở', bacSiXacNhan: 'Trần Quốc A', ketQua: '' },
        { ngayGioDungThuoc: '2021-11-09 10:30', diNguyen: ['Cefuroxime'], nghiNgo: false, chacChan: false, bieuHienLamSang: 'Mề đay, đau đầu, khó thở', bacSiXacNhan: 'Trần Quốc A', ketQua: '' }
    ]
};
const HOIBENH = {
    quaTrinhBenhLy: 'cháu sốt cao 3 ngày nay, ở nhà uống hạ sốt không giảm, từ sáng đến giờ cháu sốt cao, ói, ăn uống không được',
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
};
const KHAMBENH = {
    khamToanThan: 'tỉnh, sốt cao, da niêm hồng',
    tuanHoan: 'tim đều, chi ấm, mạch rỏ',
    hoHap: 'thở đều, phổi không ran',
    tieuHoa: 'mềm, gan lách không to',
    than: 'chưa phát hiện bất thường',
    thanKinh: 'tỉnh, vẻ mệt',
    coXuongKhop: 'bình thường',
    taiMuiHong: '',
    rangHamMat: '',
    mat: '',
    noiTiet: 'họng đỏ, xung huyết mũi, mắt đỏ',
};
const PHIEUTDCHUCNANGSONG = {
    data: [
        { ngayGio: '2021-11-06 09:30', mach: 70, nhietDo: 36.3, huyetAp: 90, nhipTho: 15, canNang: 65, dieuDuongGhi: 'Nguyễn Ngọc A' },
        { ngayGio: '2021-11-07 14:05', mach: 80, nhietDo: 36.5, huyetAp: 90, nhipTho: 16, canNang: 65, dieuDuongGhi: 'Nguyễn Ngọc A'},
        { ngayGio: '2021-11-07 09:30', mach: 75, nhietDo: 36.4, huyetAp: 85, nhipTho: 17, canNang: 65, dieuDuongGhi: 'Nguyễn Ngọc A' },
    ],
};
const PHIEUCHAMSOC = {
    data: [
        { ngay: '2021-11-06', gio: '17:30', theoDoiDienBien: 'hạ sốt, còn đau đầu', thucHienYLenh: ['theo dõi sốt huyết não'], xacNhan: ['Đang thực hiện'], dieuDuongGhi: 'Nguyễn Ngọc A' },
        { ngay: '2021-11-07', gio: '18:30', theoDoiDienBien: 'hết sốt, đau bụng nhẹ', thucHienYLenh: ['Tylenol cách 3 tiếng/ngày'], xacNhan: ['Đang thực hiện'], dieuDuongGhi: 'Nguyễn Ngọc A' },
    ],
};
const TODIEUTRI = {
    data: [
        { ngayGio: '2021-11-06 09:30', dienBienBenh: 'giảm đau đầu', yLenh: 'theo dõi sốt huyết não', bacSiGhi: 'Trần Quốc A' },
        { ngayGio: '2021-11-07 14:05', dienBienBenh: 'hạ sốt', yLenh: 'Tylenol cách 3 tiếng/ngày', bacSiGhi: 'Trần Quốc A' },
    ],
};
const PHIEUTDTRUYENDICH = {
    data: [
        { ngayThang: '2021-11-08', values: [
            { tenDichTruyen: 'Ringer lactat 500ml', soLuong: 500, loSanXuat: '19803', tocDo: 100, thoiGianBatDau: '2021-11-08 19:00', thoiGianKetThuc: '2021-11-08 20:30', BSChiDinh: 'Trần Quốc A', DDThucHien: 'Nguyễn Ngọc A' },
            { tenDichTruyen: 'Glucose 5%; 500ml', soLuong: 500, loSanXuat: '18904', tocDo: 100, thoiGianBatDau: '2021-11-08 21:00', thoiGianKetThuc: '2021-11-09 01:00', BSChiDinh: 'Trần Quốc A', DDThucHien: 'Nguyễn Ngọc A' },
        ]},
        { ngayThang: '2021-11-09', values: [
            { tenDichTruyen: 'Paracetamol 10mg/ml', soLuong: 100, loSanXuat: '182', tocDo: 100, thoiGianBatDau: '2021-11-09 08:00', thoiGianKetThuc: '2021-11-09 08:40', BSChiDinh: 'Trần Quốc A', DDThucHien: 'Nguyễn Ngọc A' },
        ]}
    ]
};
const PHIEUCONGKHAITHUOC = {
    ngayThang: ['2021-11-20', '2021-11-21', '2021-11-22', '2021-11-23'],
    nguoiBenhKyTen: ['Nguyễn Văn A', 'Nguyễn Văn A', 'Nguyễn Văn A', 'Nguyễn Văn A'],
    data: [
        { tenThuoc: 'Natri Clorid 0.9%/10ml', donVi: 'chai', ngayThang: [2, 0, 1, 1], tongSo: 4, ghiChu: '' },
        { tenThuoc: 'Seduxen 5mg', donVi: 'viên', ngayThang: [2, 2, 2, 2], tongSo: 8, ghiChu: '' }
    ]
};
const DANHSACHYLENH = [
    { yLenh: '06/11/2021 09:30 - theo dõi sốt huyết não - BS: Trần Quốc A', xacNhan: 'Đang thực hiện' },
    { yLenh: '07/11/2021 14:05 - Tylenol cách 3 tiếng/ngày - BS: Trần Quốc A', xacNhan: 'Đang thực hiện' }
]

const datas = [
    {
        pid: '123456',
        khoa: 'Cấp cứu',
        giuong: '08',
        phong: '302',
        hanhChinh: {
            hoTen: 'Nguyễn Văn A',
            ngaySinh: '1997-01-02',
            gioiTinh: 'Nam',
            ngheNghiep: 'Học sinh',
            noiLamViec: 'Trường tiểu học Phước Trạch',
            quocTich: 'Việt Nam',
            danToc: 'Kinh',
            soCCCD: '079199123xxx',
            doiTuong: 'BHYT',
            dienThoai: '0372579326',
            soNha: '9',
            thonPho: '',
            phuongXa: 'Xã Phước Trạch',
            tinhTP: 'Tây Ninh',
            quanHuyen: 'Huyện Gò Dầu',
            soTheBHYT: '4727221982858',
            noiDangKyKCBBanDau: 'Bệnh viên đa khoa khu vực Thủ Đức',
            giaTriTu: '2021-01-01',
            giaTriDen: '2021-12-31',
            nguoiNha: {
                hoTen: '',
                diaChi: '',
                dienThoai: '',
                quanHeVoiBenhNhan: '',
            }
        },
        phieuTDDiUngThuoc: PHIEUTDDIUNGTHUOC,
        lyDoVaoVien: {
            lyDo: 'sốt cao, ói',
            ngayVaoVien: '2021-11-08 14:00',
            vaoNgayThu: 1,
            chanDoanNoiGioiThieu: '',
            noiGioiThieu: ''
        },
        hoiBenh: HOIBENH,
        khamBenh: KHAMBENH,
        tomTatBenhAn: '',
        chanDoanBanDau: 'Sốt nhiễm siêu vi ngày 4 / TD Bệnh Sởi - Rối loạn tiêu hoá',
        phuongPhapDieuTri: 'kháng sinh, men vi sinh, chống ói, hạ sốt',
        chanDoanKhiRaVien: {
            chanDoan: '',
            ngayRaVien: '',
        },   
        tinhTrangRaVien: '',
        huongDieuTri: '',
        phieuTDChucNangSong: PHIEUTDCHUCNANGSONG,
        toDieuTri: TODIEUTRI,
        phieuChamSoc: PHIEUCHAMSOC,
        phieuTDTruyenDich: PHIEUTDTRUYENDICH,
        phieuCongKhaiThuoc: PHIEUCONGKHAITHUOC,
        danhSachYLenh: DANHSACHYLENH
    },
    {
        pid: '102345',
        khoa: 'Khám bệnh',
        giuong: '02',
        phong: '201',
        hanhChinh: {
            hoTen: 'Nguyễn Thị B',
            ngaySinh: '2000-01-20',
            gioiTinh: 'Nữ',
            ngheNghiep: 'Học sinh',
            noiLamViec: 'Trường tiểu học Phước Trạch',
            quocTich: 'Việt Nam',
            danToc: 'Kinh',
            soCCCD: '079199123xxx',
            doiTuong: 'Thu phí',
            dienThoai: '0372579326',
            soNha: '9',
            thonPho: '',
            phuongXa: 'Xã Phước Trạch',
            tinhTP: 'Tây Ninh',
            quanHuyen: 'Huyện Gò Dầu',
            soTheBHYT: '4798332093969',
            noiDangKyKCBBanDau: 'Bệnh viên đa khoa khu vực Thủ Đức',
            giaTriTu: '2021-01-01',
            giaTriDen: '2021-12-31',
            nguoiNha: {
                hoTen: '',
                diaChi: '',
                dienThoai: '',
                quanHeVoiBenhNhan: '',
            }
        },
        phieuTDDiUngThuoc: PHIEUTDDIUNGTHUOC,
        benhAn: {
            thoiGian: '2021-06-08 10:30',
            bacSiLamBenhAn: 'Trần Quốc A',
        },
        lyDoVaoVien: {
            lyDo: 'sốt cao, ói',
            ngayVaoVien: '2021-06-07 08:30',
            vaoNgayThu: 1,
            chanDoanNoiGioiThieu: '',
            noiGioiThieu: ''
        },
        hoiBenh: HOIBENH,
        khamBenh: KHAMBENH,
        tomTatBenhAn: '',
        chanDoanBanDau: 'Rối loạn tiêu hoá',
        phuongPhapDieuTri: 'kháng sinh, men vi sinh, chống ói, hạ sốt',
        chanDoanKhiRaVien: {
            chanDoan: '',
            ngayRaVien: '',
        },  
        tinhTrangRaVien: '',
        huongDieuTri: '',
        phieuTDChucNangSong: PHIEUTDCHUCNANGSONG,
        toDieuTri: TODIEUTRI,
        phieuChamSoc: PHIEUCHAMSOC,
        phieuTDTruyenDich: PHIEUTDTRUYENDICH,
        phieuCongKhaiThuoc: PHIEUCONGKHAITHUOC,
        danhSachYLenh: DANHSACHYLENH
    },
    {
        pid: '200001',
        khoa: 'Cấp cứu',
        giuong: '04',
        phong: '302',
        hanhChinh: {
            hoTen: 'Phạm Quang C',
            ngaySinh: '1990-12-24',
            gioiTinh: 'Nam',
            ngheNghiep: 'Học sinh',
            noiLamViec: 'Trường tiểu học Phước Trạch',
            quocTich: 'Việt Nam',
            danToc: 'Kinh',
            soCCCD: '079199123xxx',
            doiTuong: 'Miễn',
            dienThoai: '0372579326',
            soNha: '9',
            thonPho: '',
            phuongXa: 'Xã Phước Trạch',
            tinhTP: 'Tây Ninh',
            quanHuyen: 'Huyện Gò Dầu',
            soTheBHYT: '4696110871747',
            noiDangKyKCBBanDau: 'Bệnh viên đa khoa khu vực Thủ Đức',
            giaTriTu: '2021-01-01',
            giaTriDen: '2021-12-31',
            nguoiNha: {
                hoTen: '',
                diaChi: '',
                dienThoai: '',
                quanHeVoiBenhNhan: '',
            }
        },
        phieuTDDiUngThuoc: PHIEUTDDIUNGTHUOC,
        lyDoVaoVien: {
            lyDo: 'sốt cao, ói',
            ngayVaoVien: '2021-10-20 09:20',
            vaoNgayThu: 1,
            chanDoanNoiGioiThieu: '',
            noiGioiThieu: ''
        },
        hoiBenh: HOIBENH,
        khamBenh: KHAMBENH,
        tomTatBenhAn: '',
        chanDoanBanDau: 'Đau tim',
        phuongPhapDieuTri: 'kháng sinh, men vi sinh, chống ói, hạ sốt',
        chanDoanKhiRaVien: {
            chanDoan: '',
            ngayRaVien: '',
        },
        tinhTrangRaVien: '',
        huongDieuTri: '',
        phieuTDChucNangSong: PHIEUTDCHUCNANGSONG,
        toDieuTri: TODIEUTRI,
        phieuChamSoc: PHIEUCHAMSOC,
        phieuTDTruyenDich: PHIEUTDTRUYENDICH,
        phieuCongKhaiThuoc: PHIEUCONGKHAITHUOC,
        danhSachYLenh: DANHSACHYLENH
    },
    {
        pid: '165423',
        khoa: 'Hô hấp',
        giuong: '06',
        phong: '102',
        hanhChinh: {
            hoTen: 'Lê Thị D',
            ngaySinh: '1992-04-06',
            gioiTinh: 'Nữ',
            ngheNghiep: 'Học sinh',
            noiLamViec: 'Trường tiểu học Phước Trạch',
            quocTich: 'Việt Nam',
            danToc: 'Kinh',
            soCCCD: '079199123xxx',
            doiTuong: 'BHYT',
            dienThoai: '0372579326',
            soNha: '9',
            thonPho: '',
            phuongXa: 'Xã Phước Trạch',
            tinhTP: 'Tây Ninh',
            quanHuyen: 'Huyện Gò Dầu',
            soTheBHYT: '4719443204171',
            noiDangKyKCBBanDau: 'Bệnh viên đa khoa khu vực Thủ Đức',
            giaTriTu: '2021-01-01',
            giaTriDen: '2021-12-31',
            nguoiNha: {
                hoTen: '',
                diaChi: '',
                dienThoai: '',
                quanHeVoiBenhNhan: '',
            }
        },
        phieuTDDiUngThuoc: PHIEUTDDIUNGTHUOC,
        lyDoVaoVien: {
            lyDo: 'sốt cao, ói',
            ngayVaoVien: '2021-12-12 15:40',
            vaoNgayThu: 1,
            chanDoanNoiGioiThieu: '',
            noiGioiThieu: ''
        },
        hoiBenh: HOIBENH,
        khamBenh: KHAMBENH,
        tomTatBenhAn: '',
        chanDoanBanDau: 'Suy hô hấp',
        phuongPhapDieuTri: 'kháng sinh, men vi sinh, chống ói, hạ sốt',
        chanDoanKhiRaVien: {
            chanDoan: '',
            ngayRaVien: '',
        },
        tinhTrangRaVien: '',
        huongDieuTri: '',
        phieuTDChucNangSong: PHIEUTDCHUCNANGSONG,
        toDieuTri: TODIEUTRI,
        phieuChamSoc: PHIEUCHAMSOC,
        phieuTDTruyenDich: PHIEUTDTRUYENDICH,
        phieuCongKhaiThuoc: PHIEUCONGKHAITHUOC,
        danhSachYLenh: DANHSACHYLENH
    },
    {
        pid: '143256',
        khoa: 'Cấp cứu',
        giuong: '04',
        phong: '302',
        hanhChinh: {
            hoTen: 'Trần Văn A',
            ngaySinh: '1994-04-16',
            gioiTinh: 'Nam',
            ngheNghiep: 'Học sinh',
            noiLamViec: 'Trường tiểu học Phước Trạch',
            quocTich: 'Việt Nam',
            danToc: 'Kinh',
            soCCCD: '079199123xxx',
            doiTuong: 'BHYT',
            dienThoai: '0372579326',
            soNha: '9',
            thonPho: '',
            phuongXa: 'Xã Phước Trạch',
            tinhTP: 'Tây Ninh',
            quanHuyen: 'Huyện Gò Dầu',
            soTheBHYT: '4729443204171',
            noiDangKyKCBBanDau: 'Bệnh viên đa khoa khu vực Thủ Đức',
            giaTriTu: '2021-01-01',
            giaTriDen: '2021-12-31',
            nguoiNha: {
                hoTen: '',
                diaChi: '',
                dienThoai: '',
                quanHeVoiBenhNhan: '',
            }
        },
        phieuTDDiUngThuoc: PHIEUTDDIUNGTHUOC,
        lyDoVaoVien: {
            lyDo: 'sốt cao, ói',
            ngayVaoVien: '2021-08-04 18:50',
            vaoNgayThu: 1,
            chanDoanNoiGioiThieu: '',
            noiGioiThieu: ''
        },
        hoiBenh: HOIBENH,
        khamBenh: KHAMBENH,
        tomTatBenhAn: '',
        chanDoanBanDau: 'Sốt siêu vi',
        phuongPhapDieuTri: 'kháng sinh, men vi sinh, chống ói, hạ sốt',
        chanDoanKhiRaVien: {
            chanDoan: 'Sốt siêu vi',
            ngayRaVien: '2021-06-18 18:50',
        },
        tinhTrangRaVien: 'Đỡ, giảm',
        huongDieuTri: '',
        phieuTDChucNangSong: PHIEUTDCHUCNANGSONG,
        toDieuTri: TODIEUTRI,
        phieuChamSoc: PHIEUCHAMSOC,
        phieuTDTruyenDich: PHIEUTDTRUYENDICH,
        phieuCongKhaiThuoc: PHIEUCONGKHAITHUOC,
        danhSachYLenh: DANHSACHYLENH
    },
    {
        pid: '132456',
        khoa: 'Nhi',
        giuong: '09',
        phong: '510',
        hanhChinh: {
            hoTen: 'Nguyễn Thị B',
            ngaySinh: '2012-03-15',
            gioiTinh: 'Nữ',
            ngheNghiep: 'Học sinh',
            noiLamViec: 'Trường tiểu học Phước Trạch',
            quocTich: 'Việt Nam',
            danToc: 'Kinh',
            soCCCD: '079199123xxx',
            doiTuong: 'Miễn',
            dienThoai: '0372579326',
            soNha: '9',
            thonPho: '',
            phuongXa: 'Xã Phước Trạch',
            tinhTP: 'Tây Ninh',
            quanHuyen: 'Huyện Gò Dầu',
            soTheBHYT: '4697221982858',
            noiDangKyKCBBanDau: 'Bệnh viên đa khoa khu vực Thủ Đức',
            giaTriTu: '2021-01-01',
            giaTriDen: '2021-12-31',
            nguoiNha: {
                hoTen: '',
                diaChi: '',
                dienThoai: '',
                quanHeVoiBenhNhan: '',
            }
        },
        phieuTDDiUngThuoc: PHIEUTDDIUNGTHUOC,
        lyDoVaoVien: {
            lyDo: 'sốt cao, ói',
            ngayVaoVien: '2021-06-12 10:10',
            vaoNgayThu: 1,
            chanDoanNoiGioiThieu: '',
            noiGioiThieu: ''
        },
        hoiBenh: HOIBENH,
        khamBenh: KHAMBENH,
        tomTatBenhAn: '',
        chanDoanBanDau: 'Viêm dạ dày',
        phuongPhapDieuTri: 'kháng sinh, men vi sinh, chống ói, hạ sốt',
        chanDoanKhiRaVien: {
            chanDoan: 'Viêm dạ dày ruột',
            ngayRaVien: '2021-06-15 10:10',
        },
        tinhTrangRaVien: 'Khỏi',
        huongDieuTri: '',
        phieuTDChucNangSong: PHIEUTDCHUCNANGSONG,
        toDieuTri: TODIEUTRI,
        phieuChamSoc: PHIEUCHAMSOC,
        phieuTDTruyenDich: PHIEUTDTRUYENDICH,
        phieuCongKhaiThuoc: PHIEUCONGKHAITHUOC,
        danhSachYLenh: DANHSACHYLENH
    }
]

const HSBAThunk = {
    getOneHSBAByPID: createAsyncThunk(
        'HSBA/getOneHSBA',
        async (pid) => {
            try {
                return datas.find(data => data.pid === pid);
            } catch (error) {
                return error.message;
            }
        }
    )
}

export default HSBAThunk;