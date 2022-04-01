import { createAsyncThunk } from "@reduxjs/toolkit";
import { UtilsDateTime } from "../../utils";
import { initialHSBAState } from "../slices/HSBA.slice";
import { datas as HSBADatas } from "./HSBA.thunk";

const datas = { hienTai: [], raVien: [] };
HSBADatas.forEach((data) => {
    if (data.trangThai === 'Đã ra viện') {
        datas.raVien.push({
            pid: data.pid, 
            avatar: data.avatar, 
            trangThai: data.trangThai,
            khoa: data.khoa,
            hoTen: data.hanhChinh.hoTen,
            tuoi: UtilsDateTime.getAge(data.hanhChinh.ngaySinh),
            gioiTinh: data.hanhChinh.gioiTinh,
            ngayVaoVien: data.lyDoVaoVien.ngayVaoVien,
            ngayRaVien: data.chanDoanKhiRaVien.ngayRaVien,
            chanDoanKhiRaVien: data.chanDoanKhiRaVien.chanDoan,
            tinhTrangRaVien: data.tinhTrangRaVien,
            bacSiLamBenhAn: data.benhAn.bacSiLamBenhAn,
            bacSiDieuTri: data.tongKetBenhAn.bacSiDieuTri
        });
    } else {
        datas.hienTai.push({
            pid: data.pid, 
            avatar: data.avatar, 
            trangThai: data.trangThai,
            hoTen: data.hanhChinh.hoTen,
            tuoi: UtilsDateTime.getAge(data.hanhChinh.ngaySinh),
            gioiTinh: data.hanhChinh.gioiTinh,
            khoa: data.khoa,
            phong: data.phong,
            giuong: data.giuong,
            benhDieuTri: data.chanDoanBanDau,
            tinhTrangHienTai: data.toDieuTri.data[data.toDieuTri.data.length - 1].dienBienBenh,
            ngayVaoVien: data.lyDoVaoVien.ngayVaoVien,
            bacSiLamBenhAn: data.benhAn.bacSiLamBenhAn,
            bacSiDieuTri: data.tongKetBenhAn.bacSiDieuTri
        });
    }
});

const danhSachHSBAThunk = {
    getDanhSachHSBA: createAsyncThunk(
        'danhSachHSBA/getDanhSachHSBA', 
        async ({ role, doctorID}) => {
            try {
                let danhSachHSBA = { ...datas };
                if (role === 'BS') {
                    danhSachHSBA.hienTai.filter(ht => ht.bacSiDieuTri.id === doctorID || ht.bacSiLamBenhAn.id === doctorID);
                    danhSachHSBA.raVien.filter(rv => rv.bacSiDieuTri.id === doctorID || rv.bacSiLamBenhAn.id === doctorID);
                }
                return danhSachHSBA;
            } catch (error) {
                return error.message;
            }
        }
    ),
    getNewPID: createAsyncThunk(
        'danhSachHSBA/getNewPID',
        async () => {
            try {
                const newPID = '12347';
                return newPID;
            } catch (error) {
                return error.message;
            }
        }
    ),
    createNewHSBA: createAsyncThunk(
        'danhSachHSBA/createNewHSBA',
        async (apiData) => {
            try {
                const newFullHSBA = { ...initialHSBAState, ...apiData };
                const newHSBA = {
                    pid: newFullHSBA.pid,
                    hoTen: newFullHSBA.hanhChinh.hoTen,
                    trangThai: newFullHSBA.trangThai,
                    tuoi: UtilsDateTime.getAge(newFullHSBA.hanhChinh.ngaySinh),
                    gioiTinh: newFullHSBA.hanhChinh.gioiTinh,
                    khoa: newFullHSBA.khoa,
                    phong: newFullHSBA.phong,
                    giuong: newFullHSBA.giuong,
                    benhDieuTri: '',
                    tinhTrangHienTai: '',
                    ngayVaoVien: newFullHSBA.lyDoVaoVien.ngayVaoVien
                }
                return newHSBA;
            } catch (error) {
                return error.message;
            }
        }
    )
}

export default danhSachHSBAThunk;