from app import app, conn
from flask import jsonify
import json


@app.route('/user/hsba/<pid>')
def getOneHSBAByPID(pid):
    cursor = conn.cursor()
    cursor.execute("SELECT hsba.PID, Avatar, Trang_Thai, Khoa, Phong, Giuong, Ho_Ten, Ngay_Sinh, Gioi_Tinh, Nghe_Nghiep, Noi_Lam_Viec, Quoc_Tich, Dan_Toc, So_CCCD, Doi_Tuong, Dien_Thoai, So_Nha, Thon_Pho, Phuong_Xa, Quan_Huyen, Tinh_TP, So_The_BHYT, Noi_Dang_Ky_KCB_Ban_Dau, Gia_Tri_Tu, Gia_Tri_Den, Ho_Ten_Nguoi_Nha, Dia_Chi_Nguoi_Nha, Dien_Thoai_Nguoi_Nha, Quan_He_Voi_Benh_Nhan, So_CCCD_Nguoi_Nha, Thoi_Gian_Lam_Benh_An, Bac_Si_Lam_Benh_An, Ly_Do_Vao_Vien, Ngay_Vao_Vien, Vao_Ngay_Thu, Chan_Doan_Noi_Gioi_Thieu, Noi_Gioi_Thieu, Qua_Trinh_Benh_Ly, Tien_Su_Ban_Than, Dac_Diem_Lien_Quan_Benh, Tien_Su_Gia_Dinh, Kham_Toan_Than, Tuan_Hoan, Ho_Hap, Tieu_Hoa, Than_Tiet_Nieu, Than_Kinh, Co_Xuong_Khop, Tai_Mui_Hong, Rang_Ham_Mat, Mat, Noi_Tiet, Tom_Tat_Benh_An, Chan_Doan_Ban_Dau, Thoi_Gian_Tong_Ket_Benh_An, Bac_Si_Dieu_Tri, Phuong_Phap_Dieu_Tri, Chan_Doan_Khi_Ra_Vien, Ngay_Ra_Vien, Tinh_Trang_Ra_Vien, Huong_Dieu_Tri FROM HO_SO_BENH_AN hsba, HANH_CHINH hc, BENH_AN ba, TONG_KET_BENH_AN tkba WHERE hsba.PID = " +
                   pid + " && hc.PID = " + pid + " && ba.PID = " + pid + " && tkba.PID = " + pid + ";")
    conn.commit()
    data = list(list(cursor.fetchall())[0])
    result = dict()
    length = 0
    ho_so_key = ["pid", "avatar", "trangThai", "khoa", "phong", "giuong"]
    for i in range(0, len(ho_so_key)):
        result[ho_so_key[i]] = data[i]
    length += len(ho_so_key)

    hanh_chinh_key = ["hoTen", "ngaySinh", "gioiTinh", "ngheNghiep", "noiLamViec", "quocTich", "danToc", "soCCCD", "doiTuong",
                      "dienThoai", "soNha", "thonPho", "phuongXa", "quanHuyen", "tinhTP", "soTheBHYT", "noiDangKyKCBBanDau", "giaTriTu", "giaTriDen"]
    result["hanhChinh"] = dict()
    for i in range(0, len(hanh_chinh_key)):
        result["hanhChinh"][hanh_chinh_key[i]] = data[length + i]
    length += len(hanh_chinh_key)

    nguoi_nha_key = ["hoTen", "diaChi",
                     "dienThoai", "quanHeVoiBenhNhan", "soCCCD"]
    result["hanhChinh"]["nguoiNha"] = dict()
    for i in range(0, len(nguoi_nha_key)):
        result["hanhChinh"]["nguoiNha"][nguoi_nha_key[i]] = data[length + i]
    length += len(nguoi_nha_key)

    benh_an_key = ["thoiGian", "bacSiLamBenhAn"]
    result["benhAn"] = dict()
    result["benhAn"][benh_an_key[0]] = data[length]
    result["benhAn"][benh_an_key[1]] = json.loads(data[length + 1])
    length += len(benh_an_key)

    ly_do_vao_vien_key = ["lyDo", "ngayVaoVien",
                          "vaoNgayThu", "chanDoanNoiGioiThieu", "noiGioiThieu"]
    result["lyDoVaoVien"] = dict()
    for i in range(0, len(ly_do_vao_vien_key)):
        result["lyDoVaoVien"][ly_do_vao_vien_key[i]] = data[length + i]
    length += len(ly_do_vao_vien_key)

    result["hoiBenh"] = dict()
    result["hoiBenh"]["quaTrinhBenhLy"] = data[length]
    result["hoiBenh"]["tienSu"] = dict()
    result["hoiBenh"]["tienSu"]["banThan"] = data[length + 1]
    result["hoiBenh"]["tienSu"]["dacDiemLienQuanBenh"] = json.loads(
        data[length + 2])
    result["hoiBenh"]["tienSu"]["giaDinh"] = data[length + 3]
    length += 4

    kham_benh_key = ["khamToanThan", "tuanHoan", "hoHap", "tieuHoa", "than",
                     "thanKinh", "coXuongKhop", "taiMuiHong", "rangHamMat", "mat", "noiTiet"]
    result["khamBenh"] = dict()
    for i in range(0, len(kham_benh_key)):
        result["khamBenh"][kham_benh_key[i]] = data[length + i]
    length += len(kham_benh_key)

    result["tomTatBenhAn"] = data[length]
    result["chanDoanBanDau"] = data[length + 1]
    length += 2

    tong_ket_benh_an_key = ["thoiGian", "bacSiDieuTri"]
    result["tongKetBenhAn"] = dict()
    result["tongKetBenhAn"][tong_ket_benh_an_key[0]] = data[length]
    result["tongKetBenhAn"][tong_ket_benh_an_key[1]
                            ] = json.loads(data[length + 1])
    length += len(tong_ket_benh_an_key)

    result["phuongPhapDieuTri"] = data[length]
    length += 1

    chan_doan_khi_ra_vien_key = ["chanDoan", "ngayRaVien"]
    result["chanDoanKhiRaVien"] = dict()
    for i in range(0, len(chan_doan_khi_ra_vien_key)):
        result["chanDoanKhiRaVien"][chan_doan_khi_ra_vien_key[i]] = data[length + i]
    length += len(chan_doan_khi_ra_vien_key)

    result["tinhTrangRaVien"] = data[length]
    result["huongDieuTri"] = data[length + 1]

    cursor.execute("SELECT Ngay_Gio, Dien_Bien_Benh, Y_Lenh, Bac_Si_Ghi FROM TO_DIEU_TRI WHERE PID = " +
                   pid + " ORDER BY Ngay_Gio;")
    conn.commit()
    result["toDieuTri"] = dict()
    result["toDieuTri"]["data"] = []
    for d in cursor.fetchall():
        dt = dict()
        dt["ngayGio"] = d[0]
        dt["dienBienBenh"] = d[1]
        dt["yLenh"] = d[2]
        dt["bacSiGhi"] = d[3]
        result["toDieuTri"]["data"].append(dt)

    cursor.execute("SELECT Ngay_Gio, Theo_Doi_Dien_Bien, Thuc_Hien_Y_Lenh, Xac_Nhan, Dieu_Duong_Ghi FROM PHIEU_CHAM_SOC WHERE PID = " +
                   pid + " ORDER BY Ngay_Gio;")
    conn.commit()
    result["phieuChamSoc"] = dict()
    result["phieuChamSoc"]["data"] = []
    for d in cursor.fetchall():
        dt = dict()
        dt["ngayGio"] = d[0]
        dt["theoDoiDienBien"] = json.loads(d[1])
        dt["thucHienYLenh"] = json.loads(d[2])
        dt["xacNhan"] = json.loads(d[3])
        dt["dieuDuongGhi"] = d[4]
        result["phieuChamSoc"]["data"].append(dt)

    cursor.execute("SELECT Ngay_Thang, Ten_Dich_Truyen, So_Luong, Lo_San_Xuat, Toc_Do, Thoi_Gian_Bat_Dau, Thoi_Gian_Ket_Thuc, Bac_Si_Chi_Dinh, Dieu_Duong_Thuc_Hien FROM PHIEU_TD_TRUYEN_DICH WHERE PID = " +
                   pid + " ORDER BY Ngay_Thang, Thoi_Gian_Bat_Dau;")
    conn.commit()
    result["phieuTDTruyenDich"] = dict()
    result["phieuTDTruyenDich"]["data"] = []
    preNgayThang = None
    values_key = ["tenDichTruyen", "soLuong", "loSanXuat", "tocDo",
                  "thoiGianBatDau", "thoiGianKetThuc", "bacSiChiDinh", "dieuDuongThucHien"]
    data = list(cursor.fetchall())
    dt = dict()
    for index in range(0, len(data)):
        value = dict()
        for i in range(0, len(values_key)):
            value[values_key[i]] = data[index][1 + i]
        if data[index][0] != preNgayThang:
            if dt != dict():
                result["phieuTDTruyenDich"]["data"].append(dt)
                dt = dict()
            dt["ngayThang"] = data[index][0]
            dt["values"] = []
            preNgayThang = data[index][0]
            dt["values"].append(value)
            if index == len(data) - 1:
                result["phieuTDTruyenDich"]["data"].append(dt)
        else:
            dt["values"].append(value)

    cursor.execute("SELECT Ngay_Gio, Mach, Nhiet_Do, Huyet_Ap, Nhip_Tho, Can_Nang, Dieu_Duong_Ghi FROM PHIEU_TD_CHUC_NANG_SONG WHERE PID = " +
                   pid + " ORDER BY Ngay_Gio;")
    conn.commit()
    result["phieuTDChucNangSong"] = dict()
    result["phieuTDChucNangSong"]["data"] = []
    data_key = ["ngayGio", "mach", "nhietDo",
                "huyetAp", "nhipTho", "canNang", "dieuDuongGhi"]
    for d in cursor.fetchall():
        dt = dict()
        for i in range(0, len(data_key)):
            dt[data_key[i]] = d[i]
        result["phieuTDChucNangSong"]["data"].append(dt)

    cursor.execute("SELECT Ngay_Gio_Dung_Thuoc, Thuoc_Di_Ung, Kieu_Di_Ung, Bieu_Hien_Lam_Sang, Bac_Si_Xac_Nhan, Ghi_Chu FROM PHIEU_TD_DI_UNG_THUOC WHERE PID = " +
                   pid + " ORDER BY Ngay_Gio_Dung_Thuoc;")
    conn.commit()
    result["phieuTDDiUngThuoc"] = dict()
    result["phieuTDDiUngThuoc"]["data"] = []
    data_key = ["ngayGioDungThuoc", "thuocDiUng", "kieuDiUng",
                "bieuHienLamSang", "bacSiXacNhan", "ghiChu"]
    for d in cursor.fetchall():
        dt = dict()
        for i in range(0, len(data_key)):
            if data_key[i] == "thuocDiUng":
                dt[data_key[i]] = json.loads(d[i])
            else:
                dt[data_key[i]] = d[i]
        result["phieuTDDiUngThuoc"]["data"].append(dt)

    cursor.execute(
        "SELECT Ngay_Thang FROM PCKT_NGAY_THANG WHERE PID =\'" + pid + "';")
    conn.commit()
    result["phieuCongKhaiThuoc"] = dict()
    result["phieuCongKhaiThuoc"]["ngayThang"] = []
    data = list(cursor.fetchall())
    if len(data) > 0:
        result["phieuCongKhaiThuoc"]["ngayThang"] = json.loads(data[0][0])
    cursor.execute(
        "SELECT Ten_Thuoc, Don_Vi, Ngay_Thang, Tong_So, Don_Gia, Thanh_Tien, Ghi_Chu FROM PHIEU_CONG_KHAI_THUOC WHERE PID = " + pid + " ;")
    conn.commit()
    result["phieuCongKhaiThuoc"]["data"] = []
    data_key = ["tenThuoc", "donVi", "ngayThang",
                "tongSo", "donGia", "thanhTien", "ghiChu"]
    for d in cursor.fetchall():
        dt = dict()
        for i in range(0, len(data_key)):
            if data_key[i] == "ngayThang":
                dt[data_key[i]] = json.loads(d[i])
            else:
                dt[data_key[i]] = d[i]
        result["phieuCongKhaiThuoc"]["data"].append(dt)

    cursor.execute(
        "SELECT Y_Lenh, Xac_Nhan FROM DANH_SACH_Y_LENH WHERE PID = " + pid + " ;")
    conn.commit()
    result["danhSachYLenh"] = []
    for d in cursor.fetchall():
        dt = dict()
        dt["yLenh"] = d[0]
        dt["xacNhan"] = d[1]
        result["danhSachYLenh"].append(dt)

    cursor.close()
    response = jsonify(result)
    return response
