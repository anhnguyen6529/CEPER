import { 
    Box, Paper, TableContainer, TableHead, TableBody, TableRow, 
    TableCell, Table, TableSortLabel, Grid, Typography, TextField, Radio
} from "@mui/material";
import React, { useState, useContext } from "react";
import { Add, RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { visuallyHidden } from "@mui/utils";
import { format } from "date-fns";
import { UtilsTable } from "../../utils";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { TablePagination, StyledTableRow, Button, SelectThuoc } from "../common";
import HSBAContext from "../../contexts/HSBAContext";
import mdSections from "../../constants/md_sections.json";

const headCells = [
    { id: 'ngayGioDungThuoc', align: 'left', label: 'Ngày giờ\ndùng thuốc', width: '15%' },
    { id: 'thuocDiUng', align: 'left', label: 'Thuốc dị ứng', width: '25%' },
    { id: 'nghiNgo', align: 'center', label: 'Nghi ngờ', width: '5%' },
    { id: 'chacChan', align: 'center', label: 'Chắc chắn', width: '5%' },
    { id: 'bieuHienLamSang', align: 'left', label: 'Biểu hiện lâm sàng', width: '20%' },
    { id: 'bacSiXacNhan', align: 'left', label: 'Bác sĩ xác nhận chẩn đoán', width: '15%' },
    { id: 'ghiChu', align: 'left', label: 'Ghi chú', width: '15%' }
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
    const [newThuocDiUng, setNewThuocDiUng] = useState([null]);
    const [newKieuDiUng, setNewKieuDiUng] = useState('Nghi ngờ');
    const [newBieuHienLamSang, setNewBieuHienLamSang] = useState('');
    const [newGhiChu, setNewGhiChu] = useState('');
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
        setNewThuocDiUng([null]);
        setNewKieuDiUng('Nghi ngờ');
        setNewBieuHienLamSang('');
        setNewGhiChu('');
        setAddNew(false);
        setErrors([]);
    }

    const handleCancel = () => {
        clearData();
    };
    
    const handleSave = () => {
        if (!!newNgayGioDungThuoc && newThuocDiUng.every(dn => !!dn) && !!newBieuHienLamSang) {
            dispatch(HSBAActions.updateDinhKemSection({
                section: 'phieuTDDiUngThuoc',
                value: {},
                newData: {
                    ngayGioDungThuoc: newNgayGioDungThuoc,
                    thuocDiUng: newThuocDiUng,
                    kieuDiUng: newKieuDiUng,
                    bieuHienLamSang: newBieuHienLamSang,
                    bacSiXacNhan: name,
                    ghiChu: newGhiChu
                }
            }));
            let tSaveSec = [...saveSec];
            tSaveSec[sectionId] = new Date();
            setSaveSec(tSaveSec);
            clearData();
        } else {
            let errs = [];
            if (newThuocDiUng.some(dn => !dn)) errs.push('thuốc');
            if (!newBieuHienLamSang) errs.push('biểu hiện lâm sàng');
            setErrors(errs);
        }
    }

    const handleAddClick = () => {
        setNewThuocDiUng([...newThuocDiUng, null]);
    }

    const handleDelete = (id) => {
        const tNewThuocDiUng = [...newThuocDiUng];
        tNewThuocDiUng.splice(id, 1);
        setNewThuocDiUng(tNewThuocDiUng);
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

                            {addNew && 
                                <TableRow sx={{ '.MuiTableCell-root': { borderTop: '0.5px solid rgba(224, 224, 224, 1)' } }}>
                                    <TableCell className="tableBodyBorderRight">{format(new Date(newNgayGioDungThuoc), 'dd/MM/yyyy, HH:mm')}</TableCell>
                                    <TableCell className="tableBodyBorderRight" sx={{ pb: 0.5 }}>
                                        {newThuocDiUng.map((thuocDiUng, id) => (
                                            <Box className="df aic" sx={{ mb: 1.5 }} key={id}>
                                                <SelectThuoc 
                                                    hamLuong={false}
                                                    placeholder="Thuốc dị ứng"
                                                    value={thuocDiUng}
                                                    onChange={(_, value) => {
                                                        const tThuocDiUng = [...newThuocDiUng];
                                                        tThuocDiUng[id] = value;
                                                        setNewThuocDiUng(tThuocDiUng);
                                                    }}
                                                    existValue={newThuocDiUng}
                                                    sx={{ width: "85%" }}
                                                />

                                                {id === newThuocDiUng.length - 1 
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
                                        <Radio sx={{ p: 0 }} checked={newKieuDiUng === "Nghi ngờ"} onChange={() => setNewKieuDiUng("Nghi ngờ")}/>
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight" align="center">
                                        <Radio sx={{ p: 0 }} checked={newKieuDiUng === "Chắc chắn"} onChange={() => setNewKieuDiUng("Chắc chắn")} />
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
                                            value={newGhiChu}
                                            onChange={(event) => setNewGhiChu(event.target.value)}
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
