import { 
    Box, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, TableSortLabel, Paper, TextField, Grid, Typography, Card, CardHeader, CardContent, CircularProgress
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { visuallyHidden } from "@mui/utils";
import UtilsTable from "../../utils/table";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import "../../styles/index.css";
import { TablePagination, Button, StyledTableRow } from "../common";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import UserContext from "../../contexts/UserContext";
import { Add, ArrowRight, CancelOutlined } from "@mui/icons-material";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import SpellingErrorThunk from "../../redux/thunks/spellingError.thunk";
import { BoxLoiChinhTa } from "../boxes";
import { UtilsText } from "../../utils";

const SECTION_NAME = "Tờ điều trị";
const SECTION_FIELD = "toDieuTri";

const headCells = [
    { id: 'ngayGio', label: 'Ngày', width: '10%', minWidth: 115 },
    { id: 'gio', label: 'Giờ', width: '5%', minWidth: 85 },
    { id: 'khoaDieuTri', label: 'Khoa điều trị', width: '10%', minWidth: 115 },
    { id: 'chanDoan', label: 'CHẨN ĐOÁN', width: '15%', minWidth: 170 },
    { id: 'dienBienBenh', numeric: true, label: 'DIỄN BIẾN BỆNH', width: '25%', minWidth: 250 },
    { id: 'yLenh', numeric: true, label: 'Y LỆNH', width: '25%', minWidth: 250 },
    { id: 'bacSiGhi', label: 'Bác sĩ ghi', width: '10%', minWidth: 120 },
];

const removeHashAndSpaces = (arrStr) => {
    let rArr = [];
    arrStr.forEach((str) => {
        let idx = 0;
        while (str[idx] === ' ' || str[idx] === '-') {
            idx++;
        }
        if (str.slice(idx) !== "") {
            rArr.push(str.slice(idx));
        }
    })
    return rArr;
}

const FToDieuTri = () => {
    const content = useSelector((state) => state.HSBA.toDieuTri);
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
    const [newChanDoan, setNewChanDoan] = useState('');
    const [newDienBienBenh, setNewDienBienBenh] = useState('');
    const [newYLenh, setNewYLenh] = useState('');
    const [errors, setErrors] = useState([]);
    const [hasChanged, setHasChanged] = useState(false);

    const [rows, setRows] = useState(content.data);
    const [text, setText] = useState([]);
    const [result, setResult] = useState([]);
    const [replaced, setReplaced] = useState([]);
    const [useResult, setUseResult] = useState([]);

    useEffect(() => {
        if (updating) {
            const newDanhSachYLenh = [];
            rows.slice(content.data.length).forEach((row) => {
                newDanhSachYLenh.push({
                    khoa: khoa,
                    yLenh: format(new Date(row.ngayGio), 'dd/MM/yyyy HH:mm') + ' - ' + row.yLenh.join('; ') + ' - BS: ' + name,
                    xacNhan: 'Chưa thực hiện'
                });
            });
            dispatch(HSBAActions.updateSection({
                section: 'danhSachYLenh',
                data: [...danhSachYLenh, ...newDanhSachYLenh]
            }));
        
            rows.slice(content.data.length).forEach((row) => {
                if (!loadingError) {
                    dispatch(SpellingErrorThunk.getProcessResult({ 
                        section: SECTION_NAME, 
                        subSection: row.ngayGio,
                        subSubSection: "Chẩn đoán", 
                        text: row.chanDoan 
                    }));
                    dispatch(SpellingErrorThunk.getProcessResult({ 
                        section: SECTION_NAME, 
                        subSection: row.ngayGio,
                        subSubSection: "Diễn biến bệnh", 
                        text: row.dienBienBenh.join('\n') 
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
                row.chanDoan = useResult[id].chanDoan 
                    ? UtilsText.replaceMaskWord(spellingError[row.ngayGio]["Chẩn đoán"].detection, replaced[id].chanDoan)
                    : text[id].chanDoan;
                row.dienBienBenh = useResult[id].dienBienBenh 
                    ? removeHashAndSpaces(UtilsText.replaceMaskWord(spellingError[row.ngayGio]["Diễn biến bệnh"].detection, 
                        replaced[id].dienBienBenh).trim().split('\n'))
                    : removeHashAndSpaces(text[id].dienBienBenh.trim().split('\n'));
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
        setNewChanDoan('');
        setNewDienBienBenh('');
        setNewYLenh('');
        setErrors([]);
    }

    const handleCancel = () => {
        clearData();
        setHasChanged(false);
    };

    const handleAdd = () => {
        if (!!newChanDoan && !!newDienBienBenh && !!newYLenh) {
            const tYLenh = removeHashAndSpaces(newYLenh.trim().split('\n')), tDienBienBenh = removeHashAndSpaces(newDienBienBenh.trim().split('\n'));
            const now = new Date().toISOString();
            setRows([...rows, {
                ngayGio: now,
                khoaDieuTri: khoa,
                chanDoan: newChanDoan,
                dienBienBenh: tDienBienBenh, 
                yLenh: tYLenh,
                bacSiGhi: `${id} - ${name}`
            }]);
            setNewNgayGio(now);
            setText([...text, { chanDoan: newChanDoan, dienBienBenh: tDienBienBenh.join('\n') }]);
            setResult([...result, { chanDoan: "", dienBienBenh: "" }]);
            setReplaced([...replaced, { chanDoan: [], dienBienBenh: [] }]);
            setUseResult([...useResult, { chanDoan: true, dienBienBenh: true }]);
        
            clearData();
            dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true, newKey: now }));
            setHasChanged(false);
        } else {
            let errs = [];
            if (!newChanDoan) errs.push('CHẨN ĐOÁN');
            if (!newDienBienBenh) errs.push('DIỄN BIẾN BỆNH');
            if (!newYLenh) errs.push('Y LỆNH');
            setErrors(errs);
        }
    };

    useEffect(() => {
        const tResult = [...result], tReplaced = [...replaced], tRows = [...rows];
        rows.slice(content.data.length).forEach((row, id) => {
            if (typeof (spellingError[row.ngayGio]) !== "undefined") {    
                if (!spellingError[row.ngayGio]["Chẩn đoán"].loading && !spellingError[row.ngayGio]["Chẩn đoán"].error) {
                    tResult[id].chanDoan = spellingError[row.ngayGio]["Chẩn đoán"];
                    tReplaced[id].chanDoan = spellingError[row.ngayGio]["Chẩn đoán"].correction.map(res => ({ type: "correct", repText: res[1] }));
                    if (spellingError[row.ngayGio]["Chẩn đoán"].correction.length === 0) {
                        tRows[content.data.length + id] = { ...tRows[content.data.length + id], chanDoan: spellingError[row.ngayGio]["Chẩn đoán"].detection }; 
                    }
                } else if (spellingError[row.ngayGio]["Chẩn đoán"].loading) {
                    tResult[id].chanDoan = ""; 
                    tReplaced[id].chanDoan = []; 
                }
                if (!spellingError[row.ngayGio]["Diễn biến bệnh"].loading && !spellingError[row.ngayGio]["Diễn biến bệnh"].error) {
                    tResult[id].dienBienBenh = spellingError[row.ngayGio]["Diễn biến bệnh"];
                    tReplaced[id].dienBienBenh = spellingError[row.ngayGio]["Diễn biến bệnh"].correction.map(res => ({ type: "correct", repText: res[1] }));
                    if (spellingError[row.ngayGio]["Diễn biến bệnh"].correction.length === 0) {
                        tRows[content.data.length + id] = { 
                            ...tRows[content.data.length + id], 
                            dienBienBenh: removeHashAndSpaces(spellingError[row.ngayGio]["Diễn biến bệnh"].detection.trim().split('\n'))
                        }; 
                    }
                } else if (spellingError[row.ngayGio]["Diễn biến bệnh"].loading) {
                    tResult[id].dienBienBenh = ""; 
                    tReplaced[id].dienBienBenh = []; 
                } 
            }
        });
        setResult(tResult); setReplaced(tReplaced); setRows(tRows);
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
                            {rows.length === 0 && (role !== "BS" || updating) ? (
                                <StyledTableRow>
                                    <TableCell colSpan={headCells.length} align="center">(<i>trống</i>)</TableCell>
                                </StyledTableRow>
                            ) : (rowsPerPage > 0
                                ? UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy))
                            ).map((row, index) => {
                                return (
                                    <StyledTableRow hover key={index}>
                                        <TableCell className="tableBodyBorderRight">{format(new Date(row.ngayGio), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{format(new Date(row.ngayGio), 'HH:mm')}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.khoaDieuTri}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.chanDoan}</TableCell>
                                        <TableCell className="tableBodyBorderRight">
                                            {row.dienBienBenh.length > 1
                                                ? row.dienBienBenh.map(dbb => '- ' + dbb).join('\n') 
                                                : row.dienBienBenh
                                            }
                                        </TableCell>
                                        <TableCell className="tableBodyBorderRight">
                                            {row.yLenh.length > 1
                                                ? row.yLenh.map(yl => '- ' + yl).join('\n') 
                                                : row.yLenh
                                            }
                                        </TableCell>
                                        <TableCell>{row.bacSiGhi}</TableCell>
                                    </StyledTableRow>
                                );
                            })}

                            {(role === "BS" && !ngayRaVien && !updating) ?
                                <TableRow sx={{ position: 'sticky', bottom: 0, bgcolor: 'white', '.MuiTableCell-root': { borderTop: '0.5px solid rgba(224, 224, 224, 1)' } }}>
                                    <TableCell className="tableBodyBorderRight">{format(new Date(newNgayGio), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell className="tableBodyBorderRight">{format(new Date(newNgayGio), 'HH:mm')}</TableCell>
                                    <TableCell className="tableBodyBorderRight">{khoa}</TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <TextField
                                            multiline
                                            fullWidth
                                            value={newChanDoan}
                                            onChange={({ target: { value } }) => {
                                                setNewChanDoan(value);
                                                if (!value) {
                                                    if (!newChanDoan) {
                                                        setHasChanged(false);
                                                    }
                                                } else {
                                                    if (!hasChanged) {
                                                        setHasChanged(true);
                                                    }
                                                }
                                            }}
                                            inputProps={{ 'aria-label': 'chan doan' }}
                                        />
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <TextField
                                            multiline
                                            fullWidth
                                            value={newDienBienBenh}
                                            onChange={({ target: { value } }) => {
                                                setNewDienBienBenh(value);
                                                if (!value) {
                                                    if (!newYLenh) {
                                                        setHasChanged(false);
                                                    }
                                                } else {
                                                    if (!hasChanged) {
                                                        setHasChanged(true);
                                                    }
                                                }
                                            }}
                                            inputProps={{ 'aria-label': 'dien bien benh' }}
                                        />
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <TextField
                                            multiline
                                            fullWidth
                                            value={newYLenh}
                                            onChange={({ target: { value } }) => {
                                                setNewYLenh(value);
                                                if (!value) {
                                                    if (!newDienBienBenh) {
                                                        setHasChanged(false);
                                                    }
                                                } else {
                                                    if (!hasChanged) {
                                                        setHasChanged(true);
                                                    }
                                                }
                                            }}
                                            inputProps={{ 'aria-label': 'y lenh' }}
                                        />
                                    </TableCell>
                                    <TableCell>{`${id} - ${name}`}</TableCell>
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
            && (spellingError[subKey]["Chẩn đoán"].correction.length > 0 || spellingError[subKey]["Diễn biến bệnh"].correction.length > 0)) ? 
                <Card sx={{ mt: 2 }}>
                    <CardHeader 
                        title={`${SECTION_NAME} (CHẨN ĐOÁN, DIỄN BIẾN BỆNH) - Xử lý lỗi`} 
                        titleTypographyProps={{ fontWeight: "bold", color: "primary.dark" }} 
                    />
                    <CardContent sx={{ py: 0 }}>
                        {rows.slice(content.data.length).map((row, index) => (
                            spellingError[row.ngayGio]["Chẩn đoán"].correction.length > 0 || spellingError[row.ngayGio]["Diễn biến bệnh"].correction.length > 0 ?
                                <Card key={index} sx={{ mb: 2 }}>
                                    <CardHeader 
                                        title={`Ngày giờ: ${format(new Date(row.ngayGio), "dd/MM/yyyy HH:mm")}`} 
                                        sx={{ bgcolor: "primary.light" }} 
                                        titleTypographyProps={{ fontWeight: "bold" }} 
                                    />
                                    <CardContent sx={{ pl: 1 }}>
                                        {spellingError[row.ngayGio]["Chẩn đoán"].correction.length > 0 ? 
                                            <Box>
                                                <Box className="df">
                                                    <ArrowRight sx={{ mr: 1 }} color="primary" />
                                                    <Box sx={{ width: "100%" }}>
                                                        <Typography fontWeight="bold" color="primary" sx={{ mb: 1 }}>CHẨN ĐOÁN</Typography>
                                                        
                                                        <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography>
                                                        <TextField 
                                                            fullWidth
                                                            multiline
                                                            margin="dense"
                                                            value={text[index].chanDoan}
                                                            onChange={({ target: { value } }) => {
                                                                const tText = [...text];
                                                                tText[index].chanDoan = value;
                                                                setText(tText);
                                                            }}
                                                            disabled={useResult[index].chanDoan}
                                                            inputProps={{ 'aria-label': 'original text' }}
                                                        />

                                                        {!!result[index].chanDoan && !spellingError[row.ngayGio]["Chẩn đoán"].loading ? 
                                                            <BoxLoiChinhTa
                                                                result={result[index].chanDoan}
                                                                replaced={replaced[index].chanDoan}
                                                                setReplaced={(newReplaced) => {
                                                                    const tReplaced = [...replaced];
                                                                    tReplaced[index].chanDoan = newReplaced;
                                                                    setReplaced(tReplaced);
                                                                }}
                                                                useResult={useResult[index].chanDoan}
                                                                handleChangeCheckbox={(checked) => {
                                                                    const tUseResult = [...useResult];
                                                                    tUseResult[index].chanDoan = checked;
                                                                    setUseResult(tUseResult);
                                                                    if (checked) {
                                                                        dispatch(SpellingErrorActions.resetLoading({ 
                                                                            section: SECTION_NAME, subSection: row.ngayGio, subSubSection: "Chẩn đoán" 
                                                                        }));
                                                                        dispatch(SpellingErrorThunk.getProcessResult({ 
                                                                            section: SECTION_NAME, subSection: row.ngayGio, 
                                                                            subSubSection: "Chẩn đoán", text: text[index].chanDoan
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

                                        {spellingError[row.ngayGio]["Diễn biến bệnh"].correction.length > 0 ?
                                            <Box sx={{ mt: spellingError[row.ngayGio]["Chẩn đoán"].correction.length > 0 ? 3 : 0 }}>
                                                <Box className="df">
                                                    <ArrowRight sx={{ mr: 1 }} color="primary" />
                                                    <Box sx={{ width: "100%" }}>
                                                        <Typography fontWeight="bold" color="primary" sx={{ mb: 1 }}>DIỄN BIẾN BỆNH</Typography>
                                                    
                                                        <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography>
                                                        <TextField 
                                                            fullWidth
                                                            multiline
                                                            margin="dense"
                                                            value={text[index].dienBienBenh}
                                                            onChange={({ target: { value } }) => {
                                                                const tText = [...text];
                                                                tText[index].dienBienBenh = value;
                                                                setText(tText);
                                                            }}
                                                            disabled={useResult[index].dienBienBenh}
                                                            inputProps={{ 'aria-label': 'original text' }}
                                                        />

                                                        {!!result[index].dienBienBenh && !spellingError[row.ngayGio]["Diễn biến bệnh"].loading ? 
                                                            <BoxLoiChinhTa
                                                                result={result[index].dienBienBenh}
                                                                replaced={replaced[index].dienBienBenh}
                                                                setReplaced={(newReplaced) => {
                                                                    const tReplaced = [...replaced];
                                                                    tReplaced[index].dienBienBenh = newReplaced;
                                                                    setReplaced(tReplaced);
                                                                }}
                                                                useResult={useResult[index].dienBienBenh}
                                                                handleChangeCheckbox={(checked) => {
                                                                    const tUseResult = [...useResult];
                                                                    tUseResult[index].dienBienBenh = checked;
                                                                    setUseResult(tUseResult);
                                                                    if (checked) {
                                                                        dispatch(SpellingErrorActions.resetLoading({ 
                                                                            section: SECTION_NAME, subSection: row.ngayGio, subSubSection: "Diễn biến bệnh" 
                                                                        }));
                                                                        dispatch(SpellingErrorThunk.getProcessResult({ 
                                                                            section: SECTION_NAME, subSection: row.ngayGio, 
                                                                            subSubSection: "Diễn biến bệnh", text: text[index].dienBienBenh 
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

export default FToDieuTri;