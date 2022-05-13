import { 
    Box, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, TableSortLabel, Paper, TextField, Grid, Typography
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
import { Add, CancelOutlined } from "@mui/icons-material";
import { HSBAActions } from "../../redux/slices/HSBA.slice";

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
    const { updating, confirmUpdate, danhSachYLenh, khoa } = useSelector((state) => state.HSBA);
    const { role, name, id } = useSelector(state => state.auth.user);
    const { accentColor } = useSelector((state) => state.auth.settings.appearance);
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

    useEffect(() => {
        if (updating || confirmUpdate) {
            const newDanhSachYLenh = [];
            rows.slice(content.data.length).forEach((row) => {
                newDanhSachYLenh.push({
                    yLenh: format(new Date(row.ngayGio), 'dd/MM/yyyy HH:mm') + ' - ' + row.yLenh.join('; ') + ' - BS: ' + name,
                    xacNhan: 'Chưa thực hiện'
                });
            });
            dispatch(HSBAActions.updateSection({
                section: 'danhSachYLenh',
                data: [...danhSachYLenh, ...newDanhSachYLenh]
            }));
            dispatch(HSBAActions.updateAttachedSection({ 
                section: SECTION_FIELD, 
                value: { newDataLength: rows.length - content.data.length }, 
                newData: rows 
            }));
        }
        // eslint-disable-next-line
    }, [updating, confirmUpdate]);

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
            const tYLenh = removeHashAndSpaces(newYLenh.trim().split('\n')), now = new Date().toISOString();
            setRows([...rows, {
                ngayGio: now,
                khoaDieuTri: khoa,
                chanDoan: newChanDoan,
                dienBienBenh: removeHashAndSpaces(newDienBienBenh.trim().split('\n')), 
                yLenh: tYLenh,
                bacSiGhi: `${id} - ${name}`
            }]);
            setNewNgayGio(now);
        
            clearData();
            dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
            setHasChanged(false);
        } else {
            let errs = [];
            if (!newChanDoan) errs.push('CHẨN ĐOÁN');
            if (!newDienBienBenh) errs.push('DIỄN BIẾN BỆNH');
            if (!newYLenh) errs.push('Y LỆNH');
            setErrors(errs);
        }
    };

    return (
        <>
            <Paper>
                <TableContainer>
                    <Table stickyHeader> 
                        <TableHead sx={{ '.MuiTableCell-root': { bgcolor: (theme) => theme.palette[accentColor].light } }}>
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
                            {rows.length === 0 && role !== "BS" ? (
                                <StyledTableRow>
                                    <TableCell colSpan={5} align="center">(<i>trống</i>)</TableCell>
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

                            {(role === "BS" && !ngayRaVien) ?
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
                                        />
                                    </TableCell>
                                    <TableCell>{`${id} - ${name}`}</TableCell>
                                </TableRow>
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
        </>
    )
}

export default FToDieuTri;