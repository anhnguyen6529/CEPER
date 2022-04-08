from urllib import response
from flask import Flask, jsonify, render_template, request
from flaskext.mysql import MySQL
import json
from flask_cors import CORS

mysql = MySQL()
app = Flask(__name__)
CORS(app, resources={r'/user/*': {'origins': 'http://localhost:3000'}})

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'anhnguyen6529'
app.config['MYSQL_DATABASE_DB'] = 'CEPER'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['CORS_HEADERS'] = 'Content-Type'
mysql.init_app(app)
conn = mysql.connect()


@app.route('/user/HSBA/<pid>')
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
        "SELECT Ngay_Thang FROM PCKT_NGAY_THANG WHERE PID = " + pid + " ;")
    conn.commit()
    result["phieuCongKhaiThuoc"] = dict()
    result["phieuCongKhaiThuoc"]["ngayThang"] = []
    if len(cursor.fetchall()) > 0:
        json.loads(list(cursor.fetchall())[0][0])
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


@app.route('/user/danhSachHSBA/newPID')
def getNewPID():
    cursor = conn.cursor()
    cursor.execute("SELECT MAX(PID) FROM HO_SO_BENH_AN;")
    newPID = str(int(cursor.fetchall()[0][0]) + 1).ljust(6, "0")
    response = jsonify(newPID)
    cursor.close()
    return response


@app.route('/user/danhSachHSBA')
@app.route('/user/danhSachHSBA/<doctorID>')
def getDanhSachHSBA():
    doctorID = request.args.get('doctorID')
    cursor = conn.cursor()
    result = dict()
    result["hienTai"] = []
    result["raVien"] = []
    hien_tai_key = ["pid", "avatar", "trangThai", "hoTen", "ngaySinh", "gioiTinh", "khoa", "phong",
                    "giuong", "benhDieuTri", "tinhTrangHienTai", "ngayVaoVien", "bacSiLamBenhAn", "bacSiDieuTri"]
    ra_vien_key = ["pid", "avatar", "trangThai", "khoa", "hoTen", "ngaySinh", "gioiTinh", "ngayVaoVien",
                   "ngayRaVien", "chanDoanKhiRaVien", "tinhTrangRaVien", "bacSiLamBenhAn", "bacSiDieuTri"]
    hien_tai_query = ""
    ra_vien_query = ""

    if not doctorID:
        hien_tai_query = "SELECT _hsba.PID, Avatar, Trang_Thai, Ho_Ten, Ngay_Sinh, Gioi_Tinh, Khoa, Phong, Giuong, Chan_Doan_Ban_Dau, Dien_Bien_Benh, Ngay_Vao_Vien, Bac_Si_Lam_Benh_An, Bac_Si_Dieu_Tri FROM (SELECT * FROM HO_SO_BENH_AN NATURAL JOIN HANH_CHINH NATURAL JOIN BENH_AN NATURAL JOIN TONG_KET_BENH_AN WHERE Trang_Thai <> 'Đã ra viện') AS _hsba LEFT JOIN (SELECT _tdt.PID, Dien_Bien_Benh FROM TO_DIEU_TRI _tdt, (SELECT PID, MAX(Ngay_Gio) AS Ngay_Gio FROM TO_DIEU_TRI GROUP BY PID) AS mx WHERE _tdt.PID = mx.PID && _tdt.Ngay_Gio = mx.Ngay_Gio) AS tdt ON _hsba.PID = tdt.PID ORDER BY Trang_Thai, _hsba.PID DESC;"
        ra_vien_query = "SELECT hsba.PID, Avatar, Trang_Thai, Khoa, Ho_Ten, Ngay_Sinh, Gioi_Tinh, Ngay_Vao_Vien, Ngay_Ra_Vien, Chan_Doan_Khi_Ra_Vien, Tinh_Trang_Ra_Vien, Bac_Si_Lam_Benh_An, Bac_Si_Dieu_Tri FROM HO_SO_BENH_AN hsba, HANH_CHINH hc, BENH_AN ba, TONG_KET_BENH_AN tkba WHERE hsba.PID = hc.PID && hsba.PID = ba.PID && hsba.PID = tkba.PID && hsba.Trang_Thai = 'Đã ra viện' ORDER BY hsba.PID DESC;"
    else:
        hien_tai_query = "SELECT _hsba.PID, Avatar, Trang_Thai, Ho_Ten, Ngay_Sinh, Gioi_Tinh, Khoa, Phong, Giuong, Chan_Doan_Ban_Dau, Dien_Bien_Benh, Ngay_Vao_Vien, Bac_Si_Lam_Benh_An, Bac_Si_Dieu_Tri FROM (SELECT * FROM HO_SO_BENH_AN NATURAL JOIN HANH_CHINH NATURAL JOIN BENH_AN NATURAL JOIN TONG_KET_BENH_AN WHERE Trang_Thai <> 'Đã ra viện' && (SUBSTRING(Bac_Si_Lam_Benh_An, 9, 6) = " + \
            doctorID + " || SUBSTRING(Bac_Si_Dieu_Tri, 9, 6) = " + doctorID + \
            ")) AS _hsba LEFT JOIN (SELECT _tdt.PID, Dien_Bien_Benh FROM TO_DIEU_TRI _tdt, (SELECT PID, MAX(Ngay_Gio) AS Ngay_Gio FROM TO_DIEU_TRI GROUP BY PID) AS mx WHERE _tdt.PID = mx.PID && _tdt.Ngay_Gio = mx.Ngay_Gio) AS tdt ON _hsba.PID = tdt.PID ORDER BY Trang_Thai, _hsba.PID DESC;"
        ra_vien_query = "SELECT hsba.PID, Avatar, Trang_Thai, Khoa, Ho_Ten, Ngay_Sinh, Gioi_Tinh, Ngay_Vao_Vien, Ngay_Ra_Vien, Chan_Doan_Khi_Ra_Vien, Tinh_Trang_Ra_Vien, Bac_Si_Lam_Benh_An, Bac_Si_Dieu_Tri FROM HO_SO_BENH_AN hsba, HANH_CHINH hc, BENH_AN ba, TONG_KET_BENH_AN tkba WHERE hsba.PID = hc.PID && hsba.PID = ba.PID && hsba.PID = tkba.PID && hsba.Trang_Thai = 'Đã ra viện' && (SUBSTRING(Bac_Si_Lam_Benh_An, 9, 6) = " + \
            doctorID + " || SUBSTRING(Bac_Si_Dieu_Tri, 9, 6) = " + \
            doctorID + ") ORDER BY hsba.PID DESC;"

    cursor.execute(hien_tai_query)
    conn.commit()
    for dt in cursor.fetchall():
        data = dict()
        for i in range(0, len(hien_tai_key)):
            data[hien_tai_key[i]] = dt[i]
        result["hienTai"].append(data)

    cursor.execute(ra_vien_query)
    conn.commit()
    for dt in cursor.fetchall():
        data = dict()
        for i in range(0, len(ra_vien_key)):
            data[ra_vien_key[i]] = dt[i]
        result["raVien"].append(data)

    cursor.close()
    response = jsonify(result)
    return response


@app.route('/user/danhSachHSBA/createHSBA', methods=['POST'])
def createNewHSBA():
    data = request.json
    cursor = conn.cursor()

    cursor.execute("INSERT INTO HO_SO_BENH_AN VALUES (%s, %s, %s, %s, %s, %s);",
                   (data["pid"], data["avatar"], data["trangThai"], data["khoa"], data["phong"], data["giuong"]))
    conn.commit()

    cursor.execute("INSERT INTO HANH_CHINH (PID, Ho_Ten, Ngay_Sinh, Gioi_Tinh, Nghe_Nghiep, Noi_Lam_Viec, Quoc_Tich, Dan_Toc, So_CCCD, Doi_Tuong, Dien_Thoai, So_Nha, Thon_Pho, Phuong_Xa, Quan_Huyen, Tinh_TP, So_The_BHYT, Noi_Dang_Ky_KCB_Ban_Dau, Gia_Tri_Tu, Gia_Tri_Den, Ho_Ten_Nguoi_Nha, Quan_He_Voi_Benh_Nhan, Dia_Chi_Nguoi_Nha, Dien_Thoai_Nguoi_Nha, So_CCCD_Nguoi_Nha) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
                   (data["pid"], data["hanhChinh"]["hoTen"], data["hanhChinh"]["ngaySinh"], data["hanhChinh"]["gioiTinh"], data["hanhChinh"]["ngheNghiep"], data["hanhChinh"]["noiLamViec"], data["hanhChinh"]["quocTich"], data["hanhChinh"]["danToc"], data["hanhChinh"]["soCCCD"], data["hanhChinh"]["doiTuong"], data["hanhChinh"]["dienThoai"], data["hanhChinh"]["soNha"], data["hanhChinh"]["thonPho"], data["hanhChinh"]["phuongXa"], data["hanhChinh"]["quanHuyen"], data["hanhChinh"]["tinhTP"], data["hanhChinh"]["soTheBHYT"], data["hanhChinh"]["noiDangKyKCBBanDau"], data["hanhChinh"]["giaTriTu"], data["hanhChinh"]["giaTriDen"], data["hanhChinh"]["nguoiNha"]["hoTen"], data["hanhChinh"]["nguoiNha"]["quanHeVoiBenhNhan"], data["hanhChinh"]["nguoiNha"]["diaChi"], data["hanhChinh"]["nguoiNha"]["dienThoai"], data["hanhChinh"]["nguoiNha"]["soCCCD"]))
    conn.commit()

    ddlqb = data["hoiBenh"]["tienSu"]["dacDiemLienQuanBenh"]
    ddlqb_query = "JSON_ARRAY(JSON_OBJECT('tt', '" + ddlqb[0]["tt"] + "', 'benh', '" + ddlqb[0]["benh"] + "', 'kyHieu', " + str(ddlqb[0]["kyHieu"]) + ", 'diNguyen', JSON_ARRAY(" + str(ddlqb[0]["diNguyen"])[1:-1] + "), 'thoiGian', JSON_ARRAY(" + str(ddlqb[0]["thoiGian"])[1:-1] + ")), JSON_OBJECT('tt', '" + ddlqb[1]["tt"] + "', 'benh', '" + ddlqb[1]["benh"] + "', 'kyHieu', " + str(ddlqb[1]["kyHieu"]) + ", 'thoiGian', " + str(ddlqb[1]["thoiGian"]) + "), JSON_OBJECT('tt', '" + ddlqb[2]["tt"] + \
        "', 'benh', '" + ddlqb[2]["benh"] + "', 'kyHieu', " + str(ddlqb[2]["kyHieu"]) + ", 'thoiGian', " + str(ddlqb[2]["thoiGian"]) + "), JSON_OBJECT('tt', '" + ddlqb[3]["tt"] + "', 'benh', '" + ddlqb[3]["benh"] + "', 'kyHieu', " + str(
            ddlqb[3]["kyHieu"]) + ", 'thoiGian', " + str(ddlqb[3]["thoiGian"]) + "), JSON_OBJECT('tt', '" + ddlqb[4]["tt"] + "', 'benh', '" + ddlqb[4]["benh"] + "', 'kyHieu', " + str(ddlqb[4]["kyHieu"]) + ", 'thoiGian', " + str(ddlqb[4]["thoiGian"]) + "), JSON_OBJECT('tt', '" + ddlqb[5]["tt"] + "', 'benh', JSON_ARRAY(" + str(ddlqb[5]["benh"])[1:-1] + "), 'kyHieu', " + str(ddlqb[5]["kyHieu"]) + ", 'thoiGian', JSON_ARRAY(" + str(ddlqb[5]["thoiGian"])[1:-1] + ")))"
    query = "INSERT INTO BENH_AN (PID, Ly_Do_Vao_Vien, Ngay_Vao_Vien, Vao_Ngay_Thu, Chan_Doan_Noi_Gioi_Thieu, Noi_Gioi_Thieu, Qua_Trinh_Benh_Ly, Tien_Su_Ban_Than, Tien_Su_Gia_Dinh, Dac_Diem_Lien_Quan_Benh, Kham_Toan_Than, Tuan_Hoan, Ho_Hap, Tieu_Hoa, Than_Tiet_Nieu, Than_Kinh, Co_Xuong_Khop, Tai_Mui_Hong, Rang_Ham_Mat, Mat, Noi_Tiet, Tom_Tat_Benh_An, Chan_Doan_Ban_Dau, Thoi_Gian_Lam_Benh_An, Bac_Si_Lam_Benh_An) VALUES (\'" + data["pid"] + "', '" + data["lyDoVaoVien"]["lyDo"] + "', '" + data["lyDoVaoVien"]["ngayVaoVien"] + "', '" + str(data["lyDoVaoVien"]["vaoNgayThu"]) + "', '" + data["lyDoVaoVien"]["chanDoanNoiGioiThieu"] + "', '" + data["lyDoVaoVien"]["noiGioiThieu"] + "', '" + data["hoiBenh"]["quaTrinhBenhLy"] + "', '" + data["hoiBenh"]["tienSu"][
        "banThan"] + "', '" + data["hoiBenh"]["tienSu"]["giaDinh"] + "', " + ddlqb_query + ", '" + data["khamBenh"]["khamToanThan"] + "', '" + data["khamBenh"]["tuanHoan"] + "', '" + data["khamBenh"]["hoHap"] + "', '" + data["khamBenh"]["tieuHoa"] + "', '" + data["khamBenh"]["than"] + "', '" + data["khamBenh"]["thanKinh"] + "', '" + data["khamBenh"]["coXuongKhop"] + "', '" + data["khamBenh"]["taiMuiHong"] + "', '" + data["khamBenh"]["rangHamMat"] + "', '" + data["khamBenh"]["mat"] + "', '" + data["khamBenh"]["noiTiet"] + "', '" + data["tomTatBenhAn"] + "', '" + data["chanDoanBanDau"] + "', '" + data["benhAn"]["thoiGian"] + "', JSON_OBJECT('id', '" + data["benhAn"]["bacSiLamBenhAn"]["id"] + "', 'name', '" + data["benhAn"]["bacSiLamBenhAn"]["name"] + "'));"
    cursor.execute(query)
    conn.commit()

    cursor.execute("INSERT INTO TONG_KET_BENH_AN (PID, Phuong_Phap_Dieu_Tri, Chan_Doan_Khi_Ra_Vien, Ngay_Ra_Vien, Tinh_Trang_Ra_Vien, Huong_Dieu_Tri, Thoi_Gian_Tong_Ket_Benh_An, Bac_Si_Dieu_Tri) VALUES (\'" + data["pid"] + "', '" + data["phuongPhapDieuTri"] + "', '" + data["chanDoanKhiRaVien"]["chanDoan"] + "', '" + data[
                   "chanDoanKhiRaVien"]["ngayRaVien"] + "', '" + data["tinhTrangRaVien"] + "', '" + data["huongDieuTri"] + "', '" + data["tongKetBenhAn"]["thoiGian"] + "', JSON_OBJECT('id', '" + data["tongKetBenhAn"]["bacSiDieuTri"]["id"] + "', 'name', '" + data["tongKetBenhAn"]["bacSiDieuTri"]["name"] + "'));")
    conn.commit()

    ptdcns = data["phieuTDChucNangSong"]["data"][0]
    cursor.execute("INSERT INTO PHIEU_TD_CHUC_NANG_SONG (PID, Ngay_Gio, Mach, Nhiet_Do, Huyet_Ap, Nhip_Tho, Can_Nang, Dieu_Duong_Ghi) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);",
                   (data["pid"], ptdcns["ngayGio"], str(ptdcns["mach"]), str(ptdcns["nhietDo"]), ptdcns["huyetAp"], str(ptdcns["nhipTho"]), str(ptdcns["canNang"]), ptdcns["dieuDuongGhi"]))
    conn.commit()

    response = jsonify({"result": True})
    return response


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True)
