import React, { Fragment, useState } from "react";
import {  
    Box, Table, TableRow, TableContainer, TableBody, TextField,
    TableHead, TableCell, TableSortLabel, Paper, Grid, Typography, Autocomplete
} from "@mui/material";
import { Add, CancelOutlined } from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import { UtilsTable } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import "../../styles/index.css";
import { TablePagination, Button, SelectThuoc } from "../common";
import doctorList from "../../constants/doctor_list.json";
import drugList from "../../constants/drug_list.json";
import { DatePicker, TimePicker } from "@mui/lab";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import moment from "moment";

const SECTION_NAME = "Phiếu TD truyền dịch";

const headCells = [
    { id: 'ngayThang', align: 'left', label: 'Ngày tháng', width: '10%', minWidth: 100 },
    { id: 'tenDichTruyen', align: 'left', label: 'TÊN DỊCH TRUYỀN/\nHÀM LƯỢNG', width: '20%', minWidth: 200 },
    { id: 'soLuong', align: 'center', label: 'Số lượng (ml)', width: '6%', minWidth: 110 },
    { id: 'loSanXuat', align: 'center', label: 'Lô/Số sản xuất', width: '8%', minWidth: 100 },
    { id: 'tocDo', align: 'center', label: 'Tốc độ giọt/ph', width: '6%', minWidth: 100 },
    { id: 'thoiGianBatDau', align: 'center', label: 'Bắt đầu', width: '10%', minWidth: 170 },
    { id: 'thoiGianKetThuc', align: 'center', label: 'Kết thúc', width: '10%', minWidth: 170 },
    { id: 'BSChiDinh', align: 'left', label: 'Bác sĩ chỉ định', width: '15%', minWidth: 170 },
    { id: 'DDThucHien', align: 'left', label: 'Điều dưỡng thực hiện', width: '15%', minWidth: 170 }
];

const setTimetoDate = (date, time) => {
    const dateObj = new Date(date), timeParams = time.format("HH:mm").split(":");
    dateObj.setHours(timeParams[0]);
    dateObj.setMinutes(timeParams[1]);
    dateObj.setSeconds(0);
    return dateObj;
}

const FPhieuTDTruyenDich = () => {
    const content = useSelector((state) => state.HSBA.phieuTDTruyenDich);
    const { ngayRaVien } = useSelector((state) => state.HSBA.chanDoanKhiRaVien);
    const { role, name, id } = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('ngayThang');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [newNgayThang, setNewNgayThang] = useState(null);
    const EMPTY_NEW_VALUE = { tenDichTruyen: null, soLuong: 0, loSanXuat: null, tocDo: 0, thoiGianBatDau: { ngay: null, gio: null }, thoiGianKetThuc: { ngay: null, gio: null }, BSChiDinh: null, DDThucHien: `${id} - ${name}` };
    const [newValues, setNewValues] = useState([EMPTY_NEW_VALUE]);
    const [errors, setErrors] = useState([]);
    const [hasChanged, setHasChanged] = useState(false);

    const [rows, setRows] = useState(content.data);

    const createSortHandler = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const clearData = () => {
        setNewNgayThang(null);
        setNewValues([EMPTY_NEW_VALUE]);
        setErrors([]);
    }

    const handleCancel = () => {
        clearData();
        setHasChanged(false);
    };

    const handleAdd = () => {
        if (!!newNgayThang && newValues.length > 0 && newValues.every(newValue => !!newValue.tenDichTruyen && !!newValue.loSanXuat && !!newValue.BSChiDinh
                && ((!!newValue.thoiGianBatDau && !!newValue.thoiGianBatDau.gio) && (!!newValue.thoiGianKetThuc.ngay && !!newValue.thoiGianKetThuc.gio) 
                    && setTimetoDate(newValue.thoiGianBatDau.ngay, newValue.thoiGianBatDau.gio) < setTimetoDate(newValue.thoiGianKetThuc.ngay, newValue.thoiGianKetThuc.gio)))
        ) {
            setRows([...rows, {
                ngayThang: format(new Date(newNgayThang), "yyyy-MM-dd"),
                values: newValues.map((newValue) => {
                    return {
                        ...newValue, 
                        thoiGianBatDau: setTimetoDate(newValue.thoiGianBatDau.ngay, newValue.thoiGianBatDau.gio).toISOString(),
                        thoiGianKetThuc: setTimetoDate(newValue.thoiGianKetThuc.ngay, newValue.thoiGianKetThuc.gio).toISOString()
                    }
                })
            }]);
           
            clearData();
            dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
            setHasChanged(false);
        } else {
            let errs = [], emptyErrs = [], timeErr = false;
            newValues.forEach(newValue => {
                if (!newValue.tenDichTruyen && emptyErrs.findIndex(err => err === 'tên dịch truyền') === -1) emptyErrs.push('tên dịch truyền');
                if (!newValue.loSanXuat && emptyErrs.findIndex(err => err === 'lô sản xuất') === -1) emptyErrs.push('lô sản xuất');
                if ((!newValue.thoiGianBatDau.ngay || !newValue.thoiGianBatDau.gio) && emptyErrs.findIndex(err => err === 'thời gian bắt đầu') === -1) emptyErrs.push('thời gian bắt đầu');
                if ((!newValue.thoiGianKetThuc.ngay || !newValue.thoiGianKetThuc.gio) && emptyErrs.findIndex(err => err === 'thời gian kết thúc') === -1) emptyErrs.push('thời gian kết thúc');
                if (!newValue.BSChiDinh && emptyErrs.findIndex(err => err === 'bác sĩ chỉ định') === -1) emptyErrs.push('bác sĩ chỉ định');
                if ((!!newValue.thoiGianBatDau.ngay && !!newValue.thoiGianBatDau.gio) && (!!newValue.thoiGianKetThuc.ngay && !!newValue.thoiGianKetThuc.gio) 
                    && setTimetoDate(newValue.thoiGianBatDau.ngay, newValue.thoiGianBatDau.gio) >= setTimetoDate(newValue.thoiGianKetThuc.ngay, newValue.thoiGianKetThuc.gio)) {
                    timeErr = true;
                }
            })
            if (emptyErrs.length > 0) errs.push(["Vui lòng nhập đầy đủ thông tin:", emptyErrs.join(', ')]);
            if (timeErr) errs.push("Thời gian kết thúc phải sau thời gian bắt đầu (các ô viền đỏ)");
            setErrors(errs);
        }
    };

    const handleAddClick = () => {
        setNewValues([...newValues, EMPTY_NEW_VALUE]);
        setHasChanged(true);
    }
    
    const CustomTableCell = ({ headCell, ...other }) => {    
        return (
            <TableCell
                align={headCell.align}
                sortDirection={orderBy === headCell.id ? order : false}
                width={headCell.width}
                sx={{ minWidth: headCell.minWidth }}
                {...other}
            >
                {headCell.id === 'ngayThang' ?
                    <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={createSortHandler(headCell.id)}
                    >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                            <Box component="span" sx={visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                        ) : null}
                    </TableSortLabel>
                : headCell.label}
            </TableCell>
        )
    }

    return (
        <>
            <Paper>
                <TableContainer>
                    <Table stickyHeader> 
                        <TableHead sx={{ '.MuiTableCell-root': { bgcolor: '#D9EFFE' } }}>
                            <TableRow>
                                {headCells.map((headCell, id) => (
                                    id < 5 || id > 6 
                                    ?   <CustomTableCell 
                                            key={`${headCell.id}Head`}
                                            headCell={headCell}
                                            rowSpan={2}
                                            className={id < headCells.length - 1 ? "tableHeadBorderRight" : ""} 
                                        />
                                    : (id === 5 
                                        ?   <TableCell 
                                                className="tableHeadBorderRight" 
                                                sx={{ borderBottom: '1px solid rgb(200, 200, 224)' }}
                                                key="thoiGian" 
                                                align="center" 
                                                colSpan={2}
                                            >
                                                Thời gian
                                            </TableCell> 
                                        : null )
                                ))}
                            </TableRow>
                            <TableRow>
                                {headCells.slice(5, 7).map((headCell) => (
                                    <CustomTableCell className="tableHeadBorderRight" key={`${headCell.id}Head`} headCell={headCell} />                     
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy))
                            ).map((row, index) => {
                                return (
                                    <Fragment key={index}>
                                        <TableRow hover sx={{ bgcolor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.04)' : 'white' }}>
                                            <TableCell className="tableBodyBorderRight" rowSpan={row.values.length}>
                                                {format(new Date(row.ngayThang), "dd/MM/yyyy")}
                                            </TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.values[0].tenDichTruyen}</TableCell>
                                            <TableCell className="tableBodyBorderRight" align="center">{row.values[0].soLuong > 0 ? row.values[0].soLuong : ""}</TableCell>
                                            <TableCell className="tableBodyBorderRight" align="center">{row.values[0].loSanXuat}</TableCell>
                                            <TableCell className="tableBodyBorderRight" align="center">{row.values[0].tocDo > 0 ? row.values[0].tocDo : ""}</TableCell>
                                            <TableCell className="tableBodyBorderRight" align="center">{format(new Date(row.values[0].thoiGianBatDau), "dd/MM/yyyy HH:mm")}</TableCell>
                                            <TableCell className="tableBodyBorderRight" align="center">{format(new Date(row.values[0].thoiGianKetThuc), "dd/MM/yyyy HH:mm")}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.values[0].BSChiDinh}</TableCell>
                                            <TableCell>{row.values[0].DDThucHien}</TableCell>
                                        </TableRow>
                                        {row.values.slice(1).map((value, idx) => (
                                            <TableRow hover key={idx + 1} sx={{ bgcolor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.04)' : 'white' }}>
                                                <TableCell className="tableBodyBorderRight">{value.tenDichTruyen}</TableCell>
                                                <TableCell className="tableBodyBorderRight" align="center">{value.soLuong > 0 ? value.soLuong : ""}</TableCell>
                                                <TableCell className="tableBodyBorderRight" align="center">{value.loSanXuat}</TableCell>
                                                <TableCell className="tableBodyBorderRight" align="center">{value.tocDo > 0 ? value.tocDo : ""}</TableCell>
                                                <TableCell className="tableBodyBorderRight" align="center">{format(new Date(value.thoiGianBatDau), "dd/MM/yyyy HH:mm")}</TableCell>
                                                <TableCell className="tableBodyBorderRight" align="center">{format(new Date(value.thoiGianKetThuc), "dd/MM/yyyy HH:mm")}</TableCell>
                                                <TableCell className="tableBodyBorderRight">{value.BSChiDinh}</TableCell>
                                                <TableCell>{value.DDThucHien}</TableCell>
                                            </TableRow>
                                        ))}
                                    </Fragment>
                                );
                            })}

                            {(role === "DD" && !ngayRaVien) ? 
                                <Fragment>
                                    <TableRow sx={{ '.MuiTableCell-root': { borderTop: '0.5px solid rgba(224, 224, 224, 1)' } }}>
                                        <TableCell className="tableBodyBorderRight" rowSpan={newValues.length}>
                                            {!!newNgayThang ? format(new Date(newNgayThang), 'dd/MM/yyyy') : ""}
                                        </TableCell>
                                        <TableCell className="tableBodyBorderRight">
                                            <Box className="df aic">
                                                <SelectThuoc 
                                                    fullWidth
                                                    placeholder="Dịch truyền"
                                                    value={newValues[0].tenDichTruyen}
                                                    onChange={(_, value) => {
                                                        let tValues = [...newValues];
                                                        tValues[0] = { ...tValues[0], tenDichTruyen: value, loSanXuat: null };
                                                        setNewValues(tValues);
                                                        if (!hasChanged) {
                                                            setHasChanged(true);
                                                        }
                                                    }}
                                                    existValue={newValues.map((newValue) => newValue.tenDichTruyen)}
                                                />

                                                {newValues.length === 1
                                                    ? <Add sx={{ ml: 0.5, cursor: "pointer", color: "#999" }} onClick={handleAddClick} />
                                                : null}
                                            </Box>
                                        </TableCell>
                                        <TableCell className="tableBodyBorderRight">
                                            <TextField
                                                type="number"
                                                InputProps={{ inputProps: { min: 0 } }}
                                                sx={{ '.MuiOutlinedInput-input': { px: '12px' } }}
                                                fullWidth
                                                value={newValues[0].soLuong}
                                                onChange={({ target: { value } }) => {
                                                    const tValues = [...newValues];
                                                    tValues[0] = { ...tValues[0], soLuong: !value ? 0 : parseInt(value) };
                                                    setNewValues(tValues);
                                                    if (!value || parseInt(value) === 0) {
                                                        if (newValues.every((value, i) => !value.tenDichTruyen && ((i !== 0 && value.soLuong === 0) || i === 0)
                                                        && !value.loSanXuat && value.tocDo === 0 && (!value.thoiGianBatDau.ngay && !value.thoiGianBatDau.gio)
                                                        && (!value.thoiGianKetThuc.ngay && !value.thoiGianKetThuc.gio) && !value.BSChiDinh)) {
                                                            setHasChanged(false);
                                                        }
                                                    } else {
                                                        if (!hasChanged) {
                                                            setHasChanged(true);
                                                        }
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="tableBodyBorderRight">
                                            <Autocomplete 
                                                value={newValues[0].loSanXuat}
                                                onChange={(_, value) => {
                                                    const tValues = [...newValues];
                                                    tValues[0] = { ...tValues[0], loSanXuat: value };
                                                    setNewValues(tValues);
                                                    if (!hasChanged) {
                                                        setHasChanged(true);
                                                    }
                                                }}
                                                renderInput={(params) => <TextField multiline {...params} inputProps={{ ...params.inputProps, style: { paddingTop: 3, paddingBottom: 3 } }} />}
                                                options={!!newValues[0].tenDichTruyen 
                                                    ? drugList.find(drug => drug.ten_hoat_chat + ' ' + drug.nong_do_ham_luong === newValues[0].tenDichTruyen).lo_san_xuat
                                                    : []
                                                }
                                                disableClearable
                                                disabled={!newValues[0].tenDichTruyen}
                                            />
                                        </TableCell>
                                        <TableCell className="tableBodyBorderRight">
                                            <TextField
                                                type="number"
                                                InputProps={{ inputProps: { min: 0 } }}
                                                sx={{ '.MuiOutlinedInput-input': { px: '12px' } }}
                                                fullWidth
                                                value={newValues[0].tocDo}
                                                onChange={({ target: { value } }) => {
                                                    const tValues = [...newValues];
                                                    tValues[0] = { ...tValues[0], tocDo: !value ? 0 : parseInt(value) };
                                                    setNewValues(tValues);
                                                    if (!value || parseInt(value) === 0) {
                                                        if (newValues.every((value, i) => !value.tenDichTruyen && value.soLuong === 0 && !value.loSanXuat 
                                                        && ((i !== 0 && value.tocDo === 0) || i === 0) && (!value.thoiGianBatDau.ngay && !value.thoiGianBatDau.gio)
                                                        && (!value.thoiGianKetThuc.ngay && !value.thoiGianKetThuc.gio) && !value.BSChiDinh)) {
                                                            setHasChanged(false);
                                                        }
                                                    } else {
                                                        if (!hasChanged) {
                                                            setHasChanged(true);
                                                        }
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="tableBodyBorderRight">
                                            <DatePicker
                                                value={newValues[0].thoiGianBatDau.ngay}
                                                onChange={(newDate) => {
                                                    const tValues = [...newValues];
                                                    tValues[0] = { ...tValues[0], thoiGianBatDau: { ...tValues[0].thoiGianBatDau, ngay: newDate } };
                                                    setNewValues(tValues);
                                                    setNewNgayThang(newDate);
                                                    if (!newDate) {
                                                        if (newValues.every((value, i) => !value.tenDichTruyen && value.soLuong === 0 && !value.loSanXuat 
                                                        && value.tocDo === 0 && (((i !== 0 && !value.thoiGianBatDau.ngay) || i === 0) && !value.thoiGianBatDau.gio)
                                                        && (!value.thoiGianKetThuc.ngay && !value.thoiGianKetThuc.gio) && !value.BSChiDinh)) {
                                                            setHasChanged(false);
                                                        }
                                                    } else {
                                                        if (!hasChanged) {
                                                            setHasChanged(true);
                                                        }
                                                    }
                                                }}
                                                minDate={moment(rows[rows.length - 1].values[rows[rows.length - 1].values.length - 1].thoiGianKetThuc)}
                                                renderInput={(params) => <TextField fullWidth {...params} />}
                                                inputFormat="DD/MM/yyyy"
                                                OpenPickerButtonProps={{ size: "small", sx: { px: 0, '.MuiSvgIcon-root': { fontSize: 20 } } }}
                                            />
                                            <TimePicker
                                                value={newValues[0].thoiGianBatDau.gio}
                                                onChange={(newTime) => {
                                                    const tValues = [...newValues];
                                                    tValues[0] = { ...tValues[0], thoiGianBatDau: { ...tValues[0].thoiGianBatDau, gio: newTime } };
                                                    setNewValues(tValues);
                                                    if (!newTime) {
                                                        if (newValues.every((value, i) => !value.tenDichTruyen && value.soLuong === 0 && !value.loSanXuat 
                                                        && value.tocDo === 0 && (!value.thoiGianBatDau.ngay && ((i !== 0 && !value.thoiGianBatDau.gio) || i === 0))
                                                        && (!value.thoiGianKetThuc.ngay && !value.thoiGianKetThuc.gio) && !value.BSChiDinh)) {
                                                            setHasChanged(false);
                                                        }
                                                    } else {
                                                        if (!hasChanged) {
                                                            setHasChanged(true);
                                                        }
                                                    }
                                                }}
                                                OpenPickerButtonProps={{ size: "small", sx: { '.MuiSvgIcon-root': { fontSize: 20 } } }}
                                                renderInput={(params) => <TextField {...params} fullWidth sx={{ mt: 1 }} />}
                                            />
                                        </TableCell>
                                        <TableCell className="tableBodyBorderRight">
                                            <DatePicker
                                                value={newValues[0].thoiGianKetThuc.ngay}
                                                onChange={(newDate) => {
                                                    const tValues = [...newValues];
                                                    tValues[0] = { ...tValues[0], thoiGianKetThuc: { ...tValues[0].thoiGianKetThuc, ngay: newDate } };
                                                    setNewValues(tValues);
                                                    if (!newDate) {
                                                        if (newValues.every((value, i) => !value.tenDichTruyen && value.soLuong === 0 && !value.loSanXuat 
                                                        && value.tocDo === 0 && (!value.thoiGianBatDau.ngay && !value.thoiGianBatDau.gio)
                                                        && (((i !== 0 && !value.thoiGianKetThuc.ngay) || i === 0) && !value.thoiGianKetThuc.gio) && !value.BSChiDinh)) {
                                                            setHasChanged(false);
                                                        }
                                                    } else {
                                                        if (!hasChanged) {
                                                            setHasChanged(true);
                                                        }
                                                    }
                                                }}
                                                minDate={moment(rows[rows.length - 1].values[rows[rows.length - 1].values.length - 1].thoiGianKetThuc)}
                                                renderInput={(params) => 
                                                    <TextField 
                                                        fullWidth 
                                                        {...params} 
                                                        error={(!!newValues[0].thoiGianBatDau.ngay && !!newValues[0].thoiGianBatDau.gio)
                                                            && (!!newValues[0].thoiGianKetThuc.ngay && !!newValues[0].thoiGianKetThuc.gio) 
                                                            && setTimetoDate(newValues[0].thoiGianBatDau.ngay, newValues[0].thoiGianBatDau.gio) 
                                                            >= setTimetoDate(newValues[0].thoiGianKetThuc.ngay, newValues[0].thoiGianKetThuc.gio) 
                                                        }
                                                    />
                                                }
                                                inputFormat="DD/MM/yyyy"
                                                OpenPickerButtonProps={{ size: "small", sx: { px: 0, '.MuiSvgIcon-root': { fontSize: 20 } } }}
                                            />
                                            <TimePicker
                                                value={newValues[0].thoiGianKetThuc.gio}
                                                onChange={(newTime) => {
                                                    const tValues = [...newValues];
                                                    tValues[0] = { ...tValues[0], thoiGianKetThuc: { ...tValues[0].thoiGianKetThuc, gio: newTime } };
                                                    setNewValues(tValues);
                                                    if (!newTime) {
                                                        if (newValues.every((value, i) => !value.tenDichTruyen && value.soLuong === 0 && !value.loSanXuat 
                                                        && value.tocDo === 0 && (!value.thoiGianBatDau.ngay && !value.thoiGianBatDau.gio)
                                                        && (!value.thoiGianKetThuc.ngay && ((i !== 0 && !value.thoiGianKetThuc.gio) || i === 0)) && !value.BSChiDinh)) {
                                                            setHasChanged(false);
                                                        }
                                                    } else {
                                                        if (!hasChanged) {
                                                            setHasChanged(true);
                                                        }
                                                    }
                                                }}
                                                OpenPickerButtonProps={{ size: "small", sx: { '.MuiSvgIcon-root': { fontSize: 20 } } }}
                                                renderInput={(params) => 
                                                    <TextField 
                                                        {...params} 
                                                        fullWidth 
                                                        sx={{ mt: 1 }}
                                                        error={(!!newValues[0].thoiGianBatDau.ngay && !!newValues[0].thoiGianBatDau.gio)
                                                            && (!!newValues[0].thoiGianKetThuc.ngay && !!newValues[0].thoiGianKetThuc.gio) 
                                                            && setTimetoDate(newValues[0].thoiGianBatDau.ngay, newValues[0].thoiGianBatDau.gio) 
                                                            >= setTimetoDate(newValues[0].thoiGianKetThuc.ngay, newValues[0].thoiGianKetThuc.gio) 
                                                        }
                                                    />
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="tableBodyBorderRight">
                                            <Autocomplete 
                                                fullWidth
                                                value={newValues[0].BSChiDinh}
                                                onChange={(_, value) => {
                                                    const tValues = [...newValues];
                                                    tValues[0] = { ...tValues[0], BSChiDinh: value };
                                                    setNewValues(tValues);
                                                    if (!hasChanged) {
                                                        setHasChanged(true);
                                                    }
                                                }}
                                                renderInput={(params) => <TextField {...params} multiline  placeholder="Bác sĩ" inputProps={{ ...params.inputProps, style: { paddingTop: 3, paddingBottom: 3 } }} />}
                                                options={doctorList.map(doctor => doctor.id + " - " + doctor.ho_ten)}
                                                disableClearable
                                                getOptionDisabled={(option) => newValues[0].BSChiDinh === option}
                                            />
                                        </TableCell>
                                        <TableCell>{`${id} - ${name}`}</TableCell>
                                    </TableRow>

                                    {newValues.slice(1).map((newValue, idx) => (
                                        <TableRow key={idx + 1}>
                                            <TableCell className="tableBodyBorderRight">
                                                <Box className="df aic">
                                                    <SelectThuoc 
                                                        fullWidth
                                                        placeholder="Dịch truyền"
                                                        value={newValue.tenDichTruyen}
                                                        onChange={(_, value) => {
                                                            let tValues = [...newValues];
                                                            tValues[idx + 1] = { ...tValues[idx + 1], tenDichTruyen: value, loSanXuat: null };
                                                            setNewValues(tValues);
                                                            if (!hasChanged) {
                                                                setHasChanged(true);
                                                            }
                                                        }}
                                                        existValue={newValues.map((newValue) => newValue.tenDichTruyen)}
                                                    />

                                                    {idx + 1 === newValues.length - 1
                                                        ? <Add sx={{ ml: 0.5, cursor: "pointer", color: "#999" }} onClick={handleAddClick} />
                                                    : null}
                                                </Box>
                                            </TableCell>
                                            <TableCell className="tableBodyBorderRight">
                                                <TextField
                                                    type="number"
                                                    InputProps={{ inputProps: { min: 0 } }}
                                                    sx={{ '.MuiOutlinedInput-input': { px: '12px' } }}
                                                    fullWidth
                                                    value={newValue.soLuong}
                                                    onChange={({ target: { value } }) => {
                                                        const tValues = [...newValues];
                                                        tValues[idx + 1] = { ...tValues[idx + 1], soLuong: !value ? 0 : parseInt(value) };
                                                        setNewValues(tValues);
                                                        if (!value || parseInt(value) === 0) {
                                                            if (newValues.every((value, i) => !value.tenDichTruyen && ((i !== idx + 1 && value.soLuong === 0) || i === idx + 1)
                                                            && !value.loSanXuat && value.tocDo === 0 && (!value.thoiGianBatDau.ngay && !value.thoiGianBatDau.gio)
                                                            && (!value.thoiGianKetThuc.ngay && !value.thoiGianKetThuc.gio) && !value.BSChiDinh)) {
                                                                setHasChanged(false);
                                                            }
                                                        } else {
                                                            if (!hasChanged) {
                                                                setHasChanged(true);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell className="tableBodyBorderRight">
                                                <Autocomplete 
                                                    value={newValue.loSanXuat}
                                                    onChange={(_, value) => {
                                                        const tValues = [...newValues];
                                                        tValues[idx + 1] = { ...tValues[idx + 1], loSanXuat: value };
                                                        setNewValues(tValues);
                                                        if (!hasChanged) {
                                                            setHasChanged(true);
                                                        }
                                                    }}
                                                    renderInput={(params) => <TextField multiline {...params} inputProps={{ ...params.inputProps, style: { paddingTop: 3, paddingBottom: 3 } }} />}
                                                    options={!!newValue.tenDichTruyen 
                                                        ? drugList.find(drug => drug.ten_hoat_chat + ' ' + drug.nong_do_ham_luong === newValue.tenDichTruyen).lo_san_xuat
                                                        : []
                                                    }
                                                    disableClearable
                                                    disabled={!newValue.tenDichTruyen}
                                                />
                                            </TableCell>
                                            <TableCell className="tableBodyBorderRight">
                                                <TextField
                                                    type="number"
                                                    InputProps={{ inputProps: { min: 0 } }}
                                                    sx={{ '.MuiOutlinedInput-input': { px: '12px' } }}
                                                    fullWidth
                                                    value={newValue.tocDo}
                                                    onChange={({ target: { value } }) => {
                                                        const tValues = [...newValues];
                                                        tValues[idx + 1] = { ...tValues[idx + 1], tocDo: !value ? 0 : parseInt(value) };
                                                        setNewValues(tValues);
                                                        if (!value || parseInt(value) === 0) {
                                                            if (newValues.every((value, i) => !value.tenDichTruyen && value.soLuong === 0 && !value.loSanXuat 
                                                            && ((i !== idx + 1 && value.tocDo === 0) || i === idx + 1) && (!value.thoiGianBatDau.ngay && !value.thoiGianBatDau.gio)
                                                            && (!value.thoiGianKetThuc.ngay && !value.thoiGianKetThuc.gio) && !value.BSChiDinh)) {
                                                                setHasChanged(false);
                                                            }
                                                        } else {
                                                            if (!hasChanged) {
                                                                setHasChanged(true);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell className="tableBodyBorderRight">
                                                <DatePicker
                                                    value={newValue.thoiGianBatDau.ngay}
                                                    onChange={(newDate) => {
                                                        const tValues = [...newValues];
                                                        tValues[idx + 1] = { ...tValues[idx + 1], thoiGianBatDau: { ...tValues[idx + 1].thoiGianBatDau, ngay: newDate } };
                                                        setNewValues(tValues);
                                                        if (!newDate) {
                                                            if (newValues.every((value, i) => !value.tenDichTruyen && value.soLuong === 0 && !value.loSanXuat 
                                                            && value.tocDo === 0 && (((i !== idx + 1 && !value.thoiGianBatDau.ngay) || i === idx + 1) && !value.thoiGianBatDau.gio)
                                                            && (!value.thoiGianKetThuc.ngay && !value.thoiGianKetThuc.gio) && !value.BSChiDinh)) {
                                                                setHasChanged(false);
                                                            }
                                                        } else {
                                                            if (!hasChanged) {
                                                                setHasChanged(true);
                                                            }
                                                        }
                                                    }}
                                                    minDate={moment(rows[rows.length - 1].values[rows[rows.length - 1].values.length - 1].thoiGianKetThuc)}
                                                    renderInput={(params) => <TextField fullWidth {...params} />}
                                                    inputFormat="DD/MM/yyyy"
                                                    OpenPickerButtonProps={{ size: "small", sx: { px: 0, '.MuiSvgIcon-root': { fontSize: 20 } } }}
                                                />
                                                <TimePicker
                                                    value={newValue.thoiGianBatDau.gio}
                                                    onChange={(newTime) => {
                                                        const tValues = [...newValues];
                                                        tValues[idx + 1] = { ...tValues[idx + 1], thoiGianBatDau: { ...tValues[idx + 1].thoiGianBatDau, gio: newTime } };
                                                        setNewValues(tValues);
                                                        if (!newTime) {
                                                            if (newValues.every((value, i) => !value.tenDichTruyen && value.soLuong === 0 && !value.loSanXuat 
                                                            && value.tocDo === 0 && (!value.thoiGianBatDau.ngay && ((i !== idx + 1 && !value.thoiGianBatDau.gio) || i === idx + 1))
                                                            && (!value.thoiGianKetThuc.ngay && !value.thoiGianKetThuc.gio) && !value.BSChiDinh)) {
                                                                setHasChanged(false);
                                                            }
                                                        } else {
                                                            if (!hasChanged) {
                                                                setHasChanged(true);
                                                            }
                                                        }
                                                    }}
                                                    OpenPickerButtonProps={{ size: "small", sx: { '.MuiSvgIcon-root': { fontSize: 20 } } }}
                                                    renderInput={(params) => <TextField {...params} fullWidth sx={{ mt: 1 }} />}
                                                />
                                            </TableCell>
                                            <TableCell className="tableBodyBorderRight">
                                                <DatePicker
                                                    value={newValue.thoiGianKetThuc.ngay}
                                                    onChange={(newDate) => {
                                                        const tValues = [...newValues];
                                                        tValues[idx + 1] = { ...tValues[idx + 1], thoiGianKetThuc: { ...tValues[idx + 1].thoiGianKetThuc, ngay: newDate } };
                                                        setNewValues(tValues);
                                                        if (!newDate) {
                                                            if (newValues.every((value, i) => !value.tenDichTruyen && value.soLuong === 0 && !value.loSanXuat 
                                                            && value.tocDo === 0 && (!value.thoiGianBatDau.ngay && !value.thoiGianBatDau.gio)
                                                            && (((i !== idx + 1 && !value.thoiGianKetThuc.ngay) || i === idx + 1) && !value.thoiGianKetThuc.gio) && !value.BSChiDinh)) {
                                                                setHasChanged(false);
                                                            }
                                                        } else {
                                                            if (!hasChanged) {
                                                                setHasChanged(true);
                                                            }
                                                        }
                                                    }}
                                                    minDate={moment(rows[rows.length - 1].values[rows[rows.length - 1].values.length - 1].thoiGianKetThuc)}
                                                    renderInput={(params) => 
                                                        <TextField 
                                                            fullWidth 
                                                            {...params} 
                                                            error={(!!newValue.thoiGianBatDau.ngay && !!newValue.thoiGianBatDau.gio)
                                                                && (!!newValue.thoiGianKetThuc.ngay && !!newValue.thoiGianKetThuc.gio) 
                                                                && setTimetoDate(newValue.thoiGianBatDau.ngay, newValue.thoiGianBatDau.gio) 
                                                                >= setTimetoDate(newValue.thoiGianKetThuc.ngay, newValue.thoiGianKetThuc.gio) 
                                                            }
                                                        />
                                                    }
                                                    inputFormat="DD/MM/yyyy"
                                                    OpenPickerButtonProps={{ size: "small", sx: { px: 0, '.MuiSvgIcon-root': { fontSize: 20 } } }}
                                                />
                                                <TimePicker
                                                    value={newValue.thoiGianKetThuc.gio}
                                                    onChange={(newTime) => {
                                                        const tValues = [...newValues];
                                                        tValues[idx + 1] = { ...tValues[idx + 1], thoiGianKetThuc: { ...tValues[idx + 1].thoiGianKetThuc, gio: newTime } };
                                                        setNewValues(tValues);
                                                        if (!newTime) {
                                                            if (newValues.every((value, i) => !value.tenDichTruyen && value.soLuong === 0 && !value.loSanXuat 
                                                            && value.tocDo === 0 && (!value.thoiGianBatDau.ngay && !value.thoiGianBatDau.gio)
                                                            && (!value.thoiGianKetThuc.ngay && ((i !== idx + 1 && !value.thoiGianKetThuc.gio) || i === idx + 1)) && !value.BSChiDinh)) {
                                                                setHasChanged(false);
                                                            }
                                                        } else {
                                                            if (!hasChanged) {
                                                                setHasChanged(true);
                                                            }
                                                        }
                                                    }}
                                                    OpenPickerButtonProps={{ size: "small", sx: { '.MuiSvgIcon-root': { fontSize: 20 } } }}
                                                    renderInput={(params) => 
                                                        <TextField 
                                                            {...params} 
                                                            fullWidth 
                                                            sx={{ mt: 1 }}
                                                            error={(!!newValue.thoiGianBatDau.ngay && !!newValue.thoiGianBatDau.gio)
                                                                && (!!newValue.thoiGianKetThuc.ngay && !!newValue.thoiGianKetThuc.gio) 
                                                                && setTimetoDate(newValue.thoiGianBatDau.ngay, newValue.thoiGianBatDau.gio) 
                                                                >= setTimetoDate(newValue.thoiGianKetThuc.ngay, newValue.thoiGianKetThuc.gio) 
                                                            }
                                                        />
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="tableBodyBorderRight">
                                                <Autocomplete 
                                                    fullWidth
                                                    value={newValue.BSChiDinh}
                                                    onChange={(_, value) => {
                                                        const tValues = [...newValues];
                                                        tValues[idx + 1] = { ...tValues[idx + 1], BSChiDinh: value };
                                                        setNewValues(tValues);
                                                        if (!hasChanged) {
                                                            setHasChanged(true);
                                                        }
                                                    }}
                                                    renderInput={(params) => <TextField {...params} multiline  placeholder="Bác sĩ" inputProps={{ ...params.inputProps, style: { paddingTop: 3, paddingBottom: 3 } }} />}
                                                    options={doctorList.map(doctor => doctor.id + " - " + doctor.ho_ten)}
                                                    disableClearable
                                                    getOptionDisabled={(option) => newValue.BSChiDinh === option}
                                                />
                                            </TableCell>
                                            <TableCell>{`${id} - ${name}`}</TableCell>
                                        </TableRow>
                                    ))}
                                </Fragment>
                            : null}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination 
                    length={rows.length}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    page={page}
                    setPage={setPage}
                />
            </Paper>

            {hasChanged && 
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={8}>
                        {errors.length > 0 ? errors.map((error, id) => 
                            Array.isArray(error) 
                                ? <Typography key={id} color="error">{error[0]}{' '}<b>{error[1]}</b>.</Typography>
                                : <Typography key={id} color="error">{error}.</Typography>
                        ) : null}
                    </Grid>
                    <Grid item xs={4} align="right">
                        <>
                            <Button startIcon={<CancelOutlined />} variant="outlined" sx={{ mr: 2 }} onClick={handleCancel}>
                                Hủy
                            </Button>

                            <Button startIcon={<Add />} variant="primary" onClick={handleAdd}>
                                Thêm
                            </Button>
                        </>
                    </Grid>
                </Grid>
            }
        </>
    )
}

export default FPhieuTDTruyenDich;