import { 
    Box, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, TableSortLabel, Paper, TextField, Grid, Typography, Select, MenuItem, Checkbox
} from "@mui/material";
import { Add } from "@mui/icons-material";
import React, { useContext, useState } from "react";
import { visuallyHidden } from "@mui/utils";
import UtilsTable from "../../utils/table";
import { useSelector , useDispatch } from "react-redux";
import { format } from "date-fns";
import "../../styles/index.css";
import { TablePagination, Button, StyledTableRow } from "../common";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import HSBAContext from "../../contexts/HSBAContext";
import mdSections from "../../constants/md_sections.json";

const headCells = [
    { id: 'ngay', numeric: false, label: 'Ngày', width: '10%' },
    { id: 'gio', numeric: false, label: 'Giờ', width: '10%' },
    { id: 'theoDoiDienBien', numeric: true, label: 'Theo dõi diễn biến', width: '30%' },
    { id: 'thucHienYLenh', numeric: true, label: 'Thực hiện y lệnh', width: '30%' },
    { id: 'dieuDuongGhi', numeric: true, label: 'Điều dưỡng ghi', width: '20%' }
];

const sortYLenhFn = (a, b) => {
    const dA = a.split('-')[0].split(' ')[0].split('/'), dB = b.split('-')[0].split(' ')[0].split('/');
    const tA = a.split('-')[0].split(' ')[1].split(':'), tB = a.split('-')[0].split(' ')[1].split(':');
    const ngayGioA = new Date(dA[dA.length - 1], dA[dA.length - 2], dA[0], tA[0], tA[1]);
    const ngayGioB = new Date(dB[dB.length - 1], dB[dB.length - 2], dB[0], tB[0], tB[1]);
    return ngayGioA - ngayGioB;
}

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

const FPhieuChamSoc = () => {
    const content = useSelector((state) => state.HSBA.phieuChamSoc);
    const { role, name } = useSelector(state => state.auth.user);
    const { saveSec, setSaveSec } = useContext(HSBAContext);
    const dispatch = useDispatch();
    const dieuTri = useSelector((state) => state.HSBA.toDieuTri);
    let danhSachYLenh = [];
    dieuTri.data.forEach((dtr) => {
        if (Array.isArray(dtr.yLenh)) {
            danhSachYLenh.push(format(new Date(dtr.ngayGio), 'dd/MM/yyyy HH:mm') + ' - ' + dtr.yLenh.join(';') + ' - BS: ' + dtr.bacSiGhi);
        } else {
            danhSachYLenh.push(format(new Date(dtr.ngayGio), 'dd/MM/yyyy HH:mm') + ' - ' + dtr.yLenh + ' - BS: ' + dtr.bacSiGhi);
        }
    })

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('ngay');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [addNew, setAddNew] = useState(false);
    const [newNgay, setNewNgay] = useState(null);
    const [newGio, setNewGio] = useState(null);
    const [newTheoDoiDienBien, setNewTheoDoiDienBien] = useState('');
    const [newThucHienYLenh, setNewThucHienYLenh] = useState([]);
    const [errors, setErrors] = useState([]);

    const rows = content.data;
    const sectionId = mdSections["order"].indexOf("Phiếu chăm sóc");

    const createSortHandler = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const clearData = () => {
        setNewNgay(null);
        setNewGio(null);
        setNewTheoDoiDienBien('');
        setNewThucHienYLenh([]);
        setAddNew(false);
        setErrors([]);
    }

    const handleCancel = () => {
        clearData();
    };

    const handleSave = () => {
        if (!!newNgay && !!newGio && !!newTheoDoiDienBien && !!newThucHienYLenh) {
            dispatch(HSBAActions.updateDinhKemSection({
                section: 'phieuChamSoc',
                value: {},
                newData: { 
                    ngay: newNgay, 
                    gio: newGio, 
                    theoDoiDienBien: removeHashAndSpaces(newTheoDoiDienBien.trim().split('\n')), 
                    thucHienYLenh: newThucHienYLenh.sort(sortYLenhFn),
                    dieuDuongGhi: name 
                }
            }));
            let tSaveSec = [...saveSec];
            tSaveSec[sectionId] = new Date();
            setSaveSec(tSaveSec);
            clearData();
        } else {
            let errs = [];
            if (!newTheoDoiDienBien) errs.push('theo dõi diễn biến');
            if (newThucHienYLenh.length === 0) errs.push('thực hiện y lệnh');
            setErrors(errs);
        }
    };

    const handleChageYLenh = (event) => {
        setNewThucHienYLenh(event.target.value);
    }
    
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
                                            {headCell.label}
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
                                            <TableCell className="tableBodyBorderRight">{format(new Date(row.ngay), 'dd/MM/yyyy')}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.gio}</TableCell>
                                            <TableCell className="tableBodyBorderRight">
                                                {(Array.isArray(row.theoDoiDienBien) && row.theoDoiDienBien.length > 1) 
                                                    ? row.theoDoiDienBien.map(td => '- ' + td).join('\n') 
                                                    : row.theoDoiDienBien
                                                }
                                            </TableCell>
                                            <TableCell className="tableBodyBorderRight">
                                                {(Array.isArray(row.thucHienYLenh) && row.thucHienYLenh.length > 1) 
                                                    ? row.thucHienYLenh.map(thyl => '- ' + thyl).join('\n') 
                                                    : row.thucHienYLenh
                                                }
                                            </TableCell>
                                            <TableCell>{row.dieuDuongGhi}</TableCell>
                                        </StyledTableRow>
                                    );
                            })}

                            {addNew && 
                                <TableRow sx={{ position: 'sticky', bottom: 0, bgcolor: 'white', '.MuiTableCell-root': { borderTop: '0.5px solid rgba(224, 224, 224, 1)' } }}>
                                    <TableCell className="tableBodyBorderRight">{format(new Date(newNgay), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell className="tableBodyBorderRight">{newGio}</TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <TextField
                                            multiline
                                            fullWidth
                                            value={newTheoDoiDienBien}
                                            onChange={(event) => setNewTheoDoiDienBien(event.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <Select
                                            fullWidth
                                            multiple
                                            displayEmpty
                                            value={newThucHienYLenh}
                                            onChange={handleChageYLenh}
                                            renderValue={(selected) => selected.length === 0 ? '-- Chọn y lệnh --' : selected.map(sl => ' - ' + sl).join('\n')}
                                            SelectDisplayProps={{ style: { whiteSpace: 'unset' } }}
                                        >
                                            {/* <MenuItem disabled value="">-- Chọn y lệnh --</MenuItem> */}
                                            {danhSachYLenh.map((yLenh, id) => (
                                                <MenuItem key={`yl-${id}`} value={yLenh} sx={{ maxWidth: 350, whiteSpace: 'unset' }}>
                                                    <Checkbox checked={newThucHienYLenh.findIndex(newYLenh => newYLenh === yLenh) >= 0}/>
                                                    {yLenh}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell>{name}</TableCell>
                                </TableRow>
                            }
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

            {/* { role === "DD" && */}
            { role === "BS" &&
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={9}>
                        {errors.length > 0 && <Typography color="error">Vui lòng nhập đầy đủ thông tin: <b>{errors.join(', ')}</b>.</Typography>}
                    </Grid>
                    <Grid item xs={3} align="right">
                        {!addNew
                        ? (
                            <Button 
                                sx={{ width: 150 }} 
                                startIcon={<Add fontSize="small"/>}
                                onClick={() => {
                                    let now = new Date();
                                    setNewNgay(now.toDateString());
                                    setNewGio(format(now, 'HH:mm'));
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

export default FPhieuChamSoc;