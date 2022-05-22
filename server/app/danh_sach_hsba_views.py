import json
from app import app, mysql
from flask import jsonify, request
from flask_jwt_extended import jwt_required


@app.route('/user/danh-sach-hsba/new-pid')
@jwt_required()
def getNewPID():
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("SELECT MAX(PID) FROM HO_SO_BENH_AN;")
    new_pid = str(int(cursor.fetchall()[0][0]) + 1).zfill(6)
    response = jsonify({"newPID": new_pid})
    cursor.close()
    conn.close()
    return response


@app.route('/user/danh-sach-hsba', methods=['GET'])
@jwt_required()
def getDanhSachHSBA():
    doctor_id = request.args.get('doctorID')
    department = request.args.get('department')
    conn = mysql.connect()
    cursor = conn.cursor()
    result = dict()
    result["hienTai"] = []
    result["raVien"] = []
    hien_tai_key = ["pid", "avatar", "trangThai", "hoTen", "ngaySinh", "gioiTinh", "khoa", "phong",
                    "giuong", "benhDieuTri", "ngayVaoVien", "bacSiLamBenhAn"]
    ra_vien_key = ["pid", "avatar", "trangThai", "khoa", "hoTen", "ngaySinh", "gioiTinh", "ngayVaoVien",
                   "ngayRaVien", "chanDoanKhiRaVien", "tinhTrangRaVien", "bacSiLamBenhAn", "bacSiDieuTri"]
    hien_tai_query = ""
    ra_vien_query = ""

    if not doctor_id:
        hien_tai_query = "SELECT _hsba.PID, Avatar, Trang_Thai, Ho_Ten, Ngay_Sinh, Gioi_Tinh, Khoa, Phong, Giuong, Chan_Doan, Ngay_Vao_Vien, Bac_Si_Lam_Benh_An FROM (SELECT * FROM HO_SO_BENH_AN NATURAL JOIN HANH_CHINH NATURAL JOIN BENH_AN NATURAL JOIN TONG_KET_BENH_AN WHERE Trang_Thai <> 'Đã ra viện' AND Khoa = %s) AS _hsba LEFT JOIN (SELECT _tdt.PID, Chan_Doan FROM TO_DIEU_TRI _tdt, (SELECT PID, MAX(Ngay_Gio) AS Ngay_Gio FROM TO_DIEU_TRI GROUP BY PID) AS mx WHERE _tdt.PID = mx.PID && _tdt.Ngay_Gio = mx.Ngay_Gio) AS tdt ON _hsba.PID = tdt.PID ORDER BY Trang_Thai, _hsba.PID DESC;"
        ra_vien_query = "SELECT hsba.PID, Avatar, Trang_Thai, Khoa, Ho_Ten, Ngay_Sinh, Gioi_Tinh, Ngay_Vao_Vien, Ngay_Ra_Vien, Chan_Doan_Khi_Ra_Vien, Tinh_Trang_Ra_Vien, Bac_Si_Lam_Benh_An, Bac_Si_Dieu_Tri FROM HO_SO_BENH_AN hsba, HANH_CHINH hc, BENH_AN ba, TONG_KET_BENH_AN tkba WHERE hsba.PID = hc.PID && hsba.PID = ba.PID && hsba.PID = tkba.PID && hsba.Trang_Thai = 'Đã ra viện' && hsba.Khoa = %s ORDER BY hsba.PID DESC;"
    else:
        hien_tai_query = "SELECT _hsba.PID, Avatar, Trang_Thai, Ho_Ten, Ngay_Sinh, Gioi_Tinh, Khoa, Phong, Giuong, Chan_Doan, Ngay_Vao_Vien, Bac_Si_Lam_Benh_An FROM (SELECT * FROM HO_SO_BENH_AN NATURAL JOIN HANH_CHINH NATURAL JOIN BENH_AN NATURAL JOIN TONG_KET_BENH_AN WHERE Khoa = %s AND (Trang_Thai = 'Đang điều trị' OR (Trang_Thai = 'Chờ khám' AND Bac_Si_Lam_Benh_An->>'$.id' = \'" + \
            doctor_id + "'))) AS _hsba LEFT JOIN (SELECT _tdt.PID, Chan_Doan FROM TO_DIEU_TRI _tdt, (SELECT PID, MAX(Ngay_Gio) AS Ngay_Gio FROM TO_DIEU_TRI GROUP BY PID) AS mx WHERE _tdt.PID = mx.PID && _tdt.Ngay_Gio = mx.Ngay_Gio) AS tdt ON _hsba.PID = tdt.PID ORDER BY Trang_Thai, _hsba.PID DESC;"
        ra_vien_query = "SELECT hsba.PID, Avatar, Trang_Thai, Khoa, Ho_Ten, Ngay_Sinh, Gioi_Tinh, Ngay_Vao_Vien, Ngay_Ra_Vien, Chan_Doan_Khi_Ra_Vien, Tinh_Trang_Ra_Vien, Bac_Si_Lam_Benh_An, Bac_Si_Dieu_Tri FROM HO_SO_BENH_AN hsba, HANH_CHINH hc, BENH_AN ba, TONG_KET_BENH_AN tkba WHERE hsba.PID = hc.PID && hsba.PID = ba.PID && hsba.PID = tkba.PID && hsba.Trang_Thai = 'Đã ra viện' && hsba.Khoa = %s ORDER BY hsba.PID DESC;"

    cursor.execute(hien_tai_query, (department))
    conn.commit()
    for dt in cursor.fetchall():
        data = dict()
        for i in range(0, len(hien_tai_key)):
            data[hien_tai_key[i]] = dt[i]
        result["hienTai"].append(data)

    cursor.execute(ra_vien_query, (department))
    conn.commit()
    for dt in cursor.fetchall():
        data = dict()
        for i in range(0, len(ra_vien_key)):
            data[ra_vien_key[i]] = dt[i]
        result["raVien"].append(data)

    cursor.close()
    conn.close()
    response = jsonify(result)
    return response


@app.route('/user/danh-sach-hsba', methods=['POST'])
@jwt_required()
def createNewHSBA():
    data = request.json
    conn = mysql.connect()
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
    cursor.execute("INSERT INTO PHIEU_TD_CHUC_NANG_SONG (PID, Ngay_Gio, Khoa, Mach, Nhiet_Do, Huyet_Ap, Nhip_Tho, Can_Nang, Dieu_Duong_Ghi) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);",
                   (data["pid"], ptdcns["ngayGio"], data["khoa"], str(ptdcns["mach"]), str(ptdcns["nhietDo"]), ptdcns["huyetAp"], str(ptdcns["nhipTho"]), str(ptdcns["canNang"]), ptdcns["dieuDuongGhi"]))
    conn.commit()

    cursor.execute("INSERT INTO USERS (ID, Username, Password, Role, Name, Position, Gender, Date_Of_Birth) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);",
                   (data["pid"], "user." + data["pid"], "123456", "BN", data["hanhChinh"]["hoTen"], "Bệnh nhân", data["hanhChinh"]["gioiTinh"], data["hanhChinh"]["ngaySinh"]))
    conn.commit()

    cursor.execute("INSERT INTO NOTIFICATIONS (User_ID, Type, Content, Status, Time_Created, Time_Seen) VALUES (\'" +
                   data["benhAn"]["bacSiLamBenhAn"]["id"] + "', 'Created', JSON_OBJECT('name', '" + data["hanhChinh"]["hoTen"] + "', 'pid', '" + data["pid"] + "'), 'Chưa đọc', '" + data["lyDoVaoVien"]["ngayVaoVien"] + "', '');")
    conn.commit()

    response = jsonify({"result": True})
    cursor.close()
    conn.close()
    return response
