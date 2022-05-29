import { 
    Box, Paper, TableContainer, TableHead, TableBody, TableRow, 
    TableCell, Table, TableSortLabel, Grid, Typography, TextField, Radio, Card, CardHeader, CardContent, CircularProgress
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Add, ArrowRight, CancelOutlined, RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { visuallyHidden } from "@mui/utils";
import { format } from "date-fns";
import { UtilsTable, UtilsText } from "../../utils";
import { TablePagination, StyledTableRow, Button, SelectThuoc } from "../common";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import UserContext from "../../contexts/UserContext";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import SpellingErrorThunk from "../../redux/thunks/spellingError.thunk";
import { BoxLoiChinhTa } from "../boxes";

const SECTION_NAME = "Phiếu TD dị ứng thuốc";
const SECTION_FIELD = "phieuTDDiUngThuoc";

const headCells = [
    { id: 'ngayGioDungThuoc', align: 'left', label: 'Ngày', width: '10%', minWidth: 115 },
    { id: 'gioDungThuoc', align: 'left', label: 'Giờ', width: '5%', minWidth: 85 },
    { id: 'khoa', label: 'Khoa', width: '10%', minWidth: 115 },
    { id: 'thuocDiUng', align: 'left', label: 'THUỐC DỊ ỨNG', width: '20%', minWidth: 200 },
    { id: 'nghiNgo', align: 'center', label: 'Nghi ngờ', width: '5%', minWidth: 0 },
    { id: 'chacChan', align: 'center', label: 'Chắc chắn', width: '5%', minWidth: 0 },
    { id: 'bieuHienLamSang', align: 'left', label: 'Biểu hiện lâm sàng', width: '20%', minWidth: 250 },
    { id: 'bacSiXacNhan', align: 'left', label: 'Bác sĩ xác nhận chẩn đoán', width: '10%', minWidth: 170 },
    { id: 'ghiChu', align: 'left', label: 'Ghi chú', width: '15%', minWidth: 120 }
];

const FPhieuTDDiUngThuoc = () => {
    const content = useSelector((state) => state.HSBA.phieuTDDiUngThuoc);
    const { ngayRaVien } = useSelector((state) => state.HSBA.chanDoanKhiRaVien);
    const { loadingError } = useSelector((state) => state.spellingError);
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const { updating, confirmUpdate, khoa, trangThai } = useSelector((state) => state.HSBA);
    const { role, name, id } = useSelector((state) => state.auth.user);
    const { appearTime } = useContext(UserContext);
    const dispatch = useDispatch();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('ngayGioDungThuoc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [newNgayGioDungThuoc, setNewNgayGioDungThuoc] = useState(appearTime[SECTION_NAME]);
    const [newThuocDiUng, setNewThuocDiUng] = useState([null]);
    const [newKieuDiUng, setNewKieuDiUng] = useState('');
    const [newBieuHienLamSang, setNewBieuHienLamSang] = useState('');
    const [newGhiChu, setNewGhiChu] = useState('');
    const [errors, setErrors] = useState([]);
    const [hasChanged, setHasChanged] = useState(false);

    const [rows, setRows] = useState(content.data);
    const [text, setText] = useState([]);
    const [result, setResult] = useState([]);
    const [replaced, setReplaced] = useState([]);
    const [useResult, setUseResult] = useState([]);

    useEffect(() => {
        if (updating) {
            rows.slice(content.data.length).forEach((row) => {
                if (!loadingError) {
                    dispatch(SpellingErrorThunk.getProcessResult({ 
                        section: SECTION_NAME, 
                        subSection: row.ngayGioDungThuoc,
                        subSubSection: "Biểu hiện lâm sàng", 
                        text: row.bieuHienLamSang 
                    }));
                    dispatch(SpellingErrorThunk.getProcessResult({ 
                        section: SECTION_NAME, 
                        subSection: row.ngayGioDungThuoc,
                        subSubSection: "Ghi chú", 
                        text: row.ghiChu
                    }));
                }
            });
        }
        // eslint-disable-next-line
    }, [updating]);

    useEffect(() => {
        if (confirmUpdate) {
            var tRows = [...rows];
            tRows.slice(content.data.length).forEach((row, id) => {
                row.bieuHienLamSang = useResult[id].bieuHienLamSang 
                    ? UtilsText.replaceMaskWord(spellingError[row.ngayGioDungThuoc]["Biểu hiện lâm sàng"].detection, replaced[id].bieuHienLamSang)
                    : text[id].bieuHienLamSang;
                row.ghiChu = useResult[id].ghiChu 
                    ? UtilsText.replaceMaskWord(spellingError[row.ngayGioDungThuoc]["Ghi chú"].detection, replaced[id].ghiChu)
                    : text[id].ghiChu;
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
        setNewThuocDiUng([null]);
        setNewKieuDiUng('');
        setNewBieuHienLamSang('');
        setNewGhiChu('');
        setErrors([]);
    }

    const handleCancel = () => {
        clearData();
        setHasChanged(false);
    };
    
    const handleAdd = () => {
        if (newThuocDiUng.every(dn => !!dn) && !!newKieuDiUng && !!newBieuHienLamSang) {
            const now = new Date().toISOString();
            setRows([...rows, {
                ngayGioDungThuoc: now,
                khoa: khoa,
                thuocDiUng: newThuocDiUng,
                kieuDiUng: newKieuDiUng,
                bieuHienLamSang: newBieuHienLamSang,
                bacSiXacNhan: `${id} - ${name}`,
                ghiChu: newGhiChu
            }]);
            setNewNgayGioDungThuoc(now);
            setText([...text, { bieuHienLamSang: newBieuHienLamSang, ghiChu: newGhiChu }]);
            setResult([...result, { bieuHienLamSang: "", ghiChu: "" }]);
            setReplaced([...replaced, { bieuHienLamSang: [], ghiChu: [] }]);
            setUseResult([...useResult, { bieuHienLamSang: true, ghiChu: true }]);

            clearData();
            dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true, newKey: now }));
            setHasChanged(false);
        } else {
            let errs = [];
            if (newThuocDiUng.some(dn => !dn)) errs.push('THUỐC DỊ ỨNG');
            if (!newKieuDiUng) errs.push('Nghi ngờ/Chắc chắn');
            if (!newBieuHienLamSang) errs.push('Biểu hiện lâm sàng');
            setErrors(errs);
        }
    }

    useEffect(() => {
        const tResult = [...result], tReplaced = [...replaced], tRows = [...rows];
        rows.slice(content.data.length).forEach((row, id) => {
            if (typeof (spellingError[row.ngayGioDungThuoc]) !== "undefined") {    
                if (!spellingError[row.ngayGioDungThuoc]["Biểu hiện lâm sàng"].loading && !spellingError[row.ngayGioDungThuoc]["Biểu hiện lâm sàng"].error) {
                    tResult[id].bieuHienLamSang = spellingError[row.ngayGioDungThuoc]["Biểu hiện lâm sàng"];
                    tReplaced[id].bieuHienLamSang = spellingError[row.ngayGioDungThuoc]["Biểu hiện lâm sàng"].correction.map(res => ({ type: "correct", repText: res[1] }));
                    if (spellingError[row.ngayGioDungThuoc]["Biểu hiện lâm sàng"].correction.length === 0) {
                        tRows[content.data.length + id] = { ...tRows[content.data.length + id], bieuHienLamSang: spellingError[row.ngayGioDungThuoc]["Biểu hiện lâm sàng"].detection }; 
                    }
                } else if (spellingError[row.ngayGioDungThuoc]["Biểu hiện lâm sàng"].loading) {
                    tResult[id].bieuHienLamSang = ""; 
                    tReplaced[id].bieuHienLamSang = []; 
                }
                if (!spellingError[row.ngayGioDungThuoc]["Ghi chú"].loading && !spellingError[row.ngayGioDungThuoc]["Ghi chú"].error) {
                    tResult[id].ghiChu = spellingError[row.ngayGioDungThuoc]["Ghi chú"];
                    tReplaced[id].ghiChu = spellingError[row.ngayGioDungThuoc]["Ghi chú"].correction.map(res => ({ type: "correct", repText: res[1] }));
                    if (spellingError[row.ngayGioDungThuoc]["Ghi chú"].correction.length === 0) {
                        tRows[content.data.length + id] = { ...tRows[content.data.length + id], ghiChu: spellingError[row.ngayGioDungThuoc]["Ghi chú"].detection }; 
                    }
                } else if (spellingError[row.ngayGioDungThuoc]["Ghi chú"].loading) {
                    tResult[id].ghiChu = ""; 
                    tReplaced[id].ghiChu = []; 
                } 
            }
        });
        setResult(tResult); setReplaced(tReplaced); setRows(tRows);
        // eslint-disable-next-line
    }, [spellingError.loading]);

    const handleAddClick = () => {
        setNewThuocDiUng([...newThuocDiUng, null]);
        if (!hasChanged) {
            setHasChanged(true);
        }
    }

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
                                        align={headCell.align}
                                        sortDirection={orderBy === headCell.id ? order : false}
                                        width={headCell.width}
                                        sx={{ minWidth: headCell.minWidth }}
                                        className={id < headCells.length - 1 ? "tableHeadBorderRight" : ""} 
                                    >
                                        {headCell.id === "nghiNgo" || headCell.id === "chacChan" || headCell.id === "gioDungThuoc"
                                            ? headCell.label
                                            : (
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
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length === 0 && (role !== "BS" || updating || trangThai !== "Đang điều trị") ? (
                                <StyledTableRow>
                                    <TableCell colSpan={headCells.length} align="center">(<i>trống</i>)</TableCell>
                                </StyledTableRow>
                            ) : (rowsPerPage > 0
                                ? UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy))
                            ).map((row, index) => {
                                return (
                                    <StyledTableRow hover key={index}>
                                        <TableCell className="tableBodyBorderRight">{format(new Date(row.ngayGioDungThuoc), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{format(new Date(row.ngayGioDungThuoc), 'HH:mm')}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.khoa}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.thuocDiUng.join('\n')}</TableCell>
                                        <TableCell className="tableBodyBorderRight" align="center">
                                            {row.kieuDiUng === "Nghi ngờ" ? <RadioButtonChecked /> : <RadioButtonUnchecked />}
                                        </TableCell>
                                        <TableCell className="tableBodyBorderRight" align="center">
                                            {row.kieuDiUng === "Chắc chắn" ? <RadioButtonChecked /> : <RadioButtonUnchecked />}
                                        </TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.bieuHienLamSang}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.bacSiXacNhan}</TableCell>
                                        <TableCell>{row.ghiChu}</TableCell>
                                    </StyledTableRow>
                                );
                            })}

                            {(role === "BS" && !ngayRaVien && !updating && trangThai === "Đang điều trị") ?
                                <TableRow sx={{ '.MuiTableCell-root': { borderTop: '0.5px solid rgba(224, 224, 224, 1)' } }}>
                                    <TableCell className="tableBodyBorderRight">{format(new Date(newNgayGioDungThuoc), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell className="tableBodyBorderRight">{format(new Date(newNgayGioDungThuoc), 'HH:mm')}</TableCell>
                                    <TableCell className="tableBodyBorderRight">{khoa}</TableCell>
                                    <TableCell className="tableBodyBorderRight" sx={{ pb: 0.5 }}>
                                        {newThuocDiUng.map((thuocDiUng, id) => (
                                            <Box className="df aic" sx={{ mb: 1.5 }} key={id}>
                                                <SelectThuoc 
                                                    fullWidth
                                                    hamLuong={false}
                                                    placeholder="Thuốc dị ứng"
                                                    value={thuocDiUng}
                                                    onChange={(_, value) => {
                                                        const tThuocDiUng = [...newThuocDiUng];
                                                        tThuocDiUng[id] = value;
                                                        setNewThuocDiUng(tThuocDiUng);
                                                        if (!value) {
                                                            if (newThuocDiUng.every((thuoc, i) => (i !== id && !thuoc) || i === id)
                                                                && !newKieuDiUng && !newBieuHienLamSang && !newGhiChu) {
                                                                setHasChanged(false);
                                                            }
                                                        } else {
                                                            if (!hasChanged) {
                                                                setHasChanged(true);
                                                            }
                                                        }
                                                    }}
                                                    existValue={newThuocDiUng}
                                                />

                                                {id === newThuocDiUng.length - 1 
                                                    ? <Add sx={{ ml: 0.5, cursor: "pointer", color: "#999" }} onClick={handleAddClick} />
                                                : null}
                                            </Box>
                                        ))}
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight" align="center">
                                        <Radio 
                                            sx={{ p: 0 }} 
                                            checked={newKieuDiUng === "Nghi ngờ"} 
                                            onChange={() => { 
                                                setNewKieuDiUng("Nghi ngờ");
                                                if (!hasChanged) {
                                                    setHasChanged(true);
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight" align="center">
                                        <Radio 
                                            sx={{ p: 0 }} 
                                            checked={newKieuDiUng === "Chắc chắn"} 
                                            onChange={() => {
                                                setNewKieuDiUng("Chắc chắn");
                                                if (!hasChanged) {
                                                    setHasChanged(true);
                                                }
                                            }} 
                                        />
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <TextField
                                            multiline
                                            fullWidth
                                            value={newBieuHienLamSang}
                                            onChange={({ target: { value } }) => {
                                                setNewBieuHienLamSang(value);
                                                if (!value) {
                                                    if (newThuocDiUng.every((thuoc) => !thuoc) && !newKieuDiUng && !newGhiChu) {
                                                        setHasChanged(false);
                                                    }
                                                } else {
                                                    if (!hasChanged) {
                                                        setHasChanged(true);
                                                    }
                                                }
                                            }}
                                            inputProps={{ 'aria-label': 'bieu hien lam sang' }}
                                        />
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight">{`${id} - ${name}`}</TableCell>
                                    <TableCell>
                                        <TextField
                                            multiline
                                            fullWidth
                                            value={newGhiChu}
                                            onChange={({ target: { value } }) => {
                                                setNewGhiChu(value);
                                                if (!value) {
                                                    if (newThuocDiUng.every((thuoc) => !thuoc) && !newKieuDiUng && !newBieuHienLamSang) {
                                                        setHasChanged(false);
                                                    } 
                                                } else {
                                                    if (!hasChanged) {
                                                        setHasChanged(true);
                                                    }
                                                }
                                            }}
                                            inputProps={{ 'aria-label': 'ghi chu' }}
                                        />
                                    </TableCell>
                                </TableRow>
                            : null}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination 
                    id={`${SECTION_NAME}/SE`}
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
            && (spellingError[subKey]["Biểu hiện lâm sàng"].correction.length > 0 || spellingError[subKey]["Ghi chú"].correction.length > 0)) ? 
                <Card sx={{ mt: 2 }}>
                    <CardHeader 
                        title={`${SECTION_NAME} (Biểu hiện lâm sàng, Ghi chú) - Xử lý lỗi`} 
                        titleTypographyProps={{ fontWeight: "bold", color: "primary.dark" }} 
                    />
                    <CardContent sx={{ py: 0 }}>
                        {rows.slice(content.data.length).map((row, index) => (
                            spellingError[row.ngayGioDungThuoc]["Biểu hiện lâm sàng"].correction.length > 0 || spellingError[row.ngayGioDungThuoc]["Ghi chú"].correction.length > 0 ?
                                <Card key={index} sx={{ mb: 2 }}>
                                    <CardHeader 
                                        title={`Ngày giờ: ${format(new Date(row.ngayGioDungThuoc), "dd/MM/yyyy HH:mm")}`} 
                                        sx={{ bgcolor: "primary.light" }} 
                                        titleTypographyProps={{ fontWeight: "bold" }} 
                                    />
                                    <CardContent sx={{ pl: 1 }}>
                                        {spellingError[row.ngayGioDungThuoc]["Biểu hiện lâm sàng"].correction.length > 0 ? 
                                            <Box>
                                                <Box className="df">
                                                    <ArrowRight sx={{ mr: 1 }} color="primary" />
                                                    <Box sx={{ width: "100%" }}>
                                                        <Typography fontWeight="bold" color="primary" sx={{ mb: 1 }}>Biểu hiện lâm sàng</Typography>
                                                        
                                                        <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography>
                                                        <TextField 
                                                            fullWidth
                                                            multiline
                                                            margin="dense"
                                                            value={text[index].bieuHienLamSang}
                                                            onChange={({ target: { value } }) => {
                                                                const tText = [...text];
                                                                tText[index].bieuHienLamSang = value;
                                                                setText(tText);
                                                            }}
                                                            disabled={useResult[index].bieuHienLamSang}
                                                            inputProps={{ 'aria-label': 'original text' }}
                                                        />

                                                        {!!result[index].bieuHienLamSang && !spellingError[row.ngayGioDungThuoc]["Biểu hiện lâm sàng"].loading ? 
                                                            <BoxLoiChinhTa
                                                                result={result[index].bieuHienLamSang}
                                                                replaced={replaced[index].bieuHienLamSang}
                                                                setReplaced={(newReplaced) => {
                                                                    const tReplaced = [...replaced];
                                                                    tReplaced[index].bieuHienLamSang = newReplaced;
                                                                    setReplaced(tReplaced);
                                                                }}
                                                                useResult={useResult[index].bieuHienLamSang}
                                                                handleChangeCheckbox={(checked) => {
                                                                    const tUseResult = [...useResult];
                                                                    tUseResult[index].bieuHienLamSang = checked;
                                                                    setUseResult(tUseResult);
                                                                    if (checked) {
                                                                        dispatch(SpellingErrorActions.resetLoading({ 
                                                                            section: SECTION_NAME, subSection: row.ngayGioDungThuoc, subSubSection: "Biểu hiện lâm sàng" 
                                                                        }));
                                                                        dispatch(SpellingErrorThunk.getProcessResult({ 
                                                                            section: SECTION_NAME, subSection: row.ngayGioDungThuoc, 
                                                                            subSubSection: "Biểu hiện lâm sàng", text: text[index].bieuHienLamSang
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
                                            </Box>
                                        : null}

                                        {spellingError[row.ngayGioDungThuoc]["Ghi chú"].correction.length > 0 ?
                                            <Box sx={{ mt: spellingError[row.ngayGioDungThuoc]["Biểu hiện lâm sàng"].correction.length > 0 ? 3 : 0 }}>
                                                <Box className="df">
                                                    <ArrowRight sx={{ mr: 1 }} color="primary" />
                                                    <Box sx={{ width: "100%" }}>
                                                        <Typography fontWeight="bold" color="primary" sx={{ mb: 1 }}>Ghi chú</Typography>
                                                    
                                                        <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography>
                                                        <TextField 
                                                            fullWidth
                                                            multiline
                                                            margin="dense"
                                                            value={text[index].ghiChu}
                                                            onChange={({ target: { value } }) => {
                                                                const tText = [...text];
                                                                tText[index].ghiChu = value;
                                                                setText(tText);
                                                            }}
                                                            disabled={useResult[index].ghiChu}
                                                            inputProps={{ 'aria-label': 'original text' }}
                                                        />

                                                        {!!result[index].ghiChu && !spellingError[row.ngayGioDungThuoc]["Ghi chú"].loading ? 
                                                            <BoxLoiChinhTa
                                                                result={result[index].ghiChu}
                                                                replaced={replaced[index].ghiChu}
                                                                setReplaced={(newReplaced) => {
                                                                    const tReplaced = [...replaced];
                                                                    tReplaced[index].ghiChu = newReplaced;
                                                                    setReplaced(tReplaced);
                                                                }}
                                                                useResult={useResult[index].ghiChu}
                                                                handleChangeCheckbox={(checked) => {
                                                                    const tUseResult = [...useResult];
                                                                    tUseResult[index].ghiChu = checked;
                                                                    setUseResult(tUseResult);
                                                                    if (checked) {
                                                                        dispatch(SpellingErrorActions.resetLoading({ 
                                                                            section: SECTION_NAME, subSection: row.ngayGioDungThuoc, subSubSection: "Ghi chú" 
                                                                        }));
                                                                        dispatch(SpellingErrorThunk.getProcessResult({ 
                                                                            section: SECTION_NAME, subSection: row.ngayGioDungThuoc, 
                                                                            subSubSection: "Ghi chú", text: text[index].ghiChu 
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
                                            </Box>
                                        : null}
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

export default FPhieuTDDiUngThuoc;
