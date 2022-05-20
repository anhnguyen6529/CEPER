import { 
    Box, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, TableSortLabel, Paper, TextField, Grid, Typography
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { visuallyHidden } from "@mui/utils";
import { UtilsTable } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import "../../styles/index.css";
import { TablePagination, Button, StyledTableRow } from "../common";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import UserContext from "../../contexts/UserContext";
import { Add, CancelOutlined } from "@mui/icons-material";
import { HSBAActions } from "../../redux/slices/HSBA.slice";

const SECTION_NAME = "Phiếu TD chức năng sống";
const SECTION_FIELD = "phieuTDChucNangSong";

const headCells = [
    { id: 'ngayGio', label: 'Ngày', unit: '', width: '10%', minWidth: 115 },
    { id: 'gio', label: 'Giờ', unit: '', width: '5%', minWidth: 80 },
    { id: 'khoa', label: 'Khoa', width: '12%', minWidth: 115 },
    { id: 'mach', label: 'MẠCH', unit: 'lần/phút', width: '10%', minWidth: 0 },
    { id: 'nhietDo', label: 'NHIỆT ĐỘ', unit: '°C', width: '10%', minWidth: 0 },
    { id: 'huyetAp', label: 'HUYẾT ÁP', unit: 'mmHg', width: '20%', minWidth: 0 },
    { id: 'nhipTho', label: 'NHỊP THỞ', unit: 'lần/phút', width: '9%', minWidth: 0 },
    { id: 'canNang', label: 'CÂN NẶNG', unit: 'kg', width: '10%', minWidth: 0 },
    { id: 'dieuDuongGhi', label: 'Điều dưỡng ghi', unit: '', width: '14%', minWidth: 0 }
];

const parseNumber = (str, type="int") => {
    const parseVal = type === "int" ? parseInt(str) : parseFloat(str);
    if (isNaN(parseVal)) { return 0; }
    return parseVal;
}

const FPhieuTDChucNangSong = () => {
    const content = useSelector((state) => state.HSBA.phieuTDChucNangSong);
    const { ngayRaVien } = useSelector((state) => state.HSBA.chanDoanKhiRaVien);
    const { updating, confirmUpdate, khoa } = useSelector((state) => state.HSBA);
    const { role, name, id } = useSelector(state => state.auth.user);
    const { appearTime } = useContext(UserContext);
    const dispatch = useDispatch();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('ngayGio');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [newNgayGio, setNewNgayGio] = useState(appearTime[SECTION_NAME]);
    const [newMach, setNewMach] = useState("");
    const [newNhietDo, setNewNhietDo] = useState("");
    const [newHuyetAp, setNewHuyetAp] = useState(["", ""]);
    const [newNhipTho, setNewNhipTho] = useState("");
    const [newCanNang, setNewCanNang] = useState("");
    const [errors, setErrors] = useState([]);
    const [hasChanged, setHasChanged] = useState(false);

    const [rows, setRows] = useState(content.data);
    
    useEffect(() => {
        if (updating || confirmUpdate) {
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
        setNewMach(""); 
        setNewNhietDo(""); 
        setNewHuyetAp(["", ""]); 
        setNewNhipTho(""); 
        setNewCanNang("");
        setErrors([]);
    }

    const handleCancel = () => {
        clearData();
        setHasChanged(false);
    };

    const handleAdd = () => {
        if (parseNumber(newMach) > 0 && parseNumber(newNhietDo, "float") > 0 && parseNumber(newHuyetAp[0]) > 0 
        && parseNumber(newHuyetAp[1]) > 0 && parseNumber(newNhipTho) > 0 && parseNumber(newCanNang, "float") > 0) {
            const now = new Date().toISOString();
            setRows([...rows, {
                ngayGio: now, 
                khoa: khoa,
                mach: newMach, 
                nhietDo: newNhietDo, 
                huyetAp: String(newHuyetAp[0]).concat('/').concat(String(newHuyetAp[1])), 
                nhipTho: newNhipTho, 
                canNang: newCanNang,
                dieuDuongGhi: `${id} - ${name}`
            }]);
            setNewNgayGio(now);
            
            clearData();
            dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
            setHasChanged(false);
        } else {
            let errs = [];
            if (parseNumber(newMach) === 0) errs.push('MẠCH');
            if (parseNumber(newNhietDo, "float") === 0) errs.push('NHIỆT ĐỘ');
            if (parseNumber(newHuyetAp[0]) === 0 || parseNumber(newHuyetAp[1]) === 0) errs.push('HUYẾT ÁP');
            if (parseNumber(newNhipTho) === 0) errs.push('NHỊP THỞ');
            if (parseNumber(newCanNang, "float") === 0) errs.push('CÂN NẶNG');
            setErrors(errs);
        }
    };

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
                                                <Box className="df fdc">
                                                    {headCell.label}
                                                    {!!headCell.unit 
                                                        ? <Typography fontWeight="bold">({<i>{headCell.unit}</i>})</Typography> : ""}
                                                </Box>
                                                
                                                {orderBy === headCell.id ? (
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                ) : null}
                                            </TableSortLabel>
                                        : <>{headCell.label}<br />{headCell.unit}</>}
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
                                    <StyledTableRow hover key={index}>
                                        <TableCell className="tableBodyBorderRight">{format(new Date(row.ngayGio), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{format(new Date(row.ngayGio), 'HH:mm')}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.khoa}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.mach}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.nhietDo}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.huyetAp}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.nhipTho}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.canNang}</TableCell>
                                        <TableCell>{row.dieuDuongGhi}</TableCell>
                                    </StyledTableRow>
                                );
                            })}

                            {(role === "DD" && !ngayRaVien && !updating) ? 
                                <TableRow sx={{ position: 'sticky', bottom: 0, bgcolor: 'white', '.MuiTableCell-root': { borderTop: '0.5px solid rgba(224, 224, 224, 1)' } }}>
                                    <TableCell className="tableBodyBorderRight">{format(new Date(newNgayGio), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell className="tableBodyBorderRight">{format(new Date(newNgayGio), 'HH:mm')}</TableCell>
                                    <TableCell className="tableBodyBorderRight">{khoa}</TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <TextField
                                            type="number"
                                            InputProps={{ inputProps: { min: 0 } }}
                                            placeholder="0"
                                            fullWidth
                                            value={newMach}
                                            onChange={({ target: { value } }) => {
                                                setNewMach(value);
                                                if (!value) {
                                                    if (!newNhietDo && !newHuyetAp[0] && !newHuyetAp[1] && !newNhipTho && !newCanNang) {
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
                                            type="number"
                                            InputProps={{ inputProps: { min: 0 } }}
                                            placeholder="0"
                                            fullWidth
                                            value={newNhietDo}
                                            onChange={({ target: { value } }) => {
                                                setNewNhietDo(value);
                                                if (!value) {
                                                    if (!newMach && !newHuyetAp[0] && !newHuyetAp[1] && !newNhipTho && !newCanNang) {
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
                                        <Box className="df aic">
                                            <TextField
                                                type="number"
                                                InputProps={{ inputProps: { min: 0 } }}
                                                placeholder="0"
                                                fullWidth
                                                value={newHuyetAp[0]}
                                                onChange={({ target: { value } }) => {
                                                    setNewHuyetAp([value, newHuyetAp[1]]);
                                                    if (!value) {
                                                        if (!newMach && !newNhietDo && !newHuyetAp[1] && !newNhipTho && !newCanNang) {
                                                            setHasChanged(false);
                                                        }
                                                    } else {
                                                        if (!hasChanged) {
                                                            setHasChanged(true);
                                                        }
                                                    }
                                                }}
                                            />
                                            <Typography sx={{ mx: 1 }}>/</Typography>
                                            <TextField
                                                type="number"
                                                InputProps={{ inputProps: { min: 0 } }}
                                                placeholder="0"
                                                fullWidth
                                                value={newHuyetAp[1]}
                                                onChange={({ target: { value } }) => {
                                                    setNewHuyetAp([newHuyetAp[0], value]);
                                                    if (!value) {
                                                        if (!newMach && !newNhietDo && !newHuyetAp[0] && !newNhipTho && !newCanNang) {
                                                            setHasChanged(false);
                                                        }
                                                    } else {
                                                        if (!hasChanged) {
                                                            setHasChanged(true);
                                                        }
                                                    }
                                                }}
                                            />
                                        </Box>
                                        
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <TextField
                                            type="number"
                                            InputProps={{ inputProps: { min: 0 } }}
                                            placeholder="0"
                                            fullWidth
                                            value={newNhipTho}
                                            onChange={({ target: { value } }) => {
                                                setNewNhipTho(value);
                                                if (!value) {
                                                    if (!newMach && !newNhietDo && !newHuyetAp[0] && !newHuyetAp[1] && !newCanNang) {
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
                                            type="number"
                                            InputProps={{ inputProps: { min: 0 } }}
                                            placeholder="0"
                                            fullWidth
                                            value={newCanNang}
                                            onChange={({ target: { value } }) => {
                                                setNewCanNang(value);
                                                if (!value) {
                                                    if (!newMach && !newNhietDo && !newHuyetAp[0] && !newHuyetAp[1] && !newNhipTho) {
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
                        {errors.length > 0 && <Typography color="error">Vui lòng nhập đầy đủ thông tin và hợp lệ: <b>{errors.join(', ')}</b>.</Typography>}
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

export default FPhieuTDChucNangSong;