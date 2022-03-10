import React, { Fragment, useState, useContext } from "react";
import { 
    Box, Table, TableRow, TableContainer, TableBody, TextField,
    TableHead, TableCell, TableSortLabel, Paper, Grid, Typography, IconButton, Divider
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
import { DateTimePicker } from "@mui/lab";

const headCells = [
    { id: 'ngayThang', numeric: false, label: 'Ngày tháng', width: '5%' },
    { id: 'tenDichTruyen', numeric: false, label: 'TÊN DỊCH TRUYỀN/HÀM LƯỢNG', width: '20%' },
    { id: 'soLuong', numeric: true, label: 'Số lượng (ml)', width: '6%' },
    { id: 'loSanXuat', numeric: false, label: 'Lô/Số sản xuất', width: '9%' },
    { id: 'tocDo', numeric: true, label: 'Tốc độ giọt/ph', width: '6%' },
    { id: 'thoiGianBatDau', numeric: false, label: 'Bắt đầu', width: '12%' },
    { id: 'thoiGianKetThuc', numeric: false, label: 'Kết thúc', width: '12%' },
    { id: 'BSChiDinh', numeric: false, label: 'Bác sĩ chỉ định', width: '15%' },
    { id: 'DDThucHien', numeric: false, label: 'Điều dưỡng thực hiện', width: '15%' }
];

const FPhieuTDTruyenDich = () => {
    const content = useSelector((state) => state.HSBA.phieuTDTruyenDich);
    const { role, name } = useSelector(state => state.auth.user);
    const { saveSec, setSaveSec } = useContext(HSBAContext);
    const dispatch = useDispatch();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('ngayThang');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [addNew, setAddNew] = useState(false);
    const [newNgayThang, setNewNgayThang] = useState(null);
    const EMPTY_NEW_VALUE = { tenDichTruyen: null, soLuong: 0, loSanXuat: '', tocDo: 0, thoiGianBatDau: null, thoiGianKetThuc: null, BSChiDinh: '', DDThucHien: name };
    const [newValues, setNewValues] = useState([EMPTY_NEW_VALUE]);
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
            && newValues.every(newValue => Object.values(newValue).every(nv => (typeof nv === 'number' && nv > 0) || (typeof nv !== 'number' && !!nv))))
        ) {
            dispatch(HSBAActions.updateDinhKemSection({
                section: 'phieuTDTruyenDich',
                value: {},
                newData: { 
                    ngayThang: newNgayThang.toISOString(), 
                    values: newValues.map((newValue) => {
                        newValue.thoiGianBatDau = newValue.thoiGianBatDau.toString();
                        newValue.thoiGianKetThuc = newValue.thoiGianKetThuc.toString();
                        return newValue;
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
                if (newValue.soLuong <= 0 && emptyErrs.findIndex(err => err === 'số lượng') === -1) emptyErrs.push('số lượng');
                if (!newValue.loSanXuat && emptyErrs.findIndex(err => err === 'lô sản xuất') === -1) emptyErrs.push('lô sản xuất');
                if (!newValue.tocDo && emptyErrs.findIndex(err => err === 'tốc độ') === -1) emptyErrs.push('tốc độ');
                if (!newValue.thoiGianBatDau && emptyErrs.findIndex(err => err === 'thời gian bắt đầu') === -1) emptyErrs.push('thời gian bắt đầu');
                if (!newValue.thoiGianKetThuc && emptyErrs.findIndex(err => err === 'thời gian kết thúc') === -1) emptyErrs.push('thời gian kết thúc');
                if (!newValue.BSChiDinh && emptyErrs.findIndex(err => err === 'bác sĩ chỉ định') === -1) emptyErrs.push('bác sĩ chỉ định');
                if (!!newValue.thoiGianKetThuc && !!newValue.thoiGianBatDau && newValue.thoiGianBatDau >= newValue.thoiGianKetThuc) timeErr = true;
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
                                                    {format(new Date(row.ngayThang), 'dd/MM')}
                                                </TableCell>
                                            </TableRow>
                                            {row.values.map((value, idx) => (
                                                <TableRow hover key={idx} sx={{ bgcolor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.04)' : 'white' }}>
                                                    <TableCell className="tableBodyBorderRight">{value.tenDichTruyen}</TableCell>
                                                    <TableCell className="tableBodyBorderRight">{value.soLuong}</TableCell>
                                                    <TableCell className="tableBodyBorderRight">{value.loSanXuat}</TableCell>
                                                    <TableCell className="tableBodyBorderRight">{value.tocDo}</TableCell>
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
                            <Typography component="span"><b>Ngày tháng: </b>{format(new Date(newNgayThang), "dd/MM/yyyy")}</Typography>
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
                                            value={newValue.tenDichTruyen}
                                            onChange={(_, value) => {
                                                const tValues = [...newValues];
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
                                        <TextField
                                            multiline
                                            fullWidth
                                            margin="dense"
                                            value={newValue.loSanXuat}
                                            onChange={(event) => {
                                                const tValues = [...newValues];
                                                tValues[idx].loSanXuat = event.target.value;
                                                setNewValues(tValues);
                                            }}
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
                                        <DateTimePicker 
                                            value={newValue.thoiGianBatDau}
                                            onChange={(newTime) => {
                                                const tValues = [...newValues];
                                                tValues[idx].thoiGianBatDau = newTime;
                                                setNewValues(tValues);
                                            }}
                                            OpenPickerButtonProps={{ size: "small", sx: { p: 0, '.MuiSvgIcon-root': { fontSize: 20 } } }}
                                            renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography fontWeight="bold">Thời gian kết thúc</Typography>
                                        <DateTimePicker 
                                            value={newValue.thoiGianKetThuc}
                                            onChange={(newTime) => {
                                                const tValues = [...newValues];
                                                tValues[idx].thoiGianKetThuc = newTime;
                                                setNewValues(tValues);
                                            }}
                                            OpenPickerButtonProps={{ size: "small", sx: { p: 0, '.MuiSvgIcon-root': { fontSize: 20 } } }}
                                            renderInput={(params) => 
                                                <TextField 
                                                    {...params} 
                                                    fullWidth 
                                                    margin="dense"
                                                    error={!!newValue.thoiGianKetThuc && !!newValue.thoiGianBatDau && newValue.thoiGianBatDau >= newValue.thoiGianKetThuc}
                                                />
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography fontWeight="bold">Bác sĩ chỉ định</Typography>
                                        <TextField
                                            multiline
                                            fullWidth
                                            margin="dense"
                                            value={newValue.BSChiDinh}
                                            onChange={(event) => {
                                                const tValues = [...newValues];
                                                tValues[idx].BSChiDinh = event.target.value;
                                                setNewValues(tValues);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography fontWeight="bold">Điều dưỡng thực hiện</Typography>
                                        <Box className="df aic">
                                            <TextField
                                                fullWidth
                                                margin="dense"
                                                value={name}
                                                disabled
                                            />
                                            <Typography sx={{ cursor: "pointer", ml: 2 }} color="primary" onClick={() => handleDelete(idx)}>
                                                Xóa
                                            </Typography>
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

            { role === "DD" && 
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