import React, { useState } from "react";
import { 
    Box, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, Paper, Grid, Typography, TextField, Tooltip
} from "@mui/material";
import { Add, ArrowLeft, ArrowRight } from "@mui/icons-material";
import { UtilsTable } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import { TablePagination, Button, StyledTableRow, SelectThuoc } from "../common";
import { format } from "date-fns";
import drugList from "../../constants/drug_list.json";
import { DatePicker } from "@mui/lab";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";

const SECTION_NAME = "Phiếu công khai thuốc";

const headCells = [
    { id: 'stt', label: 'STT', width: '5%', minWidth: 65 },
    { id: 'tenThuoc', label: 'Tên thuốc, hàm lượng', width: '22%', minWidth: 225 },
    { id: 'donVi', label: 'Đơn vị', width: '5%', minWidth: 65 },
    { id: 'ngayThang', label: 'Ngày tháng', width: '25%', minWidth: 0 },
    { id: 'tongSo', label: 'Tổng số', width: '7%', minWidth: 80 },
    { id: 'donGia', label: 'Đơn giá', width: '9%', minWidth: 95 },
    { id: 'thanhTien', label: 'Thành tiền', width: '12%', minWidth: 120 },
    { id: 'ghiChu', label: 'Ghi chú', width: '15%', minWidth: 150 }
];

const FPhieuCongKhaiThuoc = () => {
    const content = useSelector((state) => state.HSBA.phieuCongKhaiThuoc);
    const { ngayRaVien } = useSelector((state) => state.HSBA.chanDoanKhiRaVien);
    const { role } = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const MAX_LAST_ROWS = (role === "DD" && !ngayRaVien) ? 1 : 3;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [ngayThang, setNgayThang] = useState(content.ngayThang);
    const [rows, setRows] = useState(content.data);
    const [expandAllRows, setExpandAllRows] = useState(false);

    const [newNgay, setNewNgay] = useState({ ngay: null, soLuong: new Array(rows.length).fill(0) });
    const EMPTY_NEW_DATA = { tenThuoc: null, donVi: '', soLuong: 0, donGia: 0, ghiChu: '' };
    const [newDataList, setNewDataList] = useState([EMPTY_NEW_DATA]);
    const [errors, setErrors] = useState([]);
    const [hasChanged, setHasChanged] = useState(false);

    const clearData = (soLuongLength) => {
        setNewNgay({ ngay: null, soLuong: new Array(soLuongLength).fill(0) });
        setNewDataList([EMPTY_NEW_DATA]);
        setErrors([]);
    }

    const handleCancel = () => {
        clearData(rows.length);
        setHasChanged(false);
    };

    const handleAdd = () => {
        if (!!newNgay.ngay && ((newDataList.length === 1 && ((!!newDataList[0].tenThuoc && newDataList[0].soLuong > 0) 
            || (!newDataList[0].tenThuoc && newDataList[0].soLuong === 0 && !newDataList[0].ghiChu && newNgay.soLuong.some(sl => sl > 0)))) 
            || (newDataList.length > 1 && newDataList.every(newData => !!newData.tenThuoc && newData.soLuong > 0)))) {
            const newNgayThang = format(new Date(newNgay.ngay), "yyyy-MM-dd") === ngayThang[ngayThang.length - 1]
                ? [...ngayThang] : [...ngayThang, format(new Date(newNgay.ngay), "yyyy-MM-dd")];      
            let newRow = [];
            if ((newDataList.length === 1 && !!newDataList[0].tenThuoc && newDataList[0].soLuong > 0) || newDataList.length > 1) {
                newRow = newDataList.map(newData => ({
                    tenThuoc: newData.tenThuoc,
                    donVi: newData.donVi, 
                    ngayThang: [...new Array(newNgayThang.length - 1).fill(0), newData.soLuong],
                    tongSo: newData.soLuong,
                    donGia: newData.donGia,
                    thanhTien: newData.donGia * newData.soLuong,
                    ghiChu: newData.ghiChu
                }));
            }
            const tRows = [...rows];
            newNgay.soLuong.forEach((sl, id) => {
                tRows[id] = { 
                    ...tRows[id], 
                    ngayThang: [...new Array(newNgayThang.length - 1).fill(0), sl].map((nth, i) => i < tRows[id].ngayThang.length ? nth + tRows[id].ngayThang[i] : nth),
                    tongSo: sl + tRows[id].tongSo,
                    thanhTien: sl * tRows[id].donGia + tRows[id].thanhTien
                };
            });
            setNgayThang(newNgayThang);
            setRows([...tRows, ...newRow]);

            clearData(tRows.length + newRow.length);
            dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
            setHasChanged(false);
        } else {
            let errs = [], dateErrs = [], drugErrs = [];
            if (!newNgay.ngay) {
                dateErrs.push('ngày tháng');
                drugErrs.push('ngày tháng');
            }
            if (newDataList.length === 1) {
                if (!newDataList[0].tenThuoc && newDataList[0].soLuong === 0 && !newDataList[0].ghiChu && newNgay.soLuong.every(sl => sl === 0)) {
                    dateErrs.push('số lượng thuốc dùng (cột đã có)');
                }
                if (!newDataList[0].tenThuoc) drugErrs.push('tên thuốc');
                if (newDataList[0].soLuong === 0) drugErrs.push('số lượng thuốc dùng (hàng mới)');
            } else if (newDataList.length > 1) {
                newDataList.forEach((newData) => {
                    if (!newData.tenThuoc && drugErrs.findIndex(err => err === 'tên thuốc') === -1) drugErrs.push('tên thuốc');
                    if (newData.soLuong === 0 && drugErrs.findIndex(err => err === 'số lượng thuốc dùng (hàng mới)') === -1) drugErrs.push('số lượng thuốc dùng (hàng mới)');
                });
            }
            if (dateErrs.length > 0) errs.push([dateErrs.join(', '), "- nếu muốn thêm thông tin thuốc đã có"]);
            if (drugErrs.length > 0) errs.push([drugErrs.join(', '), "- nếu muốn thêm thông tin thuốc mới"]);
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

    const handleAddClick = () => {
        setNewDataList([...newDataList, EMPTY_NEW_DATA]);
        if (!hasChanged) {
            setHasChanged(true);
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
                                                sx={{ minWidth: headCell.minWidth, zIndex: 1 }}
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
                                                colSpan={ngayThang.length <= MAX_LAST_ROWS || expandAllRows 
                                                    ? (expandAllRows 
                                                        ? (role === "DD" && !ngayRaVien ? (ngayThang.length + 1) + 1 : ngayThang.length + 1)
                                                        : (role === "DD" && !ngayRaVien ? ngayThang.length + 1 : ngayThang.length)
                                                    ) : (role === "DD" && !ngayRaVien ? (1 + MAX_LAST_ROWS) + 1 : 1 + MAX_LAST_ROWS)
                                                }
                                                className="tableHeadBorderRight"
                                                sx={{ px: 1, zIndex: 0 }}
                                            >
                                                {headCell.label}
                                            </TableCell>
                                        ) 
                                ))}
                            </TableRow>
                            <TableRow>
                                {ngayThang.length <= MAX_LAST_ROWS || expandAllRows 
                                    ? (
                                        <>
                                            {ngayThang.map((nth, index) => (
                                                <TableCell 
                                                    key={`ngayThang${index}`}
                                                    align="center"
                                                    className="tableHeadBorderRight"
                                                    sx={{ p: '6px 10px', minWidth: 95, zIndex: 0 }}
                                                >
                                                    {format(new Date(nth), "dd/MM/yyyy")}
                                                </TableCell>
                                            ))}
                                            {expandAllRows && 
                                                <TableCell 
                                                    className="tableHeadBorderRight" 
                                                    align="center" 
                                                    sx={{ cursor: 'pointer', p: 0, zIndex: 0 }}
                                                    onClick={() => setExpandAllRows(false)}
                                                >
                                                    <Tooltip title="Ẩn bớt ngày" placement="top">
                                                        <ArrowLeft sx={{ mt: 1 }} />
                                                    </Tooltip>
                                                </TableCell>
                                            }
                                        </>
                                    ) : (
                                        <>
                                            <TableCell 
                                                className="tableHeadBorderRight" 
                                                align="center" 
                                                sx={{ cursor: 'pointer', p: 0, zIndex: 0 }}
                                                onClick={() => setExpandAllRows(true)}
                                            >
                                                <Tooltip title="Hiện tất cả ngày" placement="top">
                                                    <ArrowRight sx={{ mt: 1 }} />
                                                </Tooltip>
                                            </TableCell>
                                            {ngayThang.slice(ngayThang.length - MAX_LAST_ROWS).map((nth, index) => (
                                                <TableCell 
                                                    key={`ngayThang${index}`}
                                                    align="center"
                                                    className="tableHeadBorderRight"
                                                    sx={{ p: '6px 10px', minWidth: 95, zIndex: 0 }}
                                                >
                                                    {format(new Date(nth), "dd/MM/yyyy")}
                                                </TableCell>
                                            ))}
                                        </>
                                    )
                                }
                                
                                {(role === "DD" && !ngayRaVien) ? 
                                    <TableCell className="tableHeadBorderRight" sx={{ minWidth: 170 }}>
                                        <DatePicker 
                                            value={newNgay.ngay}
                                            onChange={(newDate) => {
                                                setNewNgay({ ...newNgay, ngay: newDate });
                                                if (!newDate) {
                                                    if (newNgay.soLuong.every(sl => sl === 0) && newDataList.every(newData => !newData.tenThuoc
                                                        && !newData.donVi && newData.soLuong === 0 && newData.donGia === 0 && !newData.ghiChu)) {
                                                        setHasChanged(true);
                                                    }
                                                } else {
                                                    if (!hasChanged) {
                                                        setHasChanged(true);
                                                    }
                                                }
                                            }}
                                            renderInput={(params) => <TextField fullWidth {...params} sx={{ '.MuiOutlinedInput-root': { bgcolor: "white" } }} />}
                                            disablePast
                                            OpenPickerButtonProps={{ size: "small", sx: { px: 0, '.MuiSvgIcon-root': { fontSize: 20 } } }}
                                        />
                                    </TableCell>
                                : null}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        
                            {(rowsPerPage > 0
                                ? UtilsTable.stableSort(rows, UtilsTable.getComparator("asc", "stt")).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : UtilsTable.stableSort(rows, UtilsTable.getComparator("asc", "stt"))
                            ).map((row, index) => {
                                return (
                                    <StyledTableRow hover key={index}>
                                        <TableCell className="tableBodyBorderRight" align="center">{index + 1}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.tenThuoc}</TableCell>
                                        <TableCell className="tableBodyBorderRight" align="center">{row.donVi}</TableCell>
                                        {ngayThang.length <= MAX_LAST_ROWS || expandAllRows ? (
                                            <>
                                                {row.ngayThang.map((nth, idx) => (
                                                    <TableCell key={`nth${idx}`} className="tableBodyBorderRight" align="center">
                                                        {nth !== 0 ? nth : ""}
                                                    </TableCell>
                                                ))}
                                                {expandAllRows && <TableCell className="tableBodyBorderRight" />}
                                            </>
                                        ) : (
                                            <>
                                                <TableCell className="tableBodyBorderRight" />
                                                {row.ngayThang.slice(row.ngayThang.length - MAX_LAST_ROWS).map((nth, idx) => (
                                                    <TableCell key={`nth${idx}`} className="tableBodyBorderRight" align="center">
                                                        {nth !== 0 ? nth : ""}
                                                    </TableCell>
                                                ))}
                                            </>
                                        )}

                                        {(role === "DD" && !ngayRaVien) ? 
                                            <TableCell className="tableBodyBorderRight">
                                                <TextField 
                                                    type="number"
                                                    InputProps={{ inputProps: { min: 0 } }}
                                                    fullWidth
                                                    value={newNgay.soLuong[index]}
                                                    onChange={({ target: { value } }) => {
                                                        const tSoLuong = [...newNgay.soLuong];
                                                        tSoLuong[index] = !value ? 0 : parseInt(value);
                                                        setNewNgay({ ...newNgay, soLuong: tSoLuong });
                                                        if (!value || parseInt(value) === 0) {
                                                            if (!newNgay.ngay && newNgay.soLuong.every((sl, i) => (i !== index && sl === 0) || i === index) 
                                                                && newDataList.every((newData) => !newData.tenThuoc && !newData.donVi && newData.soLuong === 0 
                                                                && newData.donGia === 0 && !newData.ghiChu)) {
                                                                setHasChanged(false);
                                                            }
                                                        } else {
                                                            if (!hasChanged) {
                                                                setHasChanged(true);
                                                            }
                                                        }
                                                    }}
                                                    sx={{ '.MuiOutlinedInput-root': { bgcolor: "white" } }}
                                                />
                                            </TableCell>
                                        : null}
                                        <TableCell className="tableBodyBorderRight" align="center">{row.tongSo}</TableCell>
                                        <TableCell className="tableBodyBorderRight" align="center">{row.donGia.toLocaleString()}</TableCell>
                                        <TableCell className="tableBodyBorderRight" align="center">{row.thanhTien.toLocaleString()}</TableCell>
                                        <TableCell>{row.ghiChu}</TableCell>
                                    </StyledTableRow>
                                );
                            })}

                            {(role === "DD" && !ngayRaVien) ? 
                                newDataList.map((newData, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="tableBodyBorderRight" align="center">{(rows.length + 1) + idx}</TableCell>
                                        <TableCell className="tableBodyBorderRight">
                                            <Box className="df aic">
                                                <SelectThuoc
                                                    fullWidth
                                                    placeholder="Tên thuốc"
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
                                                        if (!hasChanged) {
                                                            setHasChanged(true);
                                                        }
                                                    }}
                                                    existValue={[...newDataList.map(data => data.tenThuoc), ...rows.map(row => row.tenThuoc)]}
                                                />

                                                {idx === newDataList.length - 1
                                                    ? <Add sx={{ ml: 0.5, cursor: "pointer", color: "#999" }} onClick={handleAddClick} />
                                                : null}
                                            </Box>
                                        </TableCell>
                                        <TableCell className="tableBodyBorderRight" align="center">{newData.donVi}</TableCell>
                                        {ngayThang.length <= MAX_LAST_ROWS || expandAllRows ? (
                                            expandAllRows 
                                                ? Array.from(Array(ngayThang.length + 1)).map((_, id) => (<TableCell key={id} className="tableBodyBorderRight" />))
                                                : Array.from(Array(ngayThang.length)).map((_, id) => (<TableCell key={id} className="tableBodyBorderRight" />))
                                        ) : (
                                            <>
                                                <TableCell className="tableBodyBorderRight" />
                                                {ngayThang.slice(ngayThang.length - MAX_LAST_ROWS).map((_, id) => (
                                                    <TableCell key={id} className="tableBodyBorderRight" />
                                                ))}
                                            </>
                                        )}
                                        <TableCell className="tableBodyBorderRight">
                                            <TextField
                                                type="number"
                                                fullWidth
                                                InputProps={{ inputProps: { min: 0 } }}
                                                value={newData.soLuong}
                                                onChange={({ target: { value } }) => {
                                                    const tDataList = [...newDataList];
                                                    tDataList[idx] = { ...tDataList[idx], soLuong: !value ? 0 : parseInt(value) };
                                                    setNewDataList(tDataList);
                                                    if (!value || parseInt(value) === 0) {
                                                        if (!newNgay.ngay && newNgay.soLuong.every(sl => sl === 0) && newDataList.every((newData, i) => !newData.tenThuoc && !newData.donVi 
                                                            && ((i !== idx && newData.soLuong === 0) || i === idx) && newData.donGia === 0 && !newData.ghiChu)) {
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
                                        <TableCell className="tableBodyBorderRight" />
                                        <TableCell className="tableBodyBorderRight" align="center">
                                            {newData.donGia !== 0 ? newData.donGia.toLocaleString() : ""}
                                        </TableCell>
                                        <TableCell className="tableBodyBorderRight" />
                                        <TableCell>
                                            <TextField
                                                multiline
                                                fullWidth
                                                value={newData.ghiChu}
                                                onChange={({ target: { value } }) => {
                                                    const tDataList = [...newDataList];
                                                    tDataList[idx] = { ...tDataList[idx], ghiChu: value };
                                                    setNewDataList(tDataList);
                                                    if (!value) {
                                                        if (!newNgay.ngay && newNgay.soLuong.every(sl => sl === 0) && newDataList.every((newData, i) => !newData.tenThuoc && !newData.donVi 
                                                            && newData.soLuong === 0 && newData.donGia === 0 && ((i !== idx && !newData.ghiChu) || i === idx))) {
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
                                ))
                            : null}
                            
                            <TableRow>
                                <TableCell className="tableBodyBorderRight" colSpan={2}>Tổng số khoản thuốc dùng</TableCell>
                                <TableCell className="tableBodyBorderRight" />
                                {ngayThang.length <= MAX_LAST_ROWS || expandAllRows ? (
                                    <>
                                        {ngayThang.map((_, idx) => (
                                            <TableCell key={`tongSo${idx}`} className="tableBodyBorderRight" align="center">
                                                {calculateTotalByDate(idx)}
                                            </TableCell>
                                        ))}
                                        {expandAllRows && <TableCell className="tableBodyBorderRight" />}
                                    </>
                                ) : (
                                    <>
                                        <TableCell className="tableBodyBorderRight" />
                                        {ngayThang.slice(ngayThang.length - MAX_LAST_ROWS).map((_, idx) => (
                                            <TableCell key={`tongSo${idx}`} className="tableBodyBorderRight" align="center">
                                                {calculateTotalByDate(ngayThang.length - MAX_LAST_ROWS + idx)}
                                            </TableCell>
                                        ))}
                                    </>
                                )}
                                {(role === "DD" && !ngayRaVien) ? <TableCell className="tableBodyBorderRight" /> : null}
                                <TableCell className="tableBodyBorderRight" />
                                <TableCell className="tableBodyBorderRight" />
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

            {hasChanged && 
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={8}>
                        {errors.length > 1 ? 
                            <>
                                <Typography color="error">Vui lòng nhập:</Typography>
                                {errors.map((error, id) => 
                                    <Typography key={id} color="error">+ <b>{error[0]}</b>{' '}<i>{error[1]}</i>.</Typography>
                                )}
                            </>
                        : (
                            errors.length > 0 ?
                                <Typography color="error">
                                    Vui lòng nhập: <b>{errors[0][0]}</b>{' '}<i>{errors[0][1]}</i>.
                                </Typography>
                            : null
                        )}
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

export default FPhieuCongKhaiThuoc;