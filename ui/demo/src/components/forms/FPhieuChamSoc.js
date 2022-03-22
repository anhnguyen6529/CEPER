import { 
    Box, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, TableSortLabel, Paper, TextField, Grid, Typography, Select, MenuItem
} from "@mui/material";
import { Add, DoneAll, Loop } from "@mui/icons-material";
import React, { Fragment, useState } from "react";
import { visuallyHidden } from "@mui/utils";
import UtilsTable from "../../utils/table";
import { useSelector , useDispatch } from "react-redux";
import { format } from "date-fns";
import "../../styles/index.css";
import { TablePagination, Button, SelectYLenh } from "../common";
import { HSBAActions } from "../../redux/slices/HSBA.slice";

const headCells = [
    { id: 'ngayGio', label: 'Ngày', width: '10%', minWidth: 115 },
    { id: 'gio', label: 'Giờ', width: '5%', minWidth: 85 },
    { id: 'theoDoiDienBien', label: 'Theo dõi diễn biến', width: '25%', minWidth: 250 },
    { id: 'thucHienYLenh', label: 'Thực hiện y lệnh', width: '30%', minWidth: 250 },
    { id: 'xacNhan', label: 'Xác nhận', width: '15%', minWidth: 160 },
    { id: 'dieuDuongGhi', label: 'Điều dưỡng ghi', width: '15%', minWidth: 170 }
];

const FPhieuChamSoc = () => {
    const content = useSelector((state) => state.HSBA.phieuChamSoc);
    const { ngayRaVien } = useSelector((state) => state.HSBA.chanDoanKhiRaVien);
    const { role, name } = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const { danhSachYLenh } = useSelector((state) => state.HSBA);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('ngayGio');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [addNew, setAddNew] = useState(false);
    const [newNgayGio, setNewNgayGio] = useState(null);
    const [newTheoDoiDienBien, setNewTheoDoiDienBien] = useState(['']);
    const [newThucHienYLenh, setNewThucHienYLenh] = useState([{ yLenh: '', xacNhan: '' }]);
    const [errors, setErrors] = useState([]);

    const rows = content.data;

    const createSortHandler = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const clearData = () => {
        setNewNgayGio(null);
        setNewTheoDoiDienBien(['']);
        setNewThucHienYLenh([{ yLenh: '', xacNhan: '' }]);
        setAddNew(false);
        setErrors([]);
    }

    const handleCancel = () => {
        clearData();
    };

    const handleAdd = () => {
        if (!!newNgayGio && newTheoDoiDienBien.every(tddb => !! tddb) && newThucHienYLenh.every(thyl => !!thyl.yLenh && !!thyl.xacNhan)) {
            dispatch(HSBAActions.updateDinhKemSection({
                section: 'phieuChamSoc',
                value: {},
                newData: { 
                    ngayGio: newNgayGio.toISOString(), 
                    theoDoiDienBien: newTheoDoiDienBien, 
                    thucHienYLenh: newThucHienYLenh.map(thyl => thyl.yLenh),
                    xacNhan: newThucHienYLenh.map(thyl => thyl.xacNhan),
                    dieuDuongGhi: name 
                }
            }));
            newThucHienYLenh.forEach((thyl) => {
                const findIdx = danhSachYLenh.findIndex(dsyl => dsyl.yLenh === thyl.yLenh);
                if (findIdx !== -1) {
                    dispatch(HSBAActions.updateDanhSachYLenh({
                        index: findIdx,
                        value: { xacNhan: thyl.xacNhan }
                    }));
                }
            })
            clearData();
        } else {
            let errs = [];
            if (!newTheoDoiDienBien.every(tddb => !!tddb)) errs.push('theo dõi diễn biến');
            if (!newThucHienYLenh.every(thyl => !!thyl.yLenh && !!thyl.xacNhan) 
                && errs.findIndex(err => err === 'thực hiện y lệnh') === -1) errs.push('thực hiện y lệnh');
            setErrors(errs);
        }
    };

    const handleAddClick = () => {
        setNewTheoDoiDienBien([...newTheoDoiDienBien, '']);
        setNewThucHienYLenh([...newThucHienYLenh, { yLenh: '', xacNhan: '' }]);
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
                            {UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <TableRow hover sx={{ bgcolor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.06)' : 'rgba(0, 0, 0, 0.04)' }}>
                                                <TableCell className="tableBodyBorderRight" rowSpan={row.thucHienYLenh.length + 1}>
                                                    {format(new Date(row.ngayGio), 'dd/MM/yyyy')}
                                                </TableCell>
                                                <TableCell className="tableBodyBorderRight" rowSpan={row.thucHienYLenh.length + 1}>
                                                    {format(new Date(row.ngayGio), 'HH:mm')}
                                                </TableCell>
                                            </TableRow>
                                            {row.thucHienYLenh.map((thucHienYLenh, idx) => (
                                                <TableRow key={idx} hover sx={{ bgcolor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.06)' : 'rgba(0, 0, 0, 0.04)' }}>
                                                    <TableCell className="tableBodyBorderRight">{row.theoDoiDienBien[idx]}</TableCell>
                                                    <TableCell className="tableBodyBorderRight">
                                                        {thucHienYLenh}
                                                    </TableCell> 
                                                    <TableCell className="tableBodyBorderRight">
                                                        <Box className="df aic">
                                                            {row.xacNhan[idx] === "Đang thực hiện" 
                                                                ? <Loop fontSize="small" sx={{ mr: 0.5 }} color="warning" /> 
                                                                : <DoneAll fontSize="small" sx={{ mr: 0.5 }} color="success" />
                                                            }
                                                            {row.xacNhan[idx]}
                                                        </Box>
                                                    </TableCell>
                                                    {idx === 0 && <TableCell rowSpan={row.thucHienYLenh.length + 1}>{row.dieuDuongGhi}</TableCell>}
                                                </TableRow>
                                            ))}
                                        </Fragment>
                                    );
                            })}

                            {addNew && 
                                <Fragment>
                                    <TableRow sx={{ '.MuiTableCell-root': { borderTop: '0.5px solid rgba(224, 224, 224, 1)' } }}>
                                        <TableCell className="tableBodyBorderRight" rowSpan={newThucHienYLenh.length + 1}>{format(new Date(newNgayGio), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell className="tableBodyBorderRight" rowSpan={newThucHienYLenh.length + 1}>{format(new Date(newNgayGio), 'HH:mm')}</TableCell>
                                    </TableRow>

                                    {newThucHienYLenh.map((thucHienYLenh, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="tableBodyBorderRight">
                                                <TextField
                                                    multiline
                                                    fullWidth
                                                    value={newTheoDoiDienBien[idx]}
                                                    onChange={(event) => {
                                                        const tTheoDoiDienBien = [...newTheoDoiDienBien];
                                                        tTheoDoiDienBien[idx] = event.target.value;
                                                        setNewTheoDoiDienBien(tTheoDoiDienBien);
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell className="tableBodyBorderRight">
                                                <Box className="df aic">
                                                    <SelectYLenh 
                                                        fullWidth
                                                        value={thucHienYLenh.yLenh}
                                                        onChange={(event) => {
                                                            const tThucHienYLenh = [...newThucHienYLenh];
                                                            tThucHienYLenh[idx].yLenh = event.target.value;
                                                            tThucHienYLenh[idx].xacNhan = "Đang thực hiện";
                                                            setNewThucHienYLenh(tThucHienYLenh);
                                                        }}
                                                        existValue={newThucHienYLenh}
                                                    />

                                                    {idx === newThucHienYLenh.length - 1 
                                                        && danhSachYLenh.filter(dsyl => newThucHienYLenh.findIndex(thyl => thyl.yLenh === dsyl.yLenh) === -1 && dsyl.xacNhan !== "Thực hiện xong").length > 0 
                                                        ? <Add sx={{ ml: 0.5, cursor: "pointer", color: "#999" }} onClick={handleAddClick} />
                                                        : null}
                                                </Box>         
                                            </TableCell>
                                            <TableCell className="tableBodyBorderRight">
                                                <Select 
                                                    fullWidth 
                                                    value={thucHienYLenh.xacNhan}
                                                    onChange={(event) => {
                                                        const tThucHienYLenh = [...newThucHienYLenh];
                                                        tThucHienYLenh[idx].xacNhan = event.target.value;
                                                        setNewThucHienYLenh(tThucHienYLenh);
                                                    }}
                                                >
                                                    <MenuItem value="Đang thực hiện">Đang thực hiện</MenuItem>
                                                    <MenuItem value="Thực hiện xong">Thực hiện xong</MenuItem>
                                                </Select>
                                            </TableCell>
                                            {idx === 0 && <TableCell rowSpan={newThucHienYLenh.length + 1}>{name}</TableCell>}
                                        </TableRow>
                                    ))}
                                </Fragment>
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

            {(role === "DD" && !ngayRaVien) &&
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={8}>
                        {errors.length > 0 && <Typography color="error">Vui lòng nhập đầy đủ thông tin: <b>{errors.join(', ')}</b>.</Typography>}
                    </Grid>
                    <Grid item xs={4} align="right">
                        {!addNew
                        ? (
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
                        ) : (
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

export default FPhieuChamSoc;