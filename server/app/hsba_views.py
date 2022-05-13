from app import app, mysql
from flask import jsonify, request
import json
from flask_jwt_extended import jwt_required


@app.route('/user/hsba/<pid>', methods=['GET'])
@jwt_required()
def getOneHSBAByPID(pid):
    conn = mysql.connect()
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

    cursor.execute("SELECT Ngay_Gio, Khoa_Dieu_Tri, Chan_Doan, Dien_Bien_Benh, Y_Lenh, Bac_Si_Ghi FROM TO_DIEU_TRI WHERE PID = " +
                   pid + " ORDER BY Ngay_Gio;")
    conn.commit()
    result["toDieuTri"] = dict()
    result["toDieuTri"]["data"] = []
    for d in cursor.fetchall():
        dt = dict()
        dt["ngayGio"] = d[0]
        dt["khoaDieuTri"] = d[1]
        dt["chanDoan"] = d[2]
        dt["dienBienBenh"] = json.loads(d[3])
        dt["yLenh"] = json.loads(d[4])
        dt["bacSiGhi"] = d[5]
        result["toDieuTri"]["data"].append(dt)

    cursor.execute("SELECT Ngay_Gio, Khoa, Theo_Doi_Dien_Bien, Thuc_Hien_Y_Lenh, Xac_Nhan, Dieu_Duong_Ghi FROM PHIEU_CHAM_SOC WHERE PID = " +
                   pid + " ORDER BY Ngay_Gio;")
    conn.commit()
    result["phieuChamSoc"] = dict()
    result["phieuChamSoc"]["data"] = []
    for d in cursor.fetchall():
        dt = dict()
        dt["ngayGio"] = d[0]
        dt["khoa"] = d[1]
        dt["theoDoiDienBien"] = json.loads(d[2])
        dt["thucHienYLenh"] = json.loads(d[3])
        dt["xacNhan"] = json.loads(d[4])
        dt["dieuDuongGhi"] = d[5]
        result["phieuChamSoc"]["data"].append(dt)

    cursor.execute("SELECT Ngay_Thang, Khoa, Ten_Dich_Truyen, So_Luong, Lo_San_Xuat, Toc_Do, Thoi_Gian_Bat_Dau, Thoi_Gian_Ket_Thuc, Bac_Si_Chi_Dinh, Dieu_Duong_Thuc_Hien FROM PHIEU_TD_TRUYEN_DICH WHERE PID = " +
                   pid + " ORDER BY Ngay_Thang, Thoi_Gian_Bat_Dau;")
    conn.commit()
    result["phieuTDTruyenDich"] = dict()
    result["phieuTDTruyenDich"]["data"] = []
    preNgayThang = None
    values_key = ["tenDichTruyen", "soLuong", "loSanXuat", "tocDo",
                  "thoiGianBatDau", "thoiGianKetThuc", "BSChiDinh", "DDThucHien"]
    data = list(cursor.fetchall())
    dt = dict()
    for index in range(0, len(data)):
        value = dict()
        for i in range(0, len(values_key)):
            value[values_key[i]] = data[index][2 + i]
        if data[index][0] != preNgayThang:
            if dt != dict():
                result["phieuTDTruyenDich"]["data"].append(dt)
                dt = dict()
            dt["ngayThang"] = data[index][0]
            dt["khoa"] = data[index][1]
            dt["values"] = []
            preNgayThang = data[index][0]
            dt["values"].append(value)
            if index == len(data) - 1:
                result["phieuTDTruyenDich"]["data"].append(dt)
        else:
            dt["values"].append(value)

    cursor.execute("SELECT Ngay_Gio, Khoa, Mach, Nhiet_Do, Huyet_Ap, Nhip_Tho, Can_Nang, Dieu_Duong_Ghi FROM PHIEU_TD_CHUC_NANG_SONG WHERE PID = " +
                   pid + " ORDER BY Ngay_Gio;")
    conn.commit()
    result["phieuTDChucNangSong"] = dict()
    result["phieuTDChucNangSong"]["data"] = []
    data_key = ["ngayGio", "khoa", "mach", "nhietDo",
                "huyetAp", "nhipTho", "canNang", "dieuDuongGhi"]
    for d in cursor.fetchall():
        dt = dict()
        for i in range(0, len(data_key)):
            dt[data_key[i]] = d[i]
        result["phieuTDChucNangSong"]["data"].append(dt)

    cursor.execute("SELECT Ngay_Gio_Dung_Thuoc, Khoa, Thuoc_Di_Ung, Kieu_Di_Ung, Bieu_Hien_Lam_Sang, Bac_Si_Xac_Nhan, Ghi_Chu FROM PHIEU_TD_DI_UNG_THUOC WHERE PID = " +
                   pid + " ORDER BY Ngay_Gio_Dung_Thuoc;")
    conn.commit()
    result["phieuTDDiUngThuoc"] = dict()
    result["phieuTDDiUngThuoc"]["data"] = []
    data_key = ["ngayGioDungThuoc", "khoa", "thuocDiUng", "kieuDiUng",
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
    conn.close()
    response = jsonify(result)
    return response


@app.route('/user/hsba/<pid>', methods=['POST'])
@jwt_required()
def updateHSBA(pid):
    data = request.json
    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute("UPDATE HO_SO_BENH_AN SET Trang_Thai = %s WHERE PID = %s;",
                   (data["trangThai"], pid))
    conn.commit()

    if "benhAn" in data:
        ddlqb = data["hoiBenh"]["tienSu"]["dacDiemLienQuanBenh"]
        ddlqb_query = "JSON_ARRAY(JSON_OBJECT('tt', '" + ddlqb[0]["tt"] + "', 'benh', '" + ddlqb[0]["benh"] + "', 'kyHieu', " + str(ddlqb[0]["kyHieu"]) + ", 'diNguyen', JSON_ARRAY(" + str(ddlqb[0]["diNguyen"])[1:-1] + "), 'thoiGian', JSON_ARRAY(" + str(ddlqb[0]["thoiGian"])[1:-1] + ")), JSON_OBJECT('tt', '" + ddlqb[1]["tt"] + "', 'benh', '" + ddlqb[1]["benh"] + "', 'kyHieu', " + str(ddlqb[1]["kyHieu"]) + ", 'thoiGian', " + str(ddlqb[1]["thoiGian"]) + "), JSON_OBJECT('tt', '" + ddlqb[2]["tt"] + \
            "', 'benh', '" + ddlqb[2]["benh"] + "', 'kyHieu', " + str(ddlqb[2]["kyHieu"]) + ", 'thoiGian', " + str(ddlqb[2]["thoiGian"]) + "), JSON_OBJECT('tt', '" + ddlqb[3]["tt"] + "', 'benh', '" + ddlqb[3]["benh"] + "', 'kyHieu', " + str(
            ddlqb[3]["kyHieu"]) + ", 'thoiGian', " + str(ddlqb[3]["thoiGian"]) + "), JSON_OBJECT('tt', '" + ddlqb[4]["tt"] + "', 'benh', '" + ddlqb[4]["benh"] + "', 'kyHieu', " + str(ddlqb[4]["kyHieu"]) + ", 'thoiGian', " + str(ddlqb[4]["thoiGian"]) + "), JSON_OBJECT('tt', '" + ddlqb[5]["tt"] + "', 'benh', JSON_ARRAY(" + str(ddlqb[5]["benh"])[1:-1] + "), 'kyHieu', " + str(ddlqb[5]["kyHieu"]) + ", 'thoiGian', JSON_ARRAY(" + str(ddlqb[5]["thoiGian"])[1:-1] + ")))"
        cursor.execute("UPDATE BENH_AN SET Ly_Do_Vao_Vien = \'" + data["lyDoVaoVien"]["lyDo"] + "', Vao_Ngay_Thu = \'" + str(data["lyDoVaoVien"]["vaoNgayThu"]) + "', Chan_Doan_Noi_Gioi_Thieu = '" + data["lyDoVaoVien"]["chanDoanNoiGioiThieu"] + "', Noi_Gioi_Thieu = '" + data["lyDoVaoVien"]["noiGioiThieu"] + "', Qua_Trinh_Benh_Ly = '" + data["hoiBenh"]["quaTrinhBenhLy"] + "', Tien_Su_Ban_Than = '" + data["hoiBenh"]["tienSu"]["banThan"] + "', Tien_Su_Gia_Dinh = '" + data["hoiBenh"]["tienSu"]["giaDinh"] + "', Dac_Diem_Lien_Quan_Benh = " + ddlqb_query + ", Kham_Toan_Than = \'" + data["khamBenh"]["khamToanThan"] + "', Tuan_Hoan = '" + data["khamBenh"]["tuanHoan"] +
                       "', Ho_Hap = '" + data["khamBenh"]["hoHap"] + "', Tieu_Hoa = '" + data["khamBenh"]["tieuHoa"] + "', Than_Tiet_Nieu = '" + data["khamBenh"]["than"] + "', Than_Kinh = '" + data["khamBenh"]["thanKinh"] + "', Co_Xuong_Khop = '" + data["khamBenh"]["coXuongKhop"] + "', Tai_Mui_Hong = '" + data["khamBenh"]["taiMuiHong"] + "', Rang_Ham_Mat = '" + data["khamBenh"]["rangHamMat"] + "', Mat = '" + data["khamBenh"]["mat"] + "', Noi_Tiet = '" + data["khamBenh"]["noiTiet"] + "', Tom_Tat_Benh_An = '" + data["tomTatBenhAn"] + "', Chan_Doan_Ban_Dau = '" + data["chanDoanBanDau"] + "', Thoi_Gian_Lam_Benh_An = \'" + data["benhAn"]["thoiGian"] + "' WHERE PID = '" + pid + "';")
        conn.commit()

    if "tongKetBenhAn" in data:
        cursor.execute("UPDATE TONG_KET_BENH_AN SET Phuong_Phap_Dieu_Tri = \'" + data["phuongPhapDieuTri"] + "', Chan_Doan_Khi_Ra_Vien = '" + data["chanDoanKhiRaVien"]["chanDoan"] + "', Ngay_Ra_Vien = '" + data["chanDoanKhiRaVien"]["ngayRaVien"] + "', Tinh_Trang_Ra_Vien = '" + data["tinhTrangRaVien"] +
                       "', Huong_Dieu_Tri = '" + data["huongDieuTri"] + "', Thoi_Gian_Tong_Ket_Benh_An = '" + data["tongKetBenhAn"]["thoiGian"] + "', Bac_Si_Dieu_Tri = JSON_OBJECT('id', '" + data["tongKetBenhAn"]["bacSiDieuTri"]["id"] + "', 'name', '" + data["tongKetBenhAn"]["bacSiDieuTri"]["name"] + "') WHERE PID = '" + pid + "';")
        conn.commit()

    tdt = data["toDieuTri"]["data"]
    if "newDataLength" in data["toDieuTri"] and data["toDieuTri"]["newDataLength"] > 0:
        tdt = tdt[-data["toDieuTri"]["newDataLength"]:]
        for row in tdt:
            cursor.execute("INSERT INTO TO_DIEU_TRI (PID, Ngay_Gio, Khoa_Dieu_Tri, Chan_Doan, Dien_Bien_Benh, Y_Lenh, Bac_Si_Ghi) VALUES (\'" + pid + "', '" +
                           row["ngayGio"] + "', '" + row["khoaDieuTri"] + "', '" + row["chanDoan"] + "', JSON_ARRAY(" + str(row["dienBienBenh"])[1:-1] + "), JSON_ARRAY(" + str(row["yLenh"])[1:-1] + "), '" + row["bacSiGhi"] + "');")
            conn.commit()

    pcs = data["phieuChamSoc"]["data"]
    if "newDataLength" in data["phieuChamSoc"] and data["phieuChamSoc"]["newDataLength"] > 0:
        pcs = pcs[-data["phieuChamSoc"]["newDataLength"]:]
        for row in pcs:
            cursor.execute("INSERT INTO PHIEU_CHAM_SOC (PID, Ngay_Gio, Khoa, Theo_Doi_Dien_Bien, Thuc_Hien_Y_Lenh, Xac_Nhan, Dieu_Duong_Ghi) VALUES (\'" + pid + "', '" + row["ngayGio"] + "', '" + row["khoa"] + "', JSON_ARRAY(" + str(
                row["theoDoiDienBien"])[1:-1] + "), JSON_ARRAY(" + str(row["thucHienYLenh"])[1:-1] + "), JSON_ARRAY(" + str(row["xacNhan"])[1:-1] + "), \'" + row["dieuDuongGhi"] + "');")
            conn.commit()

    ptdtd = data["phieuTDTruyenDich"]["data"]
    if "newDataLength" in data["phieuTDTruyenDich"] and data["phieuTDTruyenDich"]["newDataLength"] > 0:
        ptdtd = ptdtd[-data["phieuTDTruyenDich"]["newDataLength"]:]
        for row in ptdtd:
            for value in row["values"]:
                cursor.execute("INSERT INTO PHIEU_TD_TRUYEN_DICH (PID, Ngay_Thang, Khoa, Ten_Dich_Truyen, So_Luong, Lo_San_Xuat, Toc_Do, Thoi_Gian_Bat_Dau, Thoi_Gian_Ket_Thuc, Bac_Si_Chi_Dinh, Dieu_Duong_Thuc_Hien) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
                               (pid, row["ngayThang"], row["khoa"], value["tenDichTruyen"], str(value["soLuong"]), value["loSanXuat"], str(value["tocDo"]), value["thoiGianBatDau"], value["thoiGianKetThuc"], value["BSChiDinh"], value["DDThucHien"]))
                conn.commit()

    ptdcns = data["phieuTDChucNangSong"]["data"]
    if "newDataLength" in data["phieuTDChucNangSong"] and data["phieuTDChucNangSong"]["newDataLength"] > 0:
        ptdcns = ptdcns[-data["phieuTDChucNangSong"]["newDataLength"]:]
        for row in ptdcns:
            cursor.execute("INSERT INTO PHIEU_TD_CHUC_NANG_SONG (PID, Ngay_Gio, Khoa, Mach, Nhiet_Do, Huyet_Ap, Nhip_Tho, Can_Nang, Dieu_Duong_Ghi) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);",
                           (pid, row["ngayGio"], row["khoa"], str(row["mach"]), str(row["nhietDo"]), row["huyetAp"], str(row["nhipTho"]), str(row["canNang"]), row["dieuDuongGhi"]))
            conn.commit()

    ptddut = data["phieuTDDiUngThuoc"]["data"]
    if "newDataLength" in data["phieuTDDiUngThuoc"] and data["phieuTDDiUngThuoc"]["newDataLength"] > 0:
        ptddut = ptddut[-data["phieuTDDiUngThuoc"]["newDataLength"]:]
        for row in ptddut:
            cursor.execute("INSERT INTO PHIEU_TD_DI_UNG_THUOC (PID, Ngay_Gio_Dung_Thuoc, Khoa, Thuoc_Di_Ung, Kieu_Di_Ung, Bieu_Hien_Lam_Sang, Bac_Si_Xac_Nhan, Ghi_Chu) VALUES (\'" + pid + "', '" +
                           row["ngayGioDungThuoc"] + "', '" + row["khoa"] + "', JSON_ARRAY(" + str(row["thuocDiUng"])[1:-1] + "), '" + row["kieuDiUng"] + "', '" + row["bieuHienLamSang"] + "', '" + row["bacSiXacNhan"] + "', '" + row["ghiChu"] + "');")
            conn.commit()

    ngay_thang = data["phieuCongKhaiThuoc"]["ngayThang"]
    pckt = data["phieuCongKhaiThuoc"]["data"]
    cursor.execute("UPDATE PCKT_NGAY_THANG SET Ngay_Thang = JSON_ARRAY(" +
                   str(ngay_thang)[1:-1] + ") WHERE PID = \'" + pid + "';")
    conn.commit()
    for row in pckt:
        cursor.execute("UPDATE PHIEU_CONG_KHAI_THUOC SET Ngay_Thang = JSON_ARRAY(" + str(row["ngayThang"])[1:-1] + "), Tong_So = '" + str(
            row["tongSo"]) + "', Thanh_Tien = '" + str(row["thanhTien"]) + "' WHERE PID = '" + pid + "' AND Ten_Thuoc = '" + row["tenThuoc"] + "';")
        conn.commit()

        cursor.execute("INSERT INTO PHIEU_CONG_KHAI_THUOC (PID, Ten_Thuoc, Don_Vi, Ngay_Thang, Tong_So, Don_Gia, Thanh_Tien, Ghi_Chu) SELECT \'" + pid + "', '" + row["tenThuoc"] + "', '" + row["donVi"] + "', JSON_ARRAY(" + str(row["ngayThang"])[1:-1] + "), '" + str(
            row["tongSo"]) + "', '" + str(row["donGia"]) + "', '" + str(row["thanhTien"]) + "', '" + row["ghiChu"] + "' WHERE NOT EXISTS (SELECT 1 FROM PHIEU_CONG_KHAI_THUOC WHERE PID = '" + pid + "' AND Ten_Thuoc = '" + row["tenThuoc"] + "');")
        conn.commit()

    dsyl = data["danhSachYLenh"]
    for yl in dsyl:
        cursor.execute("UPDATE DANH_SACH_Y_LENH SET Xac_Nhan = %s WHERE PID = %s AND Y_Lenh = %s;",
                       (yl["xacNhan"], pid, yl["yLenh"]))
        conn.commit()

        cursor.execute("INSERT INTO DANH_SACH_Y_LENH (PID, Y_Lenh, Xac_Nhan) SELECT %s, %s, %s WHERE NOT EXISTS (SELECT 1 FROM DANH_SACH_Y_LENH WHERE PID = %s AND Y_Lenh = %s);",
                       (pid, yl["yLenh"], yl["xacNhan"], pid, yl["yLenh"]))
        conn.commit()

    cursor.close()
    conn.close()
    response = jsonify({"msg": "Update successfully"})
    return response


@app.route('/user/hsba/<pid>/transfer-faculty', methods=['POST'])
@jwt_required()
def transferFaculty(pid):
    data = request.json
    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute("UPDATE HO_SO_BENH_AN SET Khoa = %s, Phong = %s, Giuong = %s WHERE PID = %s;",
                   (data["khoa"], data["phong"], data["giuong"], pid))
    conn.commit()

    cursor.close()
    conn.close()
    response = jsonify({"msg": "Transfer faculty successfully"})
    return response
