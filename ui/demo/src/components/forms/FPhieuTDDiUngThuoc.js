import { 
    Box, Paper, TableContainer, TableHead, TableBody, TableRow, 
    TableCell, Table, TableSortLabel, Grid, Typography, TextField, Radio
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Add, CancelOutlined, RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { visuallyHidden } from "@mui/utils";
import { format } from "date-fns";
import { UtilsTable } from "../../utils";
import { TablePagination, StyledTableRow, Button, SelectThuoc } from "../common";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import UserContext from "../../contexts/UserContext";
import { HSBAActions } from "../../redux/slices/HSBA.slice";

const SECTION_NAME = "Phiếu TD dị ứng thuốc";
const SECTION_FIELD = "phieuTDDiUngThuoc";

const headCells = [
    { id: 'ngayGioDungThuoc', align: 'left', label: 'Ngày', width: '10%', minWidth: 115 },
    { id: 'gioDungThuoc', align: 'left', label: 'Giờ', width: '5%', minWidth: 85 },
    { id: 'khoa', label: 'Khoa', width: '10%', minWidth: 115 },
    { id: 'thuocDiUng', align: 'left', label: 'THUỐC DỊ ỨNG', width: '20%', minWidth: 200 },
    { id: 'nghiNgo', align: 'center', label: 'Nghi ngờ', width: '5%', minWidth: 0 },
    { id: 'chacChan', align: 'center', label: 'Chắc chắn', width: '5%', minWidth: 0 },
    { id: 'bieuHienLamSang', align: 'left', label: 'Biểu hiện lâm sàng', width: '20%', minWidth: 250 },
    { id: 'bacSiXacNhan', align: 'left', label: 'Bác sĩ xác nhận chẩn đoán', width: '10%', minWidth: 170 },
    { id: 'ghiChu', align: 'left', label: 'Ghi chú', width: '15%', minWidth: 120 }
];

const FPhieuTDDiUngThuoc = () => {
    const content = useSelector((state) => state.HSBA.phieuTDDiUngThuoc);
    const { ngayRaVien } = useSelector((state) => state.HSBA.chanDoanKhiRaVien);
    const { updating, confirmUpdate, khoa } = useSelector((state) => state.HSBA);
    const { role, name, id } = useSelector((state) => state.auth.user);
    const { appearTime } = useContext(UserContext);
    const dispatch = useDispatch();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('ngayGioDungThuoc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [newNgayGioDungThuoc, setNewNgayGioDungThuoc] = useState(appearTime[SECTION_NAME]);
    const [newThuocDiUng, setNewThuocDiUng] = useState([null]);
    const [newKieuDiUng, setNewKieuDiUng] = useState('');
    const [newBieuHienLamSang, setNewBieuHienLamSang] = useState('');
    const [newGhiChu, setNewGhiChu] = useState('');
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
        setNewThuocDiUng([null]);
        setNewKieuDiUng('');
        setNewBieuHienLamSang('');
        setNewGhiChu('');
        setErrors([]);
    }

    const handleCancel = () => {
        clearData();
        setHasChanged(false);
    };
    
    const handleAdd = () => {
        if (newThuocDiUng.every(dn => !!dn) && !!newKieuDiUng && !!newBieuHienLamSang) {
            const now = new Date().toISOString();
            setRows([...rows, {
                ngayGioDungThuoc: now,
                khoa: khoa,
                thuocDiUng: newThuocDiUng,
                kieuDiUng: newKieuDiUng,
                bieuHienLamSang: newBieuHienLamSang,
                bacSiXacNhan: `${id} - ${name}`,
                ghiChu: newGhiChu
            }]);
            setNewNgayGioDungThuoc(now);

            clearData();
            dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
            setHasChanged(false);
        } else {
            let errs = [];
            if (newThuocDiUng.some(dn => !dn)) errs.push('THUỐC DỊ ỨNG');
            if (!newKieuDiUng) errs.push('Nghi ngờ/Chắc chắn');
            if (!newBieuHienLamSang) errs.push('Biểu hiện lâm sàng');
            setErrors(errs);
        }
    }

    const handleAddClick = () => {
        setNewThuocDiUng([...newThuocDiUng, null]);
        if (!hasChanged) {
            setHasChanged(true);
        }
    }

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
                                        align={headCell.align}
                                        sortDirection={orderBy === headCell.id ? order : false}
                                        width={headCell.width}
                                        sx={{ minWidth: headCell.minWidth }}
                                        className={id < headCells.length - 1 ? "tableHeadBorderRight" : ""} 
                                    >
                                        {headCell.id === "nghiNgo" || headCell.id === "chacChan" || headCell.id === "gioDungThuoc"
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
                                        <TableCell className="tableBodyBorderRight">{format(new Date(row.ngayGioDungThuoc), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{format(new Date(row.ngayGioDungThuoc), 'HH:mm')}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.khoa}</TableCell>
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

                            {(role === "BS" && !ngayRaVien && !updating) ?
                                <TableRow sx={{ '.MuiTableCell-root': { borderTop: '0.5px solid rgba(224, 224, 224, 1)' } }}>
                                    <TableCell className="tableBodyBorderRight">{format(new Date(newNgayGioDungThuoc), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell className="tableBodyBorderRight">{format(new Date(newNgayGioDungThuoc), 'HH:mm')}</TableCell>
                                    <TableCell className="tableBodyBorderRight">{khoa}</TableCell>
                                    <TableCell className="tableBodyBorderRight" sx={{ pb: 0.5 }}>
                                        {newThuocDiUng.map((thuocDiUng, id) => (
                                            <Box className="df aic" sx={{ mb: 1.5 }} key={id}>
                                                <SelectThuoc 
                                                    fullWidth
                                                    hamLuong={false}
                                                    placeholder="Thuốc dị ứng"
                                                    value={thuocDiUng}
                                                    onChange={(_, value) => {
                                                        const tThuocDiUng = [...newThuocDiUng];
                                                        tThuocDiUng[id] = value;
                                                        setNewThuocDiUng(tThuocDiUng);
                                                        if (!value) {
                                                            if (newThuocDiUng.every((thuoc, i) => (i !== id && !thuoc) || i === id)
                                                                && !newKieuDiUng && !newBieuHienLamSang && !newGhiChu) {
                                                                setHasChanged(false);
                                                            }
                                                        } else {
                                                            if (!hasChanged) {
                                                                setHasChanged(true);
                                                            }
                                                        }
                                                    }}
                                                    existValue={newThuocDiUng}
                                                />

                                                {id === newThuocDiUng.length - 1 
                                                    ? <Add sx={{ ml: 0.5, cursor: "pointer", color: "#999" }} onClick={handleAddClick} />
                                                : null}
                                            </Box>
                                        ))}
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight" align="center">
                                        <Radio 
                                            sx={{ p: 0 }} 
                                            checked={newKieuDiUng === "Nghi ngờ"} 
                                            onChange={() => { 
                                                setNewKieuDiUng("Nghi ngờ");
                                                if (!hasChanged) {
                                                    setHasChanged(true);
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight" align="center">
                                        <Radio 
                                            sx={{ p: 0 }} 
                                            checked={newKieuDiUng === "Chắc chắn"} 
                                            onChange={() => {
                                                setNewKieuDiUng("Chắc chắn");
                                                if (!hasChanged) {
                                                    setHasChanged(true);
                                                }
                                            }} 
                                        />
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <TextField
                                            multiline
                                            fullWidth
                                            value={newBieuHienLamSang}
                                            onChange={({ target: { value } }) => {
                                                setNewBieuHienLamSang(value);
                                                if (!value) {
                                                    if (newThuocDiUng.every((thuoc) => !thuoc) && !newKieuDiUng && !newGhiChu) {
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
                                    <TableCell className="tableBodyBorderRight">{`${id} - ${name}`}</TableCell>
                                    <TableCell>
                                        <TextField
                                            multiline
                                            fullWidth
                                            value={newGhiChu}
                                            onChange={({ target: { value } }) => {
                                                setNewGhiChu(value);
                                                if (!value) {
                                                    if (newThuocDiUng.every((thuoc) => !thuoc) && !newKieuDiUng && !newBieuHienLamSang) {
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

export default FPhieuTDDiUngThuoc;
