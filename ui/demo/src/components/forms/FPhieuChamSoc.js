import { 
    Box, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, TableSortLabel, Paper, TextField, Grid, Typography, Select, MenuItem
} from "@mui/material";
import { Add, CancelOutlined, DoneAll, Loop } from "@mui/icons-material";
import React, { Fragment, useContext, useState } from "react";
import { visuallyHidden } from "@mui/utils";
import UtilsTable from "../../utils/table";
import { useSelector , useDispatch } from "react-redux";
import { format } from "date-fns";
import "../../styles/index.css";
import { TablePagination, Button, SelectYLenh } from "../common";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import UserContext from "../../contexts/UserContext";

const SECTION_NAME = "Phiếu chăm sóc";

const headCells = [
    { id: 'ngayGio', label: 'Ngày', width: '10%', minWidth: 115 },
    { id: 'gio', label: 'Giờ', width: '5%', minWidth: 85 },
    { id: 'theoDoiDienBien', label: 'THEO DÕI DIỄN BIẾN', width: '25%', minWidth: 250 },
    { id: 'thucHienYLenh', label: 'THỰC HIỆN Y LỆNH', width: '30%', minWidth: 250 },
    { id: 'xacNhan', label: 'Xác nhận', width: '15%', minWidth: 160 },
    { id: 'dieuDuongGhi', label: 'Điều dưỡng ghi', width: '15%', minWidth: 170 }
];

const FPhieuChamSoc = () => {
    const content = useSelector((state) => state.HSBA.phieuChamSoc);
    const { ngayRaVien } = useSelector((state) => state.HSBA.chanDoanKhiRaVien);
    const { role, name, id } = useSelector(state => state.auth.user);
    const { appearTime } = useContext(UserContext);
    const dispatch = useDispatch();
    const { danhSachYLenh } = useSelector((state) => state.HSBA);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('ngayGio');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [newNgayGio, setNewNgayGio] = useState(appearTime[SECTION_NAME]);
    const [newTheoDoiDienBien, setNewTheoDoiDienBien] = useState(['']);
    const [newThucHienYLenh, setNewThucHienYLenh] = useState([{ yLenh: '', xacNhan: '' }]);
    const [errors, setErrors] = useState([]);
    const [hasChanged, setHasChanged] = useState(false);

    const [filterDanhSachYLenh, setFilterDanhSachYLenh] = useState(danhSachYLenh);
    const [rows, setRows] = useState(content.data);

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
                theoDoiDienBien: newTheoDoiDienBien, 
                thucHienYLenh: newThucHienYLenh.map(thyl => thyl.yLenh),
                xacNhan: newThucHienYLenh.map(thyl => thyl.xacNhan),
                dieuDuongGhi: `${id} - ${name}`
            }]);
            setNewNgayGio(now);
           
            newThucHienYLenh.forEach((thyl) => {
                const findIdx = filterDanhSachYLenh.findIndex(dsyl => dsyl.yLenh === thyl.yLenh), tFilterDSYL = [...filterDanhSachYLenh];
                if (findIdx !== -1) {
                    tFilterDSYL[findIdx] = { ...tFilterDSYL[findIdx], xacNhan: thyl.xacNhan };
                    setFilterDanhSachYLenh(tFilterDSYL);
                }
            })
            clearData();
            dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
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
                            {(rowsPerPage > 0
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

                            {(role === "DD" && !ngayRaVien) ? 
                                <Fragment>
                                    <TableRow sx={{ '.MuiTableCell-root': { borderTop: '0.5px solid rgba(224, 224, 224, 1)' } }}>
                                        <TableCell className="tableBodyBorderRight" rowSpan={newThucHienYLenh.length}>{format(new Date(newNgayGio), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell className="tableBodyBorderRight" rowSpan={newThucHienYLenh.length}>{format(new Date(newNgayGio), 'HH:mm')}</TableCell>
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
                                                    danhSachYLenh={filterDanhSachYLenh}
                                                />

                                                {newThucHienYLenh.length === 1
                                                    && filterDanhSachYLenh.filter(dsyl => newThucHienYLenh.findIndex(thyl => thyl.yLenh === dsyl.yLenh) === -1 && dsyl.xacNhan !== "Thực hiện xong").length > 0 
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
                                                        danhSachYLenh={filterDanhSachYLenh}
                                                    />

                                                    {idx + 1 === newThucHienYLenh.length - 1 
                                                        && filterDanhSachYLenh.filter(dsyl => newThucHienYLenh.findIndex(thyl => thyl.yLenh === dsyl.yLenh) === -1 && dsyl.xacNhan !== "Thực hiện xong").length > 0 
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
                        {errors.length > 0 && <Typography color="error">Vui lòng nhập đầy đủ thông tin: <b>{errors.join('; ')}</b>.</Typography>}
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

export default FPhieuChamSoc;