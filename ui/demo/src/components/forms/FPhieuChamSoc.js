import { 
    Box, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, TableSortLabel, Paper, TextField, Grid, Typography, 
    Select, MenuItem, Card, CardHeader, CardContent, CircularProgress
} from "@mui/material";
import { Add, ArrowRight, CancelOutlined, DoneAll, Loop } from "@mui/icons-material";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { visuallyHidden } from "@mui/utils";
import UtilsTable from "../../utils/table";
import { useSelector , useDispatch } from "react-redux";
import { format } from "date-fns";
import "../../styles/index.css";
import { TablePagination, Button, SelectYLenh, StyledTableRow } from "../common";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import UserContext from "../../contexts/UserContext";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import SpellingErrorThunk from "../../redux/thunks/spellingError.thunk";
import { BoxLoiChinhTa } from "../boxes";
import { UtilsText } from "../../utils";

const SECTION_NAME = "Phiếu chăm sóc";
const SECTION_FIELD = "phieuChamSoc";

const headCells = [
    { id: 'ngayGio', label: 'Ngày', width: '10%', minWidth: 115 },
    { id: 'gio', label: 'Giờ', width: '5%', minWidth: 85 },
    { id: 'khoa', label: 'Khoa', width: '10%', minWidth: 115 },
    { id: 'theoDoiDienBien', label: 'THEO DÕI DIỄN BIẾN', width: '25%', minWidth: 250 },
    { id: 'thucHienYLenh', label: 'THỰC HIỆN Y LỆNH', width: '30%', minWidth: 250 },
    { id: 'xacNhan', label: 'Xác nhận', width: '10%', minWidth: 160 },
    { id: 'dieuDuongGhi', label: 'Điều dưỡng ghi', width: '10%', minWidth: 170 }
];

const FPhieuChamSoc = () => {
    const content = useSelector((state) => state.HSBA.phieuChamSoc);
    const { ngayRaVien } = useSelector((state) => state.HSBA.chanDoanKhiRaVien);
    const { loadingError } = useSelector((state) => state.spellingError);
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const { updating, confirmUpdate, danhSachYLenh, khoa } = useSelector((state) => state.HSBA);
    const { role, name, id } = useSelector(state => state.auth.user);
    const { appearTime } = useContext(UserContext);
    const dispatch = useDispatch();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('ngayGio');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [newNgayGio, setNewNgayGio] = useState(appearTime[SECTION_NAME]);
    const [newTheoDoiDienBien, setNewTheoDoiDienBien] = useState(['']);
    const [newThucHienYLenh, setNewThucHienYLenh] = useState([{ yLenh: '', xacNhan: '' }]);
    const [errors, setErrors] = useState([]);
    const [hasChanged, setHasChanged] = useState(false);

    const [newDanhSachYLenh, setNewDanhSachYLenh] = useState(danhSachYLenh);
    const [rows, setRows] = useState(content.data);
    const [text, setText] = useState([]);
    const [result, setResult] = useState([]);
    const [replaced, setReplaced] = useState([]);
    const [useResult, setUseResult] = useState([]);

    useEffect(() => {
        if (updating) {
            dispatch(HSBAActions.updateSection({
                section: 'danhSachYLenh',
                data: newDanhSachYLenh
            }));
            rows.slice(content.data.length).forEach((row) => {
                row.theoDoiDienBien.forEach((tddb, index) => {
                    if (!loadingError) {
                        dispatch(SpellingErrorThunk.getProcessResult({ 
                            section: SECTION_NAME, subSection: row.ngayGio, subSecIndex: index, text: tddb 
                        }));
                    }
                });
            });
        }
        // eslint-disable-next-line
    }, [updating]);

    useEffect(() => {
        if (confirmUpdate) {
            var tRows = [...rows];
            tRows.slice(content.data.length).forEach((row, id) => {
                row.theoDoiDienBien.forEach((_, i) => {
                    row.theoDoiDienBien[i] = useResult[id][i]
                        ? UtilsText.replaceMaskWord(spellingError[row.ngayGio][i].detection, replaced[id][i])
                        : text[id][i];
                });                
            });
            dispatch(HSBAActions.updateAttachedSection({ 
                section: SECTION_FIELD, 
                value: { newDataLength: rows.length - content.data.length }, 
                newData: tRows 
            }));
        }
        // eslint-disable-next-line
    }, [confirmUpdate]);

    const createSortHandler = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const clearData = () => {
        setNewTheoDoiDienBien(['']);
        setNewThucHienYLenh([{ yLenh: '', xacNhan: '' }]);
        setErrors([]);
    }

    const handleCancel = () => {
        clearData();
        setHasChanged(false);
    };

    const handleAdd = () => {
        if (newTheoDoiDienBien.every(tddb => !! tddb) && newThucHienYLenh.every(thyl => !!thyl.yLenh && !!thyl.xacNhan)) {
            const now = new Date().toISOString();
            setRows([...rows, {
                ngayGio: now, 
                khoa: khoa, 
                theoDoiDienBien: newTheoDoiDienBien, 
                thucHienYLenh: newThucHienYLenh.map(thyl => thyl.yLenh),
                xacNhan: newThucHienYLenh.map(thyl => thyl.xacNhan),
                dieuDuongGhi: `${id} - ${name}`
            }]);
            setNewNgayGio(now);
            setText([...text, newTheoDoiDienBien]);
            setResult([...result, new Array(newTheoDoiDienBien.length).fill("")]);
            setReplaced([...replaced, new Array(newTheoDoiDienBien.length).fill([])]);
            setUseResult([...useResult, new Array(newTheoDoiDienBien.length).fill(true)]);
           
            newThucHienYLenh.forEach((thyl) => {
                const findIdx = newDanhSachYLenh.findIndex(dsyl => dsyl.khoa === khoa && dsyl.yLenh === thyl.yLenh), tFilterDSYL = [...newDanhSachYLenh];
                if (findIdx !== -1) {
                    tFilterDSYL[findIdx] = { ...tFilterDSYL[findIdx], xacNhan: thyl.xacNhan };
                    setNewDanhSachYLenh(tFilterDSYL);
                }
            })
            clearData();
            dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true, newKey: now, newKeyLength: newTheoDoiDienBien.length }));
            setHasChanged(false);
        } else {
            let errs = [];
            if (!newTheoDoiDienBien.every(tddb => !!tddb)) errs.push('THEO DÕI DIỄN BIẾN');
            if (!newThucHienYLenh.every(thyl => !!thyl.yLenh && !!thyl.xacNhan) 
                && errs.findIndex(err => err === 'THỰC HIỆN Y LỆNH') === -1) errs.push('THỰC HIỆN Y LỆNH');
            setErrors(errs);
        }
    };

    const handleAddClick = () => {
        setNewTheoDoiDienBien([...newTheoDoiDienBien, '']);
        setNewThucHienYLenh([...newThucHienYLenh, { yLenh: '', xacNhan: '' }]);
    }

    useEffect(() => {
        const tResult = [...result], tReplaced = [...replaced], tRows = [...rows];
        rows.slice(content.data.length).forEach((row, id) => {
            if (typeof (spellingError[row.ngayGio]) !== "undefined") {    
                row.theoDoiDienBien.forEach((_, i) => {
                    if (!spellingError[row.ngayGio][i].loading && !spellingError[row.ngayGio][i].error) {
                        tResult[id][i] = spellingError[row.ngayGio][i];
                        tReplaced[id][i] = spellingError[row.ngayGio][i].correction.map(res => ({ type: "correct", repText: res[1] }));
                        if (spellingError[row.ngayGio][i].correction.length === 0) {
                            const tTheoDoiDienBien = tRows[content.data.length + id].theoDoiDienBien;
                            tTheoDoiDienBien[i] = spellingError[row.ngayGio][i].detection;
                            tRows[content.data.length + id] = { ...tRows[content.data.length + id], theoDoiDienBien: tTheoDoiDienBien }; 
                        }
                    } else if (spellingError[row.ngayGio][i].loading) {
                        tResult[id][i] = ""; 
                        tReplaced[id][i] = []; 
                    }
                });
            }
        });
        setResult(tResult); setReplaced(tReplaced);
        // eslint-disable-next-line
    }, [spellingError.loading]);
    
    return (
        <>
            <Paper>
                <TableContainer>
                    <Table stickyHeader> 
                        <TableHead sx={{ '.MuiTableCell-root': { bgcolor: (theme) => theme.palette.primary.light } }}>
                            <TableRow>
                                {headCells.map((headCell, id) => (
                                    <TableCell
                                        key={id}
                                        align="left"
                                        sortDirection={orderBy === headCell.id ? order : false}
                                        width={headCell.width}
                                        sx={{ minWidth: headCell.minWidth }}
                                        className={id < headCells.length - 1 ? "tableHeadBorderRight" : ""} 
                                    >
                                        {headCell.id !== "gio" ?
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
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.length === 0 && (role !== "DD" || updating) ? (
                                <StyledTableRow>
                                    <TableCell colSpan={headCells.length} align="center">(<i>trống</i>)</TableCell>
                                </StyledTableRow>
                            ) : (rowsPerPage > 0
                                ? UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy))
                            ).map((row, index) => {
                                return (
                                    <Fragment key={index}>
                                        <TableRow hover sx={{ bgcolor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.06)' : 'rgba(0, 0, 0, 0.04)' }}>
                                            <TableCell className="tableBodyBorderRight" rowSpan={row.thucHienYLenh.length}>
                                                {format(new Date(row.ngayGio), 'dd/MM/yyyy')}
                                            </TableCell>
                                            <TableCell className="tableBodyBorderRight" rowSpan={row.thucHienYLenh.length}>
                                                {format(new Date(row.ngayGio), 'HH:mm')}
                                            </TableCell>
                                            <TableCell className="tableBodyBorderRight" rowSpan={row.thucHienYLenh.length}>
                                                {row.khoa}
                                            </TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.theoDoiDienBien[0]}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.thucHienYLenh[0]}</TableCell> 
                                            <TableCell className="tableBodyBorderRight">
                                                <Box className="df aic">
                                                    {row.xacNhan[0] === "Đang thực hiện" 
                                                        ? <Loop fontSize="small" sx={{ mr: 0.5 }} color="warning" /> 
                                                        : <DoneAll fontSize="small" sx={{ mr: 0.5 }} color="success" />
                                                    }
                                                    {row.xacNhan[0]}
                                                </Box>
                                            </TableCell>
                                            <TableCell rowSpan={row.thucHienYLenh.length}>{row.dieuDuongGhi}</TableCell>
                                        </TableRow>

                                        {row.thucHienYLenh.slice(1).map((thucHienYLenh, idx) => (
                                            <TableRow key={idx + 1} hover sx={{ bgcolor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.06)' : 'rgba(0, 0, 0, 0.04)' }}>
                                                <TableCell className="tableBodyBorderRight">{row.theoDoiDienBien[idx + 1]}</TableCell>
                                                <TableCell className="tableBodyBorderRight">
                                                    {thucHienYLenh}
                                                </TableCell> 
                                                <TableCell className="tableBodyBorderRight">
                                                    <Box className="df aic">
                                                        {row.xacNhan[idx + 1] === "Đang thực hiện" 
                                                            ? <Loop fontSize="small" sx={{ mr: 0.5 }} color="warning" /> 
                                                            : <DoneAll fontSize="small" sx={{ mr: 0.5 }} color="success" />
                                                        }
                                                        {row.xacNhan[idx + 1]}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </Fragment>
                                );
                            })}

                            {(role === "DD" && !ngayRaVien && !updating) ? 
                                <Fragment>
                                    <TableRow sx={{ '.MuiTableCell-root': { borderTop: '0.5px solid rgba(224, 224, 224, 1)' } }}>
                                        <TableCell className="tableBodyBorderRight" rowSpan={newThucHienYLenh.length}>{format(new Date(newNgayGio), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell className="tableBodyBorderRight" rowSpan={newThucHienYLenh.length}>{format(new Date(newNgayGio), 'HH:mm')}</TableCell>
                                        <TableCell className="tableBodyBorderRight" rowSpan={newThucHienYLenh.length}>{khoa}</TableCell>
                                        <TableCell className="tableBodyBorderRight">
                                            <TextField
                                                multiline
                                                fullWidth
                                                value={newTheoDoiDienBien[0]}
                                                onChange={({ target: { value } }) => {
                                                    const tTheoDoiDienBien = [...newTheoDoiDienBien];
                                                    tTheoDoiDienBien[0] = value;
                                                    setNewTheoDoiDienBien(tTheoDoiDienBien);
                                                    if (!value) {
                                                        if (newTheoDoiDienBien.every((tddb, i) => (i !== 0 && !tddb) || i === 0)
                                                            && newThucHienYLenh.every((thyl) => !thyl.yLenh && !thyl.xacNhan)) {
                                                            setHasChanged(false);
                                                        }
                                                    } else {
                                                        if (!hasChanged) {
                                                            setHasChanged(true);
                                                        }
                                                    }
                                                }}
                                                inputProps={{ 'aria-label': 'theo doi dien bien' }}
                                            />
                                        </TableCell>
                                        <TableCell className="tableBodyBorderRight">
                                            <Box className="df aic">
                                                <SelectYLenh 
                                                    fullWidth
                                                    value={newThucHienYLenh[0].yLenh}
                                                    onChange={({ target: { value } }) => {
                                                        const tThucHienYLenh = [...newThucHienYLenh];
                                                        tThucHienYLenh[0].yLenh = value;
                                                        tThucHienYLenh[0].xacNhan = "Đang thực hiện";
                                                        setNewThucHienYLenh(tThucHienYLenh);
                                                        if (!hasChanged) {
                                                            setHasChanged(true);
                                                        }
                                                    }}
                                                    existValue={newThucHienYLenh}
                                                    danhSachYLenh={newDanhSachYLenh.filter(dsyl => dsyl.khoa === khoa)}
                                                />

                                                {newThucHienYLenh.length === 1
                                                    && newDanhSachYLenh.filter(dsyl => newThucHienYLenh.findIndex(thyl => thyl.yLenh === dsyl.yLenh) === -1 
                                                    && dsyl.khoa === khoa && dsyl.xacNhan !== "Thực hiện xong").length > 0 
                                                        ? <Add sx={{ ml: 0.5, cursor: "pointer", color: "#999" }} onClick={handleAddClick} />
                                                    : null}
                                            </Box>         
                                        </TableCell>
                                        <TableCell className="tableBodyBorderRight">
                                            <Select 
                                                fullWidth 
                                                value={newThucHienYLenh[0].xacNhan}
                                                onChange={({ target: { value } }) => {
                                                    const tThucHienYLenh = [...newThucHienYLenh];
                                                    tThucHienYLenh[0].xacNhan = value;
                                                    setNewThucHienYLenh(tThucHienYLenh);
                                                    if (!hasChanged) {
                                                        setHasChanged(true);
                                                    }
                                                }}
                                                disabled={!newThucHienYLenh[0].yLenh}
                                            >
                                                <MenuItem value="Đang thực hiện">Đang thực hiện</MenuItem>
                                                <MenuItem value="Thực hiện xong">Thực hiện xong</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell rowSpan={newThucHienYLenh.length}>{`${id} - ${name}`}</TableCell>
                                    </TableRow>

                                    {newThucHienYLenh.slice(1).map((thucHienYLenh, idx) => (
                                        <TableRow key={idx + 1}>
                                            <TableCell className="tableBodyBorderRight">
                                                <TextField
                                                    multiline
                                                    fullWidth
                                                    value={newTheoDoiDienBien[idx + 1]}
                                                    onChange={({ target: { value } }) => {
                                                        const tTheoDoiDienBien = [...newTheoDoiDienBien];
                                                        tTheoDoiDienBien[idx + 1] = value;
                                                        setNewTheoDoiDienBien(tTheoDoiDienBien);
                                                        if (!value) {
                                                            if (newTheoDoiDienBien.every((tddb, i) => (i !== idx + 1 && !tddb) || i === idx + 1)
                                                                && newThucHienYLenh.every((thyl) => !thyl.yLenh && !thyl.xacNhan)) {
                                                                setHasChanged(false);
                                                            }
                                                        } else {
                                                            if (!hasChanged) {
                                                                setHasChanged(true);
                                                            }
                                                        }
                                                    }}
                                                    inputProps={{ 'aria-label': 'theo doi dien bien' }}
                                                />
                                            </TableCell>
                                            <TableCell className="tableBodyBorderRight">
                                                <Box className="df aic">
                                                    <SelectYLenh 
                                                        fullWidth
                                                        value={thucHienYLenh.yLenh}
                                                        onChange={({ target: { value } }) => {
                                                            const tThucHienYLenh = [...newThucHienYLenh];
                                                            tThucHienYLenh[idx + 1].yLenh = value;
                                                            tThucHienYLenh[idx + 1].xacNhan = "Đang thực hiện";
                                                            setNewThucHienYLenh(tThucHienYLenh);
                                                            if (!hasChanged) {
                                                                setHasChanged(true);
                                                            }
                                                        }}
                                                        existValue={newThucHienYLenh}
                                                        danhSachYLenh={newDanhSachYLenh.filter(dsyl => dsyl.khoa === khoa)}
                                                    />

                                                    {idx + 1 === newThucHienYLenh.length - 1
                                                        && newDanhSachYLenh.filter(dsyl => newThucHienYLenh.findIndex(thyl => thyl.yLenh === dsyl.yLenh) === -1 
                                                        && dsyl.khoa === khoa && dsyl.xacNhan !== "Thực hiện xong").length > 0 
                                                        ? <Add sx={{ ml: 0.5, cursor: "pointer", color: "#999" }} onClick={handleAddClick} />
                                                        : null}
                                                </Box>         
                                            </TableCell>
                                            <TableCell className="tableBodyBorderRight">
                                                <Select 
                                                    fullWidth 
                                                    value={thucHienYLenh.xacNhan}
                                                    onChange={({ target: { value } }) => {
                                                        const tThucHienYLenh = [...newThucHienYLenh];
                                                        tThucHienYLenh[idx + 1].xacNhan = value;
                                                        setNewThucHienYLenh(tThucHienYLenh);
                                                        if (!hasChanged) {
                                                            setHasChanged(true);
                                                        }
                                                    }}
                                                    disabled={!newThucHienYLenh[idx + 1].yLenh}
                                                >
                                                    <MenuItem value="Đang thực hiện">Đang thực hiện</MenuItem>
                                                    <MenuItem value="Thực hiện xong">Thực hiện xong</MenuItem>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </Fragment>
                            : null}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination 
                    id={SECTION_NAME}
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
                        {errors.length > 0 && <Typography color="error">Vui lòng nhập đầy đủ thông tin: <b>{errors.join(', ')}</b>.</Typography>}
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

            {updating && Object.keys(spellingError).some(subKey => !["changed", "loading"].includes(subKey) 
            && spellingError[subKey].some(subKeyValue => subKeyValue.correction.length > 0)) ? 
                <Card sx={{ mt: 2 }}>
                    <CardHeader
                        title={`${SECTION_NAME} (THEO DÕI DIẾN BIẾN) - Xử lý lỗi`} 
                        titleTypographyProps={{ fontWeight: "bold", color: "primary.dark" }} 
                    />
                    <CardContent sx={{ py: 0 }}>
                        {rows.slice(content.data.length).map((row, index) => (
                            spellingError[row.ngayGio].some(subKeyValue => subKeyValue.correction.length > 0) ?
                                <Card key={index} sx={{ mb: 2 }}>
                                    <CardHeader 
                                        title={`Ngày giờ: ${format(new Date(row.ngayGio), "dd/MM/yyyy HH:mm")}`} 
                                        sx={{ bgcolor: "primary.light" }} 
                                        titleTypographyProps={{ fontWeight: "bold" }} 
                                    />
                                    <CardContent sx={{ pl: 1 }}>
                                        {row.theoDoiDienBien.map((_, idx) => (
                                            spellingError[row.ngayGio][idx].correction.length > 0 ?
                                                <Box key={idx} className="df" sx={{ mb: idx < row.theoDoiDienBien.length - 1 ? 3 : 0 }}>
                                                    <ArrowRight sx={{ mr: 1 }} color="primary" />
                                                    <Box sx={{ width: "100%" }}>
                                                        <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography>
                                                        <TextField 
                                                            fullWidth
                                                            multiline
                                                            margin="dense"
                                                            value={text[index][idx]}
                                                            onChange={({ target: { value } }) => {
                                                                const tText = [...text];
                                                                tText[index][idx] = value;
                                                                setText(tText);
                                                            }}
                                                            disabled={useResult[index][idx]}
                                                            inputProps={{ 'aria-label': 'original text' }}
                                                        />

                                                        {!!result[index][idx] && !spellingError[row.ngayGio][idx].loading ? 
                                                            <BoxLoiChinhTa
                                                                result={result[index][idx]}
                                                                replaced={replaced[index][idx]}
                                                                setReplaced={(newReplaced) => {
                                                                    const tReplaced = [...replaced];
                                                                    tReplaced[index][idx] = newReplaced;
                                                                    setReplaced(tReplaced);
                                                                }}
                                                                useResult={useResult[index][idx]}
                                                                handleChangeCheckbox={(checked) => {
                                                                    const tUseResult = [...useResult];
                                                                    tUseResult[index][idx] = checked;
                                                                    setUseResult(tUseResult);
                                                                    if (checked) {
                                                                        dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: row.ngayGio, subSecIndex: idx }));
                                                                        dispatch(SpellingErrorThunk.getProcessResult({ 
                                                                            section: SECTION_NAME, subSection: row.ngayGio, subSecIndex: idx, text: text[index][idx]
                                                                        }));
                                                                    }
                                                                }}
                                                                handleUpdateSection={(newReplaced) => {}}
                                                            />
                                                        : ( 
                                                            <div className="df fdc aic jcc">
                                                                <CircularProgress size={20} sx={{ mt: 2, mb: 1, color: (theme) => theme.palette.primary.main }} />
                                                                <Typography color="primary">Đang xử lý...</Typography>
                                                            </div> 
                                                        )}
                                                    </Box>
                                                </Box>
                                            : null
                                        ))}
                                    </CardContent>
                                </Card>
                            : null
                        ))}
                    </CardContent>
                </Card>
            : null}
        </>
        
    )
}

export default FPhieuChamSoc;