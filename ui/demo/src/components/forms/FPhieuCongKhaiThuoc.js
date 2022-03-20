import React, { useState } from "react";
import { 
    Box, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, Paper, IconButton, Grid, Typography, TextField, Divider
} from "@mui/material";
import { Add, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { UtilsTable } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import { TablePagination, Button, StyledTableRow, SelectThuoc } from "../common";
import { format } from "date-fns";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import drugList from "../../constants/drug_list.json";
import { DatePicker } from "@mui/lab";

const headCells = [
    { id: 'stt', numeric: false, label: 'STT', width: '5%' },
    { id: 'tenThuoc', numeric: false, label: 'Tên thuốc, hàm lượng', width: '25%' },
    { id: 'donVi', numeric: false, label: 'Đơn vị', width: '5%' },
    { id: 'ngayThang', numeric: false, label: 'Ngày tháng', width: '25%' },
    { id: 'tongSo', numeric: true, label: 'Tổng số', width: '7%' },
    { id: 'donGia', numeric: true, label: 'Đơn giá', width: '9%' },
    { id: 'thanhTien', numeric: true, label: 'Thành tiền', width: '12%' },
    { id: 'ghiChu', numeric: false, label: 'Ghi chú', width: '12%' }
];

const FPhieuCongKhaiThuoc = () => {
    const content = useSelector((state) => state.HSBA.phieuCongKhaiThuoc);
    const { ngayRaVien } = useSelector((state) => state.HSBA.chanDoanKhiRaVien);
    const { role } = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dateGroup, setDateGroup] = useState(0);

    const rows = content.data;

    const [addNew, setAddNew] = useState(false);
    const [newNgay, setNewNgay] = useState(null);
    const EMPTY_NEW_DATA = { tenThuoc: null, donVi: '', soLuong: 0, donGia: 0, ghiChu: '' };
    const [newDataList, setNewDataList] = useState([EMPTY_NEW_DATA]);
    const [errors, setErrors] = useState([]);

    const clearData = () => {
        setNewDataList([EMPTY_NEW_DATA]);
        setAddNew(false);
        setErrors([]);
    }

    const handleCancel = () => {
        clearData();
    };

    const handleAdd = () => {
        if (!!newNgay && newDataList.every(newData => !!newData.tenThuoc && newData.soLuong > 0)) {
            const newNgayThang = format(newNgay, "yyyy-MM-dd") === content.ngayThang[content.ngayThang.length - 1]
                ? [...content.ngayThang] : [...content.ngayThang, format(newNgay, "yyyy-MM-dd")];
            dispatch(HSBAActions.updatePhieuCongKhaiThuoc({
                value: { ngayThang: newNgayThang },
                newData: newDataList.map(newData => {
                    return {
                        tenThuoc: newData.tenThuoc,
                        donVi: newData.donVi,
                        ngayThang: [...new Array(newNgayThang.length - 1).fill(0), parseInt(newData.soLuong)],
                        tongSo: parseInt(newData.soLuong),
                        donGia: parseInt(newData.donGia),
                        thanhTien: parseInt(newData.donGia) * parseInt(newData.soLuong),
                        ghiChu: newData.ghiChu
                    }
                })
            }));
            clearData();
        } else {
            let errs = [];
            newDataList.forEach((newData) => {
                if (!newData.tenThuoc && errs.findIndex(err => err === 'tên thuốc') === -1) errs.push('tên thuốc');
                if (newData.soLuong === 0 && errs.findIndex(err => err === 'số lượng') === -1) errs.push('số lượng');
            })
            setErrors(errs);
        }
    };

    const calculateTotalByDate = (id) => {
        var total = 0;
        rows.forEach((row) => {
            if (id < row.ngayThang.length) {
                total = total + parseInt(row.ngayThang[id]);
            }    
        });
        return total === 0 ? '' : total;
    };

    const calculateTotalIntoMoney = () => {
        var total = 0;
        rows.forEach((row) => {
            total = total + row.thanhTien;
        });
        return total === 0 ? '' : total;
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

    const handleAddClick = () => {
        setNewDataList([...newDataList, EMPTY_NEW_DATA]);
    }

    const handleDelete = (id) => {
        const tDataList = [...newDataList];
        tDataList.splice(id, 1);
        setNewDataList(tDataList);
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
                                                colSpan={5}
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
                                                        <IconButton size="small" disabled={dateGroup === 1 || content.ngayThang.length <= 5} onClick={handleNextDateGroup}>
                                                            <KeyboardArrowRight/>
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </TableCell>
                                        ) 
                                ))}
                            </TableRow>
                            <TableRow>
                                {Array.from(Array(5)).map((_, index) => (
                                    <TableCell 
                                        key={`ngayThang${index}`}
                                        align="center"
                                        className="tableHeadBorderRight"
                                        width="5%"
                                        sx={{ p: '6px 10px', height: 40 }}
                                    >
                                        {index < content.ngayThang.slice(dateGroup * 5, dateGroup * 5 + 5).length
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
                                            <TableCell className="tableBodyBorderRight" align="center">{index + 1}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.tenThuoc}</TableCell>
                                            <TableCell className="tableBodyBorderRight" align="center">{row.donVi}</TableCell>
                                            {Array.from(Array(5)).map((_, idx) => (
                                                <TableCell key={`nth${idx}`} className="tableBodyBorderRight" align="center">
                                                    {idx < row.ngayThang.slice(dateGroup * 5, dateGroup * 5 + 5).length && row.ngayThang[idx] !== 0
                                                        ? row.ngayThang[idx] : ""}
                                                </TableCell>
                                            ))}
                                            <TableCell className="tableBodyBorderRight" align="center">{row.tongSo}</TableCell>
                                            <TableCell className="tableBodyBorderRight" align="center">{row.donGia.toLocaleString()}</TableCell>
                                            <TableCell className="tableBodyBorderRight" align="center">{row.thanhTien.toLocaleString()}</TableCell>
                                            <TableCell>{row.ghiChu}</TableCell>
                                        </StyledTableRow>
                                    );
                            })}

                            <TableRow hover>
                                <TableCell className="tableBodyBorderRight" colSpan={2}>Tổng số khoản thuốc dùng</TableCell>
                                <TableCell className="tableBodyBorderRight"/>
                                {Array.from(Array(5)).map((_, idx) => (
                                    <TableCell key={`tongSo${idx}`} className="tableBodyBorderRight" align="center">
                                        {calculateTotalByDate(dateGroup * 5 + idx)}
                                    </TableCell>
                                ))}
                                <TableCell className="tableBodyBorderRight"/>
                                <TableCell className="tableBodyBorderRight"/>
                                <TableCell className="tableBodyBorderRight" align="center">
                                    {calculateTotalIntoMoney().toLocaleString()}
                                </TableCell>
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
                        <Box className="df aic jcc">
                            <Typography fontWeight="bold" sx={{ mr: 1 }}>Ngày</Typography>
                            <DatePicker
                                value={newNgay}
                                onChange={(newDate) => setNewNgay(newDate)}
                                renderInput={(params) => <TextField {...params} margin="dense" />}
                                disablePast
                            />
                        </Box>

                        {newDataList.map((newData, idx) => (
                            <Box key={idx}>
                                <Grid container spacing={2} sx={{ py: 1 }}>
                                    <Grid item xs={6}>
                                        <Typography fontWeight="bold">Tên thuốc, hàm lượng</Typography>
                                        <SelectThuoc
                                            fullWidth
                                            inputProps={{ margin: "dense" }}
                                            placeholder="Tên thuốc, hàm lượng"
                                            value={newData.tenThuoc}
                                            onChange={(_, value) => {
                                                const findDonVi = drugList.find(drug => drug.ten_hoat_chat + ' ' + drug.nong_do_ham_luong === value);
                                                const tDataList = [...newDataList];
                                                tDataList[idx] = { 
                                                    ...tDataList[idx], 
                                                    tenThuoc: value, 
                                                    donVi: typeof findDonVi !== "undefined" ? findDonVi.don_vi_tinh_nho_nhat : "",
                                                    donGia: typeof findDonVi !== "undefined" ? findDonVi.don_gia : ""
                                                };
                                                setNewDataList(tDataList);
                                            }}
                                            existValue={newDataList.map(data => data.tenThuoc)}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography fontWeight="bold">Đơn vị</Typography>
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            value={newData.donVi}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography fontWeight="bold">Số lượng</Typography>
                                        <TextField
                                            type="number"
                                            fullWidth
                                            margin="dense"
                                            value={newData.soLuong}
                                            onChange={(event) => {
                                                const tDataList = [...newDataList];
                                                tDataList[idx] = { ...tDataList[idx], soLuong: event.target.value };
                                                setNewDataList(tDataList);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography fontWeight="bold">Đơn giá</Typography>
                                        <TextField
                                            fullWidth
                                            margin="dense"
                                            value={newData.donGia.toLocaleString()}
                                            disabled
                                        />
                                    </Grid>
                                </Grid>

                                <Typography fontWeight="bold">Ghi chú</Typography>
                                <Box className="df aic">
                                    <TextField
                                        multiline
                                        fullWidth
                                        margin="dense"
                                        value={newData.ghiChu}
                                        onChange={(event) => {
                                            const tDataList = [...newDataList];
                                            tDataList[idx] = { ...tDataList[idx], ghiChu: event.target.value };
                                            setNewDataList(tDataList);
                                        }}
                                    />  
                                    {newDataList.length > 1 && <Typography sx={{ cursor: "pointer", ml: 2 }} color="primary" onClick={() => handleDelete(idx)}>
                                        Xóa
                                    </Typography>}
                                </Box> 

                                {idx === newDataList.length - 1
                                    ? (
                                        <Box sx={{ width: "100%", textAlign: "center", mt: 1 }}>
                                            <IconButton size="small" onClick={handleAddClick}>
                                                <Add />
                                            </IconButton>
                                        </Box>
                                    )
                                    : <Divider sx={{ mt: 2, mb: 1 }} />
                                }
                            </Box>
                        ))}   
                    </Box>
                </Paper>
            ) : null}

            { (role === "DD" && !ngayRaVien) && 
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
                                    setNewNgay(new Date());
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

                                <Button variant="primary" onClick={handleAdd}>
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

export default FPhieuCongKhaiThuoc;