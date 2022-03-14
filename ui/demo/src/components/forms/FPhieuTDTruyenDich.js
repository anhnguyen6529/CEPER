import React, { Fragment, useState, useContext } from "react";
import {  
    Box, Table, TableRow, TableContainer, TableBody, TextField, Select, MenuItem,
    TableHead, TableCell, TableSortLabel, Paper, Grid, Typography, IconButton, Divider, Autocomplete
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import { UtilsTable } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import "../../styles/index.css";
import { TablePagination, Button, SelectThuoc } from "../common";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import HSBAContext from "../../contexts/HSBAContext";
import mdSections from "../../constants/md_sections.json";
import doctorList from "../../constants/doctor_list.json";
import drugList from "../../constants/drug_list.json";
import { TimePicker } from "@mui/lab";

const headCells = [
    { id: 'ngayThang', numeric: false, label: 'Ngày tháng', width: '10%' },
    { id: 'tenDichTruyen', numeric: false, label: 'TÊN DỊCH TRUYỀN/HÀM LƯỢNG', width: '20%' },
    { id: 'soLuong', numeric: true, label: 'Số lượng (ml)', width: '6%' },
    { id: 'loSanXuat', numeric: false, label: 'Lô/Số sản xuất', width: '8%' },
    { id: 'tocDo', numeric: true, label: 'Tốc độ giọt/ph', width: '6%' },
    { id: 'thoiGianBatDau', numeric: false, label: 'Bắt đầu', width: '10%' },
    { id: 'thoiGianKetThuc', numeric: false, label: 'Kết thúc', width: '10%' },
    { id: 'BSChiDinh', numeric: false, label: 'Bác sĩ chỉ định', width: '15%' },
    { id: 'DDThucHien', numeric: false, label: 'Điều dưỡng thực hiện', width: '15%' }
];

const FPhieuTDTruyenDich = () => {
    const content = useSelector((state) => state.HSBA.phieuTDTruyenDich);
    const { ngayRaVien } = useSelector((state) => state.HSBA.chanDoanKhiRaVien);
    const { role, name } = useSelector(state => state.auth.user);
    const { saveSec, setSaveSec } = useContext(HSBAContext);
    const dispatch = useDispatch();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('ngayThang');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [addNew, setAddNew] = useState(false);
    const [newNgayThang, setNewNgayThang] = useState(null);
    const EMPTY_NEW_VALUE = { tenDichTruyen: null, soLuong: 0, loSanXuat: null, tocDo: 0, thoiGianBatDau: { ngay: '', gio: null }, thoiGianKetThuc: { ngay: '', gio: null }, BSChiDinh: null, DDThucHien: name };
    const [newValues, setNewValues] = useState([EMPTY_NEW_VALUE]);
    const [BSChiDinhKhac, setBSChiDinhKhac] = useState('');
    const [errors, setErrors] = useState([]);

    const rows = content.data;
    const sectionId = mdSections["order"].indexOf("Phiếu TD truyền dịch");

    const createSortHandler = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const clearData = () => {
        setNewNgayThang(null);
        setNewValues([EMPTY_NEW_VALUE]);
        setAddNew(false);
        setErrors([]);
    }

    const handleCancel = () => {
        clearData();
    };

    const handleSave = () => {
        if (!!newNgayThang && (newValues.length > 0 
            && newValues.every(newValue => !!newValue.tenDichTruyen && !!newValue.loSanXuat
                && ((newValue.BSChiDinh === "Khác" && !!BSChiDinhKhac) || (newValue.BSChiDinh !== "Khác" && !!newValue.BSChiDinh))
                && ((!!newValue.thoiGianBatDau.ngay && !!newValue.thoiGianBatDau.gio) && (!!newValue.thoiGianKetThuc.ngay && !!newValue.thoiGianKetThuc.gio) 
                    && new Date(newValue.thoiGianBatDau.ngay.concat(` ${newValue.thoiGianBatDau.gio.format("HH:mm")}`)) <
                        new Date(newValue.thoiGianKetThuc.ngay.concat(` ${newValue.thoiGianKetThuc.gio.format("HH:mm")}`)))))
        ) {
            dispatch(HSBAActions.updateDinhKemSection({
                section: 'phieuTDTruyenDich',
                value: {},
                newData: { 
                    ngayThang: newNgayThang.toISOString(), 
                    values: newValues.map((newValue) => {
                        return {
                            ...newValue, 
                            thoiGianBatDau: new Date(newValue.thoiGianBatDau.ngay.concat(` ${newValue.thoiGianBatDau.gio.format("HH:mm")}`)).toString(),
                            thoiGianKetThuc: new Date(newValue.thoiGianKetThuc.ngay.concat(` ${newValue.thoiGianKetThuc.gio.format("HH:mm")}`)).toString(),
                            BSChiDinh: newValue.BSChiDinh === "Khác" ? BSChiDinhKhac : newValue.BSChiDinh
                        };
                    })
                }
            }));
            let tSaveSec = [...saveSec];
            tSaveSec[sectionId] = new Date();
            setSaveSec(tSaveSec);
            clearData();
        } else {
            let errs = [], emptyErrs = [], timeErr = false;
            newValues.forEach(newValue => {
                if (!newValue.tenDichTruyen && emptyErrs.findIndex(err => err === 'tên dịch truyền') === -1) emptyErrs.push('tên dịch truyền');
                if (!newValue.loSanXuat && emptyErrs.findIndex(err => err === 'lô sản xuất') === -1) emptyErrs.push('lô sản xuất');
                if ((!newValue.thoiGianBatDau.ngay || !newValue.thoiGianBatDau.gio) && emptyErrs.findIndex(err => err === 'thời gian bắt đầu') === -1) emptyErrs.push('thời gian bắt đầu');
                if ((!newValue.thoiGianKetThuc.ngay || !newValue.thoiGianKetThuc.gio) && emptyErrs.findIndex(err => err === 'thời gian kết thúc') === -1) emptyErrs.push('thời gian kết thúc');
                if ((!newValue.BSChiDinh || (newValue.BSChiDinh === "Khác" && !BSChiDinhKhac)) && emptyErrs.findIndex(err => err === 'bác sĩ chỉ định') === -1) emptyErrs.push('bác sĩ chỉ định');
                if ((!!newValue.thoiGianBatDau.ngay && !!newValue.thoiGianBatDau.gio) && (!!newValue.thoiGianKetThuc.ngay && !!newValue.thoiGianKetThuc.gio) 
                    && new Date(newValue.thoiGianBatDau.ngay.concat(` ${newValue.thoiGianBatDau.gio.format("HH:mm")}`)) >=
                        new Date(newValue.thoiGianKetThuc.ngay.concat(` ${newValue.thoiGianKetThuc.gio.format("HH:mm")}`))) timeErr = true;
            })
            if (emptyErrs.length > 0) errs.push(["Vui lòng nhập đầy đủ thông tin:", emptyErrs.join(', ')]);
            if (timeErr) errs.push("Thời gian kết thúc phải sau thời gian bắt đầu (các ô viền đỏ)");
            setErrors(errs);
        }
    };

    const handleAddClick = () => {
        setNewValues([...newValues, EMPTY_NEW_VALUE]);
    }

    const handleDelete = (id) => {
        const tNewValues = [...newValues];
        tNewValues.splice(id, 1);
        setNewValues(tNewValues);
    }

    const CustomTableCell = ({ headCell, ...other }) => {    
        return (
            <TableCell
                align="center"
                sortDirection={orderBy === headCell.id ? order : false}
                width={headCell.width}
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
                            {UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <TableRow hover sx={{ bgcolor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.04)' : 'white' }}>
                                                <TableCell className="tableBodyBorderRight" rowSpan={row.values.length + 1}>
                                                    {format(new Date(row.ngayThang), "dd/MM/yyyy")}
                                                </TableCell>
                                            </TableRow>
                                            {row.values.map((value, idx) => (
                                                <TableRow hover key={idx} sx={{ bgcolor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.04)' : 'white' }}>
                                                    <TableCell className="tableBodyBorderRight">{value.tenDichTruyen}</TableCell>
                                                    <TableCell className="tableBodyBorderRight">{value.soLuong > 0 ? value.soLuong : ""}</TableCell>
                                                    <TableCell className="tableBodyBorderRight">{value.loSanXuat}</TableCell>
                                                    <TableCell className="tableBodyBorderRight">{value.tocDo > 0 ? value.tocDo : ""}</TableCell>
                                                    <TableCell className="tableBodyBorderRight">{format(new Date(value.thoiGianBatDau), "dd/MM/yyyy HH:mm")}</TableCell>
                                                    <TableCell className="tableBodyBorderRight">{format(new Date(value.thoiGianKetThuc), "dd/MM/yyyy HH:mm")}</TableCell>
                                                    <TableCell className="tableBodyBorderRight">{value.BSChiDinh}</TableCell>
                                                    <TableCell>{value.DDThucHien}</TableCell>
                                                </TableRow>
                                            ))}
                                        </Fragment>
                                    );
                            })}
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

            {addNew ? (
                <Paper sx={{ mt: 3 }}>
                    <Box sx={{ px: 2, py: 1, bgcolor: "#D9EFFE", borderRadius: "4px 4px 0px 0px" }}>
                        <Typography>
                            Phiếu TD truyền dịch - <i><b>Thêm mới</b></i> - {' '}
                            <Typography component="span"><b>Ngày tháng: </b>{format(new Date(newNgayThang), "dd/MM/yyyy")} - <b>Điều dưỡng thực hiện:</b> {name}</Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ py: 2 }}>
                        {newValues.map((newValue, idx) => (
                            <Box sx={{ px: 2 }} key={idx}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography fontWeight="bold">Tên dịch truyền/hàm lượng</Typography>
                                        <SelectThuoc 
                                            fullWidth
                                            inputProps={{ margin: "dense" }}
                                            placeholder="Tên dịch truyền/hàm lượng"
                                            value={newValue.tenDichTruyen}
                                            onChange={(_, value) => {
                                                let tValues = [...newValues];
                                                tValues[idx].tenDichTruyen = value;
                                                setNewValues(tValues);
                                            }}
                                            existValue={newValues.map((newValue) => newValue.tenDichTruyen)}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography fontWeight="bold">Số lượng (ml)</Typography>
                                        <TextField
                                            type="number"
                                            InputProps={{ inputProps: { min: 0 } }}
                                            fullWidth
                                            margin="dense"
                                            value={newValue.soLuong}
                                            onChange={(event) => {
                                                const tValues = [...newValues];
                                                tValues[idx].soLuong = event.target.value;
                                                setNewValues(tValues);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography fontWeight="bold">Lô/số sản xuất</Typography>
                                        <Autocomplete 
                                            value={newValue.loSanXuat}
                                            onChange={(_, value) => {
                                                const tValues = [...newValues];
                                                tValues[idx] = { ...tValues[idx], loSanXuat: value };
                                                setNewValues(tValues);
                                            }}
                                            renderInput={(params) => <TextField {...params} margin="dense" placeholder="Lô/số sản xuất" inputProps={{ ...params.inputProps, style: { paddingTop: 3, paddingBottom: 3 } }} />}
                                            options={!!newValue.tenDichTruyen 
                                                ? drugList.find(drug => drug.ten_hoat_chat + ' ' + drug.nong_do_ham_luong === newValue.tenDichTruyen).lo_san_xuat
                                                : []
                                            }
                                            disableClearable
                                            disabled={!newValue.tenDichTruyen}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography fontWeight="bold">Tốc độ giọt/ph</Typography>
                                        <TextField
                                            type="number"
                                            InputProps={{ inputProps: { min: 0 } }}
                                            fullWidth
                                            margin="dense"
                                            value={newValue.tocDo}
                                            onChange={(event) => {
                                                const tValues = [...newValues];
                                                tValues[idx].tocDo = event.target.value;
                                                setNewValues(tValues);
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                
                                <Grid container spacing={2} sx={{ pt: 0.5 }}>
                                    <Grid item xs={3}>
                                        <Typography fontWeight="bold">Thời gian bắt đầu</Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Select 
                                                    fullWidth
                                                    sx={{ mt: 1 }}
                                                    value={newValue.thoiGianBatDau.ngay}
                                                    onChange={(event) => {
                                                        const tValues = [...newValues];
                                                        tValues[idx] = { ...tValues[idx], thoiGianBatDau: { ...tValues[idx].thoiGianBatDau, ngay: event.target.value } };
                                                        setNewValues(tValues);
                                                    }}
                                                    displayEmpty
                                                    renderValue={(selected) => !selected ? "-- Chọn --" : format(new Date(selected), "dd/MM/yyyy")}
                                                >
                                                    <MenuItem value={format(new Date(newNgayThang).setDate(newNgayThang.getDate() - 1), "yyyy-MM-dd")}>
                                                        {format(new Date(newNgayThang).setDate(newNgayThang.getDate() - 1), "dd/MM/yyyy")}
                                                    </MenuItem>
                                                    <MenuItem value={format(new Date(newNgayThang), "yyyy-MM-dd")}>{format(new Date(newNgayThang), "dd/MM/yyyy")}</MenuItem>
                                                </Select>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TimePicker 
                                                    value={newValue.thoiGianBatDau.gio}
                                                    onChange={(newTime) => {
                                                        const tValues = [...newValues];
                                                        tValues[idx] = { ...tValues[idx], thoiGianBatDau: { ...tValues[idx].thoiGianBatDau, gio: newTime } };
                                                        setNewValues(tValues);
                                                    }}
                                                    OpenPickerButtonProps={{ size: "small", sx: { p: 0, '.MuiSvgIcon-root': { fontSize: 20 } } }}
                                                    renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography fontWeight="bold">Thời gian kết thúc</Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Select 
                                                    fullWidth
                                                    sx={{ mt: 1 }}
                                                    value={newValue.thoiGianKetThuc.ngay}
                                                    onChange={(event) => {
                                                        const tValues = [...newValues];
                                                        tValues[idx] = { ...tValues[idx], thoiGianKetThuc: { ...tValues[idx].thoiGianKetThuc, ngay: event.target.value } };
                                                        setNewValues(tValues);
                                                    }}
                                                    displayEmpty
                                                    renderValue={(selected) => !selected ? "-- Chọn --" : format(new Date(selected), "dd/MM/yyyy")}
                                                >
                                                    <MenuItem value={format(new Date(newNgayThang), "yyyy-MM-dd")}>{format(new Date(newNgayThang), "dd/MM/yyyy")}</MenuItem>
                                                    <MenuItem value={format(new Date(newNgayThang).setDate(newNgayThang.getDate() + 1), "yyyy-MM-dd")}>
                                                        {format(new Date(newNgayThang).setDate(newNgayThang.getDate() + 1), "dd/MM/yyyy")}
                                                    </MenuItem>
                                                </Select>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TimePicker 
                                                    value={newValue.thoiGianKetThuc.gio}
                                                    onChange={(newTime) => {
                                                        const tValues = [...newValues];
                                                        tValues[idx] = { ...tValues[idx], thoiGianKetThuc: { ...tValues[idx].thoiGianKetThuc, gio: newTime } };
                                                        setNewValues(tValues);
                                                    }}
                                                    OpenPickerButtonProps={{ size: "small", sx: { p: 0, '.MuiSvgIcon-root': { fontSize: 20 } } }}
                                                    renderInput={(params) => 
                                                        <TextField 
                                                            {...params} 
                                                            fullWidth 
                                                            margin="dense"
                                                            error={(!!newValue.thoiGianBatDau.ngay && !!newValue.thoiGianBatDau.gio)
                                                                && (!!newValue.thoiGianKetThuc.ngay && !!newValue.thoiGianKetThuc.gio) 
                                                                && new Date(newValue.thoiGianBatDau.ngay.concat(` ${newValue.thoiGianBatDau.gio.format("HH:mm")}`)) 
                                                                    >= new Date(newValue.thoiGianKetThuc.ngay.concat(` ${newValue.thoiGianKetThuc.gio.format("HH:mm")}`)) 
                                                            }
                                                        />
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography fontWeight="bold">Bác sĩ chỉ định</Typography>
                                        <Box className="df aic">
                                            <Grid container spacing={2}>
                                                <Grid item xs={newValue.BSChiDinh === "Khác" ? 6 : 12}>
                                                    <Autocomplete 
                                                        fullWidth
                                                        value={newValue.BSChiDinh}
                                                        onChange={(_, value) => {
                                                            const tValues = [...newValues];
                                                            tValues[idx] = { ...tValues[idx], BSChiDinh: value };
                                                            setNewValues(tValues);
                                                        }}
                                                        renderInput={(params) => <TextField {...params} margin="dense" placeholder="Bác sĩ chỉ định" inputProps={{ ...params.inputProps, style: { paddingTop: 3, paddingBottom: 3 } }} />}
                                                        options={[...doctorList.map(doctor => doctor.id + " - " + doctor.ho_ten), "Khác"]}
                                                        disableClearable
                                                    />
                                                </Grid>

                                                {newValue.BSChiDinh === "Khác" ?
                                                    <Grid item xs={6}>
                                                        <TextField 
                                                            fullWidth
                                                            margin="dense"
                                                            value={BSChiDinhKhac}
                                                            onChange={(event) => setBSChiDinhKhac(event.target.value)}
                                                            placeholder="Bác sĩ khác"
                                                        />
                                                    </Grid>
                                                : null}
                                            </Grid>

                                            {newValues.length > 1 && <Typography sx={{ cursor: "pointer", ml: 2 }} color="primary" onClick={() => handleDelete(idx)}>
                                                Xóa
                                            </Typography>}
                                        </Box>
                                    </Grid>
                                </Grid>

                                {idx === newValues.length - 1
                                    ? (
                                        <Box sx={{ width: "100%", textAlign: "center", mt: 1 }}>
                                            <IconButton size="small" onClick={handleAddClick}>
                                                <Add />
                                            </IconButton>
                                        </Box>
                                    )
                                    : <Divider sx={{ my: 2 }} />
                                }
                            </Box>
                        ))}
                    </Box>
                </Paper>
            ) : null}

            { (role === "DD" && !ngayRaVien) && 
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={9}>
                        {errors.length > 0 ? errors.map((error, id) => 
                            Array.isArray(error) 
                                ? <Typography key={id} color="error">{error[0]}{' '}<b>{error[1]}</b>.</Typography>
                                : <Typography key={id} color="error">{error}.</Typography>
                        ) : null}
                    </Grid>
                    <Grid item xs={3} align="right">
                        {!addNew
                        ? (
                            <Button 
                                sx={{ width: 150 }} 
                                startIcon={<Add fontSize="small"/>}
                                onClick={() => {
                                    setNewNgayThang(new Date());
                                    setAddNew(true);
                                }}
                            >
                                Thêm mới
                            </Button>
                        ) : (
                            <>
                                <Button variant="outlined" sx={{ mr: 2 }} onClick={handleCancel}>
                                    Hủy
                                </Button>

                                <Button variant="primary" onClick={handleSave}>
                                    Lưu tạm thời
                                </Button>
                            </>
                        )
                        }
                    </Grid>
                </Grid>
            }
        </>
    )
}

export default FPhieuTDTruyenDich;