import { 
    Box, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, TableSortLabel, Paper, TextField, Grid, Typography
} from "@mui/material";
import React, { useContext, useState } from "react";
import { visuallyHidden } from "@mui/utils";
import { UtilsTable } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import "../../styles/index.css";
import { TablePagination, Button, StyledTableRow } from "../common";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import UserContext from "../../contexts/UserContext";

const SECTION_NAME = "Phiếu TD chức năng sống";

const headCells = [
    { id: 'ngayGio', label: 'Ngày', unit: '', width: '10%', minWidth: 115 },
    { id: 'gio', label: 'Giờ', unit: '', width: '5%', minWidth: 80 },
    { id: 'mach', label: 'Mạch', unit: '(lần/phút)', width: '12%', minWidth: 120 },
    { id: 'nhietDo', label: 'Nhiệt độ', unit: '(°C)', width: '12%', minWidth: 120 },
    { id: 'huyetAp', label: 'Huyết áp', unit: '(mmHg)', width: '17%', minWidth: 190 },
    { id: 'nhipTho', label: 'Nhịp thở', unit: '(lần/phút)', width: '12%', minWidth: 120 },
    { id: 'canNang', label: 'Cân nặng', unit: '(kg)', width: '12%', minWidth: 130 },
    { id: 'dieuDuongGhi', label: 'Điều dưỡng ghi', unit: '', width: '20%', minWidth: 170 }
];

const FPhieuTDChucNangSong = () => {
    const content = useSelector((state) => state.HSBA.phieuTDChucNangSong);
    const { ngayRaVien } = useSelector((state) => state.HSBA.chanDoanKhiRaVien);
    const { role, name, id } = useSelector(state => state.auth.user);
    const { appearTime } = useContext(UserContext);
    const dispatch = useDispatch();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('ngayGio');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [newNgayGio, setNewNgayGio] = useState(appearTime[SECTION_NAME]);
    const [newMach, setNewMach] = useState(0);
    const [newNhietDo, setNewNhietDo] = useState(0);
    const [newHuyetAp, setNewHuyetAp] = useState([0, 0]);
    const [newNhipTho, setNewNhipTho] = useState(0);
    const [newCanNang, setNewCanNang] = useState(0);
    const [errors, setErrors] = useState([]);
    const [hasChanged, setHasChanged] = useState(false);

    const [rows, setRows] = useState(content.data);

    const createSortHandler = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const clearData = () => {
        setNewMach(0); 
        setNewNhietDo(0); 
        setNewHuyetAp([0, 0]); 
        setNewNhipTho(0); 
        setNewCanNang(0);
        setErrors([]);
    }

    const handleCancel = () => {
        clearData();
        setHasChanged(false);
    };

    const handleAdd = () => {
        if (newMach > 0 && newNhietDo > 0 && newHuyetAp[0] > 0 && newHuyetAp[1] > 0 && newNhipTho > 0 && newCanNang > 0) {
            const now = new Date().toISOString();
            setRows([...rows, {
                ngayGio: now, 
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
            if (newMach === 0) errs.push('mạch');
            if (newNhietDo === 0) errs.push('nhiệt độ');
            if (newHuyetAp[0] === 0 || newHuyetAp[1] === 0) errs.push('huyết áp');
            if (newNhipTho === 0) errs.push('nhịp thở');
            if (newCanNang === 0) errs.push('cân nặng');
            setErrors(errs);
        }
    };

    return (
        <>
            <Paper>
                <TableContainer>
                    <Table stickyHeader> 
                        <TableHead sx={{ '.MuiTableCell-root': { bgcolor: '#D9EFFE' } }}>
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
                                                {headCell.label}<br />{headCell.unit}
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
                            {UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <StyledTableRow hover key={index}>
                                            <TableCell className="tableBodyBorderRight">{format(new Date(row.ngayGio), 'dd/MM/yyyy')}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{format(new Date(row.ngayGio), 'HH:mm')}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.mach}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.nhietDo}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.huyetAp}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.nhipTho}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.canNang}</TableCell>
                                            <TableCell>{row.dieuDuongGhi}</TableCell>
                                        </StyledTableRow>
                                    );
                            })}

                            {(role === "DD" && !ngayRaVien) ? 
                                <TableRow sx={{ position: 'sticky', bottom: 0, bgcolor: 'white', '.MuiTableCell-root': { borderTop: '0.5px solid rgba(224, 224, 224, 1)' } }}>
                                    <TableCell className="tableBodyBorderRight">{format(new Date(newNgayGio), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell className="tableBodyBorderRight">{format(new Date(newNgayGio), 'HH:mm')}</TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <TextField
                                            type="number"
                                            InputProps={{ inputProps: { min: 0 } }}
                                            fullWidth
                                            value={newMach}
                                            onChange={({ target: { value } }) => {
                                                setNewMach(!value ? 0 : parseInt(value));
                                                if (!value || parseInt(value) === 0) {
                                                    if (newNhietDo === 0 && newHuyetAp[0] === 0 && newHuyetAp[1] === 0 && newNhipTho === 0 && newCanNang === 0) {
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
                                            fullWidth
                                            value={newNhietDo}
                                            onChange={({ target: { value } }) => {
                                                setNewNhietDo(!value ? 0 : parseInt(value));
                                                if (!value || parseInt(value) === 0) {
                                                    if (newMach === 0 && newHuyetAp[0] === 0 && newHuyetAp[1] === 0 && newNhipTho === 0 && newCanNang === 0) {
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
                                                fullWidth
                                                value={newHuyetAp[0]}
                                                onChange={({ target: { value } }) => {
                                                    setNewHuyetAp([!value ? 0 : parseInt(value), newHuyetAp[1]]);
                                                    if (!value || parseInt(value) === 0) {
                                                        if (newMach === 0 && newNhietDo === 0 && newHuyetAp[1] === 0 && newNhipTho === 0 && newCanNang === 0) {
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
                                                fullWidth
                                                value={newHuyetAp[1]}
                                                onChange={({ target: { value } }) => {
                                                    setNewHuyetAp([newHuyetAp[0], !value ? 0 : parseInt(value)]);
                                                    if (!value || parseInt(value) === 0) {
                                                        if (newMach === 0 && newNhietDo === 0 && newHuyetAp[0] === 0 && newNhipTho === 0 && newCanNang === 0) {
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
                                            fullWidth
                                            value={newNhipTho}
                                            onChange={({ target: { value } }) => {
                                                setNewNhipTho(!value ? 0 : parseInt(value));
                                                if (!value || parseInt(value) === 0) {
                                                    if (newMach === 0 && newNhietDo === 0 && newHuyetAp[0] === 0 && newHuyetAp[1] === 0 && newCanNang === 0) {
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
                                            fullWidth
                                            value={newCanNang}
                                            onChange={({ target: { value } }) => {
                                                setNewCanNang(!value ? 0 : parseInt(value));
                                                if (!value || parseInt(value) === 0) {
                                                    if (newMach === 0 && newNhietDo === 0 && newHuyetAp[0] === 0 && newHuyetAp[1] === 0 && newNhipTho === 0) {
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
                            <Button variant="outlined" sx={{ mr: 2 }} onClick={handleCancel}>
                                Hủy
                            </Button>

                            <Button variant="primary" onClick={handleAdd}>
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