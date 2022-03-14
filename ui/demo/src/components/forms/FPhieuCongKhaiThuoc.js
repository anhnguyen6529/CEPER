import React, { useState, useContext } from "react";
import { 
    Box, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, Paper, IconButton, Grid, Typography, TextField
} from "@mui/material";
import { Add, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { UtilsTable } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import { TablePagination, Button, StyledTableRow, SelectThuoc } from "../common";
import { format } from "date-fns";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import HSBAContext from "../../contexts/HSBAContext";
import mdSections from "../../constants/md_sections.json";
import drugList from "../../constants/drug_list.json";

const headCells = [
    { id: 'stt', numeric: false, label: 'STT', width: '5%' },
    { id: 'tenThuoc', numeric: false, label: 'Tên thuốc, hàm lượng', width: '25%' },
    { id: 'donVi', numeric: false, label: 'Đơn vị', width: '5%' },
    { id: 'ngayThang', numeric: false, label: 'Ngày tháng', width: '42%' },
    { id: 'tongSo', numeric: true, label: 'Tổng số', width: '8%' },
    { id: 'ghiChu', numeric: false, label: 'Ghi chú', width: '15%' }
];

const FPhieuCongKhaiThuoc = () => {
    const content = useSelector((state) => state.HSBA.phieuCongKhaiThuoc);
    const { ngayRaVien } = useSelector((state) => state.HSBA.chanDoanKhiRaVien);
    const { role } = useSelector(state => state.auth.user);
    const { saveSec, setSaveSec } = useContext(HSBAContext);
    const dispatch = useDispatch();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dateGroup, setDateGroup] = useState(0);

    const rows = content.data;
    const sectionId = mdSections["order"].indexOf("Phiếu công khai thuốc");

    const [addNew, setAddNew] = useState(false);
    const [newNgayThang, setNewNgayThang] = useState(content.ngayThang);
    const EMPTY_NEW_DATA = { tenThuoc: null, donVi: '', ngayThang: new Array(newNgayThang.length).fill(0), tongSo: 0, ghiChu: '' };
    const [newData, setNewData] = useState(EMPTY_NEW_DATA);
    const [errors, setErrors] = useState([]);

    const clearData = () => {
        setNewNgayThang(content.ngayThang);
        setNewData(EMPTY_NEW_DATA);
        setAddNew(false);
        setErrors([]);
    }

    const handleCancel = () => {
        clearData();
    };

    const handleSave = () => {
        if (newNgayThang.length > 0 && !!newData.tenThuoc && newData.ngayThang.some(nth => nth > 0)) {
            dispatch(HSBAActions.updateDinhKemSection({
                section: 'phieuCongKhaiThuoc',
                value: { ngayThang: newNgayThang },
                newData: newData
            }));
            let tSaveSec = [...saveSec];
            tSaveSec[sectionId] = new Date();
            setSaveSec(tSaveSec);
            clearData();
        } else {
            let errs = [];
            if (!newData.tenThuoc && errs.findIndex(err => err === 'tên thuốc') === -1) errs.push('tên thuốc');
            if (newData.ngayThang.every(nth => parseInt(nth) === 0) && errs.findIndex(err => err === 'lượng thuốc dùng từng ngày')) {
                errs.push('lượng thuốc dùng từng ngày');
            }
            setErrors(errs);
        }
    };

    const handleAddNgayThangClick = () => {
        const tData = {...newData}, dateValue = new Date(newNgayThang[newNgayThang.length - 1]);
        tData.ngayThang.push(0);
        setNewNgayThang([...newNgayThang, dateValue.setDate(dateValue.getDate() + 1)]);
        setNewData(tData);
    }

    const calculateTotalByDate = (id) => {
        var total = 0;
        rows.forEach((row) => {
            if (id < row.ngayThang.length) {
                total = total + parseInt(row.ngayThang[id]);
            }    
        });
        return total === 0 ? '' : total;
    };

    const calculateTotal = (array) => {
        var total = 0;
        array.forEach((nth) => {
            total = total + parseInt(nth);
        });
        return total;
    };

    const handleNextDateGroup = () => {
        if (dateGroup === 0) {
            setDateGroup(1);
        }
    }

    const handlePreviousDateGroup = () => {
        if (dateGroup === 1) {
            setDateGroup(0);
        }
    }

    return (
        <>
            <Paper>
                <TableContainer>
                    <Table stickyHeader> 
                        <TableHead sx={{ '.MuiTableCell-root': { bgcolor: '#D9EFFE' } }}>
                            <TableRow>
                                {headCells.map((headCell, id) => (
                                    headCell.id !== 'ngayThang'
                                        ? (
                                            <TableCell
                                                key={`${headCell.id}Head`}
                                                align="center"
                                                sortDirection={headCell.id === "stt" ? "asc" : false}
                                                width={headCell.width}
                                                rowSpan={2}
                                                className={id < headCells.length - 1 ? "tableHeadBorderRight" : "" }
                                            >
                                                {headCell.label}
                                            </TableCell>
                                        )
                                        : (
                                            <TableCell 
                                                key={`${headCell.id}Head`} 
                                                align="center" 
                                                colSpan={7}
                                                className="tableHeadBorderRight"
                                                sx={{ px: 1 }}
                                            >
                                                <Grid container sx={{ justifyContent: 'center' }}>
                                                    <Grid item xs={3} align="left">
                                                        <IconButton size="small" disabled={dateGroup === 0} onClick={handlePreviousDateGroup}>
                                                            <KeyboardArrowLeft />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Box className="df aic jcc" sx={{ height: '100%' }}>{headCell.label}</Box>
                                                        
                                                    </Grid>
                                                    <Grid item xs={3} align="right">
                                                        <IconButton size="small" disabled={dateGroup === 1 || content.ngayThang.length < 7} onClick={handleNextDateGroup}>
                                                            <KeyboardArrowRight/>
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </TableCell>
                                        ) 
                                ))}
                            </TableRow>
                            <TableRow>
                                {Array.from(Array(7)).map((_, index) => (
                                    <TableCell 
                                        key={`ngayThang${index}`}
                                        align="center"
                                        className="tableHeadBorderRight"
                                        width="6%"
                                        sx={{ p: '6px 10px', height: 40 }}
                                    >
                                        {index < content.ngayThang.slice(dateGroup * 7, dateGroup * 7 + 7).length
                                            ? format(new Date(content.ngayThang[index]), "dd/MM")
                                            : "__/__"
                                        }
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {UtilsTable.stableSort(rows, UtilsTable.getComparator("asc", "stt"))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <StyledTableRow hover key={index}>
                                            <TableCell className="tableBodyBorderRight">{index + 1}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.tenThuoc}</TableCell>
                                            <TableCell className="tableBodyBorderRight" align="center">{row.donVi}</TableCell>
                                            {Array.from(Array(7)).map((_, idx) => (
                                                <TableCell key={`nth${idx}`} className="tableBodyBorderRight" align="center">
                                                    {idx < row.ngayThang.slice(dateGroup * 7, dateGroup * 7 + 7).length && row.ngayThang[idx] !== 0
                                                        ? row.ngayThang[idx] : ""}
                                                </TableCell>
                                            ))}
                                            <TableCell className="tableBodyBorderRight" align="center">{row.tongSo}</TableCell>
                                            <TableCell>{row.ghiChu}</TableCell>
                                        </StyledTableRow>
                                    );
                            })}

                            <TableRow hover>
                                <TableCell className="tableBodyBorderRight" colSpan={2}>Tổng số khoản thuốc dùng</TableCell>
                                <TableCell className="tableBodyBorderRight"/>
                                {Array.from(Array(7)).map((_, idx) => (
                                    <TableCell key={`tongSo${idx}`} className="tableBodyBorderRight" align="center">
                                        {calculateTotalByDate(dateGroup * 7 + idx)}
                                    </TableCell>
                                ))}
                                <TableCell className="tableBodyBorderRight"/>
                                <TableCell />
                            </TableRow>
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

            {addNew ? (
                <Paper sx={{ mt: 3 }}>
                    <Box sx={{ px: 2, py: 1, bgcolor: "#D9EFFE", borderRadius: "4px 4px 0px 0px" }}>
                        <Typography>
                            Phiếu công khai thuốc - <i><b>Thêm mới</b></i>
                        </Typography>
                    </Box>

                    <Box sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography fontWeight="bold">Tên thuốc, hàm lượng</Typography>
                                <SelectThuoc
                                    fullWidth
                                    inputProps={{ margin: "dense" }}
                                    value={newData.tenThuoc}
                                    onChange={(_, value) => {
                                        const findDonVi = drugList.find(drug => drug.ten_hoat_chat + ' ' + drug.nong_do_ham_luong === value);
                                        setNewData({ 
                                            ...newData, 
                                            tenThuoc: value,
                                            donVi: typeof findDonVi !== "undefined" ? findDonVi.don_vi_tinh_nho_nhat : ""
                                        });
                                    }}
                                    existValue={[newData]}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography fontWeight="bold">Đơn vị</Typography>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    value={newData.donVi}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography fontWeight="bold">Tổng số</Typography>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    value={newData.tongSo}
                                    disabled
                                />
                            </Grid>
                        </Grid>

                        <Grid container columnSpacing={2} rowSpacing={1} sx={{ py: 1 }}>
                            {newNgayThang.map((ngayThang, id) => (
                                <Grid item xs={1.5} key={id}>
                                    <Typography fontWeight="bold">Ngày {format(new Date(ngayThang), "dd/MM")}</Typography>
                                    <TextField 
                                        type="number"
                                        fullWidth
                                        margin="dense"
                                        InputProps={{ inputProps: { min: 0 } }}
                                        value={newData.ngayThang[id]}
                                        onChange={(event) => {
                                            const tNgayThang = newData.ngayThang;
                                            tNgayThang[id] = event.target.value;
                                            setNewData({ ...newData, ngayThang: tNgayThang, tongSo: calculateTotal(tNgayThang) });
                                        }}
                                    />
                                </Grid>
                            ))}
                            <Grid item xs={1.5}>
                                <IconButton 
                                    size="small" 
                                    sx={{ bgcolor: "#D9EFFE", mt: newData.ngayThang.length % 8 !== 0 ? 5 : 0 }} 
                                    color="primary" 
                                    onClick={() => handleAddNgayThangClick()}
                                >
                                    <Add />
                                </IconButton>
                            </Grid>
                        </Grid>    

                        <Typography fontWeight="bold">Ghi chú</Typography>
                        <TextField
                            multiline
                            fullWidth
                            margin="dense"
                            value={newData.ghiChu}
                            onChange={(event) => setNewData({ ...newData, ghiChu: event.target.value })}
                        />      
                    </Box>
                </Paper>
            ) : null}

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

export default FPhieuCongKhaiThuoc;