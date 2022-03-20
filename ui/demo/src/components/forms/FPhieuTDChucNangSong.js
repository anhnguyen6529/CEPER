import { 
    Box, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, TableSortLabel, Paper, TextField, Grid, Typography
} from "@mui/material";
import { Add } from "@mui/icons-material";
import React, { useState } from "react";
import { visuallyHidden } from "@mui/utils";
import { UtilsTable } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import "../../styles/index.css";
import { TablePagination, Button, StyledTableRow } from "../common";
import { HSBAActions } from "../../redux/slices/HSBA.slice";

const headCells = [
    { id: 'ngayGio', numeric: false, label: 'Ngày giờ', unit: '', width: '16%' },
    { id: 'mach', numeric: true, label: 'Mạch', unit: '(lần/phút)', width: '12%' },
    { id: 'nhietDo', numeric: true, label: 'Nhiệt độ', unit: '(°C)', width: '10%' },
    { id: 'huyetAp', numeric: true, label: 'Huyết áp', unit: '(mmHg)', width: '16%' },
    { id: 'nhipTho', numeric: true, label: 'Nhịp thở', unit: '(lần/phút)', width: '12%' },
    { id: 'canNang', numeric: true, label: 'Cân nặng', unit: '(kg)', width: '14%' },
    { id: 'dieuDuongGhi', numeric: false, label: 'Điều dưỡng ghi', unit: '', width: '20%' }
];

const FPhieuTDChucNangSong = () => {
    const content = useSelector((state) => state.HSBA.phieuTDChucNangSong);
    const { ngayRaVien } = useSelector((state) => state.HSBA.chanDoanKhiRaVien);
    const { role, name } = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('ngayGio');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [addNew, setAddNew] = useState(false);
    const [newNgayGio, setNewNgayGio] = useState(null);
    const [newMach, setNewMach] = useState(0);
    const [newNhietDo, setNewNhietDo] = useState(0);
    const [newHuyetAp, setNewHuyetAp] = useState([0, 0]);
    const [newNhipTho, setNewNhipTho] = useState(0);
    const [newCanNang, setNewCanNang] = useState(0);
    const [errors, setErrors] = useState([]);

    const rows = content.data;

    const createSortHandler = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const clearData = () => {
        setNewNgayGio(null);
        setNewMach(0); setNewNhietDo(0); setNewHuyetAp([0, 0]); setNewNhipTho(0); setNewCanNang(0);
        setAddNew(false);
        setErrors([]);
    }

    const handleCancel = () => {
        clearData();
    };

    const handleAdd = () => {
        if (!!newNgayGio && newMach > 0 && newNhietDo > 0 && newHuyetAp[0] > 0 && newHuyetAp[1] > 0 && newNhipTho > 0 && newCanNang > 0) {
            dispatch(HSBAActions.updateDinhKemSection({
                section: 'phieuTDChucNangSong',
                value: {},
                newData: { 
                    ngayGio: newNgayGio.toISOString(), 
                    mach: newMach, nhietDo: newNhietDo, 
                    huyetAp: String(newHuyetAp[0]).concat('/').concat(String(newHuyetAp[1])), 
                    nhipTho: newNhipTho, canNang: newCanNang,
                    dieuDuongGhi: name 
                }
            }));
            clearData();
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
                                        className={id < headCells.length - 1 ? "tableHeadBorderRight" : ""} 
                                    >
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
                                            <TableCell className="tableBodyBorderRight">{format(new Date(row.ngayGio), 'dd/MM/yyyy, HH:mm')}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.mach}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.nhietDo}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.huyetAp}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.nhipTho}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.canNang}</TableCell>
                                            <TableCell>{row.dieuDuongGhi}</TableCell>
                                        </StyledTableRow>
                                    );
                            })}

                            {addNew ? 
                                <TableRow sx={{ position: 'sticky', bottom: 0, bgcolor: 'white', '.MuiTableCell-root': { borderTop: '0.5px solid rgba(224, 224, 224, 1)' } }}>
                                    <TableCell className="tableBodyBorderRight">{format(new Date(newNgayGio), 'dd/MM/yyyy, HH:mm')}</TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <TextField
                                            type="number"
                                            InputProps={{ inputProps: { min: 0 } }}
                                            fullWidth
                                            value={newMach}
                                            onChange={(event) => setNewMach(event.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <TextField
                                            type="number"
                                            InputProps={{ inputProps: { min: 0 } }}
                                            fullWidth
                                            value={newNhietDo}
                                            onChange={(event) => setNewNhietDo(event.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <Box className="df aic">
                                            <TextField
                                                type="number"
                                                InputProps={{ inputProps: { min: 0 } }}
                                                fullWidth
                                                value={newHuyetAp[0]}
                                                onChange={(event) => setNewHuyetAp([event.target.value, newHuyetAp[1]])}
                                            />
                                            <Typography sx={{ mx: 1 }}>/</Typography>
                                            <TextField
                                                type="number"
                                                InputProps={{ inputProps: { min: 0 } }}
                                                fullWidth
                                                value={newHuyetAp[1]}
                                                onChange={(event) => setNewHuyetAp([newHuyetAp[0], event.target.value])}
                                            />
                                        </Box>
                                        
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <TextField
                                            type="number"
                                            InputProps={{ inputProps: { min: 0 } }}
                                            fullWidth
                                            value={newNhipTho}
                                            onChange={(event) => setNewNhipTho(event.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <TextField
                                            type="number"
                                            InputProps={{ inputProps: { min: 0 } }}
                                            fullWidth
                                            value={newCanNang}
                                            onChange={(event) => setNewCanNang(event.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>{name}</TableCell>
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

            { (role === "DD" && !ngayRaVien) && 
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={8}>
                        {errors.length > 0 && <Typography color="error">Vui lòng nhập đầy đủ thông tin: <b>{errors.join(', ')}</b>.</Typography>}
                    </Grid>
                    <Grid item xs={4} align="right">
                        {!addNew
                        ?
                            <Button 
                                sx={{ width: 150 }} 
                                startIcon={<Add fontSize="small"/>}
                                onClick={() => {
                                    setNewNgayGio(new Date());
                                    setAddNew(true);
                                }}
                            >
                                Thêm mới
                            </Button>
                        : (
                            <>
                                <Button variant="outlined" sx={{ width: 150, mr: 2 }} onClick={handleCancel}>
                                    Hủy
                                </Button>

                                <Button variant="primary" sx={{ width: 150 }} onClick={handleAdd}>
                                    Thêm
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

export default FPhieuTDChucNangSong;