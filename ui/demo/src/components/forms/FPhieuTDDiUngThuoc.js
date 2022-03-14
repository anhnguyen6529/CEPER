import { 
    Box, Paper, TableContainer, TableHead, TableBody, TableRow, 
    TableCell, Table, TableSortLabel, Grid, Typography, Checkbox, TextField
} from "@mui/material";
import React, { useState, useContext } from "react";
import { Add } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { visuallyHidden } from "@mui/utils";
import { format } from "date-fns";
import { UtilsTable } from "../../utils";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { TablePagination, StyledTableRow, Button, SelectThuoc } from "../common";
import HSBAContext from "../../contexts/HSBAContext";
import mdSections from "../../constants/md_sections.json";

const headCells = [
    { id: 'ngayGioDungThuoc', align: 'left', label: 'Ngày giờ\ndùng thuốc', width: '15%' },
    { id: 'diNguyen', align: 'left', label: 'Dị nguyên/thuốc', width: '25%' },
    { id: 'nghiNgo', align: 'center', label: 'Nghi ngờ', width: '5%' },
    { id: 'chacChan', align: 'center', label: 'Chắc chắn', width: '5%' },
    { id: 'bieuHienLamSang', align: 'left', label: 'Biểu hiện lâm sàng', width: '20%' },
    { id: 'bacSiXacNhan', align: 'left', label: 'Bác sĩ xác nhận chẩn đoán', width: '15%' },
    { id: 'ketQua', align: 'left', label: 'Kết quả', width: '15%' }
];

const FPhieuTDDiUngThuoc = () => {
    const content = useSelector((state) => state.HSBA.phieuTDDiUngThuoc);
    const { ngayRaVien } = useSelector((state) => state.HSBA.chanDoanKhiRaVien);
    const { role, name } = useSelector((state) => state.auth.user);
    const { saveSec, setSaveSec } = useContext(HSBAContext);
    const dispatch = useDispatch();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('ngayGioDungThuoc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [addNew, setAddNew] = useState(false);
    const [newNgayGioDungThuoc, setNewNgayGioDungThuoc] = useState(null);
    const [newDiNguyen, setNewDiNguyen] = useState([null]);
    const [newNghiNgo, setNewNghiNgo] = useState(false);
    const [newChacChan, setNewChacChan] = useState(false);
    const [newBieuHienLamSang, setNewBieuHienLamSang] = useState('');
    const [newKetQua, setNewKetQua] = useState('');
    const [errors, setErrors] = useState([]);

    const rows = content.data;
    const sectionId = mdSections["order"].indexOf("Phiếu TD dị ứng thuốc");

    const createSortHandler = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }; 

    const clearData = () => {
        setNewNgayGioDungThuoc(null);
        setNewDiNguyen([null]);
        setNewNghiNgo(false);
        setNewChacChan(false);
        setNewBieuHienLamSang('');
        setNewKetQua('');
        setAddNew(false);
        setErrors([]);
    }

    const handleCancel = () => {
        clearData();
    };
    
    const handleSave = () => {
        if (!!newNgayGioDungThuoc && newDiNguyen.every(dn => !!dn) && !!newBieuHienLamSang && !!newKetQua) {
            dispatch(HSBAActions.updateDinhKemSection({
                section: 'phieuTDDiUngThuoc',
                value: {},
                newData: {
                    ngayGioDungThuoc: newNgayGioDungThuoc,
                    diNguyen: newDiNguyen,
                    nghiNgo: newNghiNgo,
                    chacChan: newChacChan,
                    bieuHienLamSang: newBieuHienLamSang,
                    bacSiXacNhan: name,
                    ketQua: newKetQua
                }
            }));
            let tSaveSec = [...saveSec];
            tSaveSec[sectionId] = new Date();
            setSaveSec(tSaveSec);
            clearData();
        } else {
            let errs = [];
            if (newDiNguyen.some(dn => !dn)) errs.push('dị nguyên');
            if (!newBieuHienLamSang) errs.push('biểu hiện lâm sàng');
            if (!newKetQua) errs.push('kết quả');
            setErrors(errs);
        }
    }

    const handleAddClick = () => {
        setNewDiNguyen([...newDiNguyen, null]);
    }

    const handleDelete = (id) => {
        const tNewDiNguyen = [...newDiNguyen];
        tNewDiNguyen.splice(id, 1);
        setNewDiNguyen(tNewDiNguyen);
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
                                        align={headCell.align}
                                        sortDirection={orderBy === headCell.id ? order : false}
                                        width={headCell.width}
                                        className={id < headCells.length - 1 ? "tableHeadBorderRight" : ""} 
                                    >
                                        {headCell.id === "nghiNgo" || headCell.id === "chacChan" 
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
                            {UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <StyledTableRow hover key={index}>
                                            <TableCell className="tableBodyBorderRight">{format(new Date(row.ngayGioDungThuoc), 'dd/MM/yyyy, HH:mm')}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.diNguyen.join('\n')}</TableCell>
                                            <TableCell className="tableBodyBorderRight" align="center">
                                                {row.nghiNgo ? <CheckBox /> : <CheckBoxOutlineBlank />}
                                            </TableCell>
                                            <TableCell className="tableBodyBorderRight" align="center">
                                                {row.chacChan ? <CheckBox /> : <CheckBoxOutlineBlank />}
                                            </TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.bieuHienLamSang}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.bacSiXacNhan}</TableCell>
                                            <TableCell>{row.ketQua}</TableCell>
                                        </StyledTableRow>
                                    );
                            })}

                            {addNew && 
                                <TableRow sx={{ '.MuiTableCell-root': { borderTop: '0.5px solid rgba(224, 224, 224, 1)' } }}>
                                    <TableCell className="tableBodyBorderRight">{format(new Date(newNgayGioDungThuoc), 'dd/MM/yyyy, HH:mm')}</TableCell>
                                    <TableCell className="tableBodyBorderRight" sx={{ pb: 0.5 }}>
                                        {newDiNguyen.map((diNguyen, id) => (
                                            <Box className="df aic" sx={{ mb: 1.5 }}>
                                                <SelectThuoc 
                                                    hamLuong={false}
                                                    value={diNguyen}
                                                    onChange={(_, value) => {
                                                        const tDiNguyen = [...newDiNguyen];
                                                        tDiNguyen[id] = value;
                                                        setNewDiNguyen(tDiNguyen);
                                                    }}
                                                    existValue={newDiNguyen}
                                                    sx={{ width: "85%" }}
                                                />

                                                {id === newDiNguyen.length - 1 
                                                    ? <Add sx={{ ml: 0.5, cursor: "pointer", color: "#999" }} onClick={handleAddClick} />
                                                    : (
                                                        <Typography sx={{ cursor: "pointer", ml: 1 }} color="primary" onClick={() => handleDelete(id)}>
                                                            Xóa
                                                        </Typography>
                                                    )}
                                            </Box>
                                        ))}
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight" align="center">
                                        <Checkbox sx={{ p: 0 }} value={newNghiNgo} onChange={(event) => setNewNghiNgo(event.target.checked)}/>
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight" align="center">
                                        <Checkbox sx={{ p: 0 }} value={newChacChan} onChange={(event) => setNewChacChan(event.target.checked)}/>
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <TextField
                                            multiline
                                            fullWidth
                                            value={newBieuHienLamSang}
                                            onChange={(event) => setNewBieuHienLamSang(event.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight">{name}</TableCell>
                                    <TableCell>
                                        <TextField
                                            multiline
                                            fullWidth
                                            value={newKetQua}
                                            onChange={(event) => setNewKetQua(event.target.value)}
                                        />
                                    </TableCell>
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

            { (role === "BS" && !ngayRaVien) && 
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
                                    setNewNgayGioDungThuoc(new Date());
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

export default FPhieuTDDiUngThuoc;
