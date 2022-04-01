import { createAsyncThunk } from "@reduxjs/toolkit";
import { UtilsDateTime } from "../../utils";
import { initialHSBAState } from "../slices/HSBA.slice";

const danhSachHSBAThunk = {
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