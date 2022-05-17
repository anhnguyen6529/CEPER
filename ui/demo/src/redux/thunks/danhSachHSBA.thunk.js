import { createAsyncThunk } from "@reduxjs/toolkit";
import danhSachHSBAApi from "../../apis/danhSachHSBA";
import { initialHSBAState } from "../slices/HSBA.slice";

const danhSachHSBAThunk = {
    getDanhSachHSBA: createAsyncThunk(
        'danhSachHSBA/getDanhSachHSBA', 
        async ({ doctorID, department }, { rejectWithValue }) => {
            try {
                const apiResponse = await danhSachHSBAApi.getDanhSachHSBA({ doctorID, department });

                if (apiResponse.status !== 200) {
                    throw new Error(apiResponse.statusText);
                }

                return apiResponse.data;
            } catch (error) {
                return rejectWithValue(error.response.data.msg);
            }
        }
    ),
    getNewPID: createAsyncThunk(
        'danhSachHSBA/getNewPID',
        async (_, { rejectWithValue }) => {
            try {
                const apiResponse = await danhSachHSBAApi.getNewPID();

                if (apiResponse.status !== 200) {
                    throw new Error(apiResponse.statusText);
                }

                return apiResponse.data;
            } catch (error) {
                return rejectWithValue(error.response.data.msg);
            }
        }
    ),
    createNewHSBA: createAsyncThunk(
        'danhSachHSBA/createNewHSBA',
        async (apiData, { rejectWithValue }) => {
            try {
                const newFullHSBA = { ...initialHSBAState, ...apiData };
                const newHSBA = {
                    pid: newFullHSBA.pid,
                    hoTen: newFullHSBA.hanhChinh.hoTen,
                    trangThai: newFullHSBA.trangThai,
                    ngaySinh: newFullHSBA.hanhChinh.ngaySinh,
                    gioiTinh: newFullHSBA.hanhChinh.gioiTinh,
                    khoa: newFullHSBA.khoa,
                    phong: newFullHSBA.phong,
                    giuong: newFullHSBA.giuong,
                    benhDieuTri: '',
                    tinhTrangHienTai: '',
                    ngayVaoVien: newFullHSBA.lyDoVaoVien.ngayVaoVien
                }

                const apiResponse = await danhSachHSBAApi.createNewHSBA(newFullHSBA);

                if (apiResponse.status !== 200) {
                    throw new Error(apiResponse.statusText);
                }

                return newHSBA;
            } catch (error) {
                return rejectWithValue(error.response.data.msg);
            }
        }
    )
}

export default danhSachHSBAThunk;