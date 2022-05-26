import React, { useEffect, useState } from "react";
import { 
    Box, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, Paper, Grid, Typography, TextField, Tooltip, Card, CardHeader, CardContent, CircularProgress
} from "@mui/material";
import { Add, ArrowLeft, ArrowRight, CancelOutlined } from "@mui/icons-material";
import { UtilsTable, UtilsText } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import { TablePagination, Button, StyledTableRow, SelectThuoc } from "../common";
import { format } from "date-fns";
import drugList from "../../constants/drug_list.json";
import { DatePicker } from "@mui/lab";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import SpellingErrorThunk from "../../redux/thunks/spellingError.thunk";
import { BoxLoiChinhTa } from "../boxes";
import moment from "moment";

const SECTION_NAME = "Phiếu công khai thuốc";
const SECTION_FIELD = "phieuCongKhaiThuoc";

const headCells = [
    { id: 'stt', label: 'STT', unit: '', width: '5%', minWidth: 65 },
    { id: 'tenThuoc', label: 'TÊN THUỐC, HÀM LƯỢNG', unit: '', width: '22%', minWidth: 225 },
    { id: 'donVi', label: 'Đơn vị', unit: '', width: '5%', minWidth: 65 },
    { id: 'ngayThang', label: 'Ngày tháng', unit: '', width: '25%', minWidth: 0 },
    { id: 'tongSo', label: 'Tổng số', unit: '', width: '7%', minWidth: 80 },
    { id: 'donGia', label: 'Đơn giá', unit: 'đồng', width: '9%', minWidth: 95 },
    { id: 'thanhTien', label: 'Thành tiền', unit: 'đồng', width: '12%', minWidth: 120 },
    { id: 'ghiChu', label: 'Ghi chú', unit: '', width: '15%', minWidth: 150 }
];

const FPhieuCongKhaiThuoc = () => {
    const content = useSelector((state) => state.HSBA.phieuCongKhaiThuoc);
    const { ngayRaVien } = useSelector((state) => state.HSBA.chanDoanKhiRaVien);
    const { loadingError } = useSelector((state) => state.spellingError);
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const { updating, confirmUpdate } = useSelector((state) => state.HSBA);
    const { role } = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [ngayThang, setNgayThang] = useState(content.ngayThang);
    const [rows, setRows] = useState(content.data);
    const [maxLastRows, setMaxLastRows] = useState(role === "DD" && !ngayRaVien ? 1 : 3);
    const [expandAllRows, setExpandAllRows] = useState(false);

    const [newNgay, setNewNgay] = useState({ ngay: null, soLuong: new Array(rows.length).fill(0) });
    const EMPTY_NEW_DATA = { tenThuoc: null, donVi: '', soLuong: 0, donGia: 0, ghiChu: '' };
    const [newDataList, setNewDataList] = useState([EMPTY_NEW_DATA]);
    const [errors, setErrors] = useState([]);
    const [hasChanged, setHasChanged] = useState(false);

    const [text, setText] = useState([]);
    const [result, setResult] = useState([]);
    const [replaced, setReplaced] = useState([]);
    const [useResult, setUseResult] = useState([]);

    useEffect(() => {
        if (updating) {
            rows.slice(content.data.length).forEach((row) => {
                if (!loadingError) {
                    dispatch(SpellingErrorThunk.getProcessResult({ 
                        section: SECTION_NAME, subSection: row.tenThuoc, text: row.ghiChu 
                    }));
                }
            });
        }
        // eslint-disable-next-line
    }, [updating]);

    useEffect(() => {
        if (confirmUpdate) {
            var tRows = [...rows];
            tRows.slice(content.data.length).forEach((row, id) => {
                row.ghiChu = useResult[id] 
                    ? UtilsText.replaceMaskWord(spellingError[row.tenThuoc].detection, replaced[id])
                    : text[id];
            });
            dispatch(HSBAActions.updateAttachedSection({ 
                section: SECTION_FIELD, 
                value: { ngayThang }, 
                newData: tRows 
            }));
        }
        // eslint-disable-next-line
    }, [confirmUpdate]);

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
                    thanhTien: parseInt(newData.donGia) * parseInt(newData.soLuong),
                    ghiChu: newData.ghiChu
                }));
            }
            const tRows = [...rows];
            newNgay.soLuong.forEach((sl, id) => {
                tRows[id] = { 
                    ...tRows[id], 
                    ngayThang: [...new Array(newNgayThang.length - 1).fill(0), sl].map((nth, i) => i < tRows[id].ngayThang.length ? nth + tRows[id].ngayThang[i] : nth),
                    tongSo: parseInt(sl) + parseInt(tRows[id].tongSo),
                    thanhTien: parseInt(sl) * parseInt(tRows[id].donGia) + parseInt(tRows[id].thanhTien)
                };
            });
            setNgayThang(newNgayThang);
            setRows([...tRows, ...newRow]);
            setText([...text, ...newDataList.map(newData => newData.ghiChu)]);
            setResult([...result, ...new Array(newDataList.length).fill("")]);
            setReplaced([...replaced, ...new Array(newDataList.length).fill([])]);
            setUseResult([...useResult, ...new Array(newDataList.length).fill(true)]);

            clearData(tRows.length + newRow.length);
            dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true, newKeys: newRow.map(row => row.tenThuoc) }));
            setHasChanged(false);
        } else {
            let errs = [], dateErrs = [], drugErrs = [];
            if (!newNgay.ngay) {
                dateErrs.push('Ngày tháng');
                drugErrs.push('Ngày tháng');
            }
            if (newDataList.length === 1) {
                if (!newDataList[0].tenThuoc && newDataList[0].soLuong === 0 && !newDataList[0].ghiChu && newNgay.soLuong.every(sl => sl === 0)) {
                    dateErrs.push('Số lượng thuốc dùng (cột đã có)');
                }
                if (!newDataList[0].tenThuoc) drugErrs.push('TÊN THUỐC, HÀM LƯỢNG');
                if (newDataList[0].soLuong === 0) drugErrs.push('Số lượng thuốc dùng (hàng mới)');
            } else if (newDataList.length > 1) {
                newDataList.forEach((newData) => {
                    if (!newData.tenThuoc && drugErrs.findIndex(err => err === 'TÊN THUỐC, HÀM LƯỢNG') === -1) drugErrs.push('TÊN THUỐC, HÀM LƯỢNG');
                    if (newData.soLuong === 0 && drugErrs.findIndex(err => err === 'Số lượng thuốc dùng (hàng mới)') === -1) drugErrs.push('Số lượng thuốc dùng (hàng mới)');
                });
            }
            if (dateErrs.length > 0) errs.push([dateErrs.join('; '), "- nếu muốn thêm thông tin thuốc đã có"]);
            if (drugErrs.length > 0) errs.push([drugErrs.join('; '), "- nếu muốn thêm thông tin thuốc mới"]);
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
            total = total + parseInt(row.thanhTien);
        });
        return total === 0 ? '' : total;
    };

    const handleAddClick = () => {
        setNewDataList([...newDataList, EMPTY_NEW_DATA]);
        if (!hasChanged) {
            setHasChanged(true);
        }
    }

    useEffect(() => {
        const tResult = [...result], tReplaced = [...replaced], tRows = [...rows];
        rows.slice(content.data.length).forEach((row, id) => {
            if (typeof (spellingError[row.tenThuoc]) !== "undefined") {    
                if (!spellingError[row.tenThuoc].loading && !spellingError[row.tenThuoc].error) {
                    tResult[id] = spellingError[row.tenThuoc];
                    tReplaced[id] = spellingError[row.tenThuoc].correction.map(res => ({ type: "correct", repText: res[1] }));
                    if (spellingError[row.tenThuoc].correction.length === 0) {
                        tRows[content.data.length + id] = { ...tRows[content.data.length + id], ghiChu: spellingError[row.tenThuoc].detection }; 
                    }
                } else if (spellingError[row.tenThuoc].loading) {
                    tResult[id] = ""; 
                    tReplaced[id] = []; 
                }
            }
        });
        setResult(tResult); setReplaced(tReplaced); setRows(tRows);
        // eslint-disable-next-line
    }, [spellingError.loading]);

    return (
        <>
            <Paper>
                <TableContainer>
                    <Table stickyHeader> 
                        <TableHead sx={{ '.MuiTableCell-root': { bgcolor: (theme) => theme.palette.primary.light } }}>
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
                                                {!!headCell.unit 
                                                    ? <Typography fontWeight="bold">({<i>{headCell.unit}</i>})</Typography> : ""}
                                            </TableCell>
                                        )
                                        : (
                                            <TableCell
                                                key={`${headCell.id}Head`} 
                                                align="center" 
                                                colSpan={ngayThang.length <= maxLastRows || expandAllRows 
                                                    ? (expandAllRows 
                                                        ? (role === "DD" && !ngayRaVien && !updating ? (ngayThang.length + 1) + 1 : ngayThang.length + 1)
                                                        : (role === "DD" && !ngayRaVien && !updating ? ngayThang.length + 1 : ngayThang.length)
                                                    ) : (role === "DD" && !ngayRaVien && !updating ? (1 + maxLastRows) + 1 : 1 + maxLastRows)
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
                                {ngayThang.length <= maxLastRows || expandAllRows 
                                    ? (
                                        <>
                                            {ngayThang.map((nth, index) => (
                                                <TableCell 
                                                    key={`ngayThang${index}`}
                                                    align="center"
                                                    className="tableHeadBorderRight"
                                                    sx={{ p: '6px 10px', minWidth: 95, zIndex: 0, cursor: expandAllRows && index > 0 ? 'pointer' : 'default' }}
                                                    onClick={() => {
                                                        if (index > 0) {
                                                            setMaxLastRows(ngayThang.length - index);
                                                            setExpandAllRows(false);
                                                        }
                                                    }}
                                                >
                                                    {format(new Date(nth), "dd/MM/yyyy")}
                                                </TableCell>
                                            ))}
                                            {expandAllRows && 
                                                <TableCell 
                                                    className="tableHeadBorderRight" 
                                                    align="center" 
                                                    sx={{ cursor: 'pointer', p: 0, zIndex: 0 }}
                                                    onClick={() => {
                                                        setMaxLastRows(0);
                                                        setExpandAllRows(false);
                                                    }}
                                                >
                                                    <Tooltip title="Ẩn tất cả ngày" placement="top">
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
                                            {ngayThang.slice(ngayThang.length - maxLastRows).map((nth, index) => (
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
                                
                                {(role === "DD" && !ngayRaVien && !updating) ? 
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
                                            renderInput={(params) => <TextField fullWidth {...params} sx={{ '.MuiOutlinedInput-root': { bgcolor: "white" } }} inputProps={{ ...params.inputProps, 'aria-label': 'input ngay' }} />}
                                            minDate={moment(new Date(ngayThang[ngayThang.length - 1]))}
                                            OpenPickerButtonProps={{ size: "small", sx: { px: 0, '.MuiSvgIcon-root': { fontSize: 20 } } }}
                                        />
                                    </TableCell>
                                : null}
                            </TableRow>
                        </TableHead>
                        
                        <TableBody>                     
                            {rows.length === 0 && (role !== "DD" || updating) ? (
                                <StyledTableRow>
                                    <TableCell colSpan={headCells.length} align="center">(<i>trống</i>)</TableCell>
                                </StyledTableRow>
                            ) : (rowsPerPage > 0
                                ? UtilsTable.stableSort(rows, UtilsTable.getComparator("asc", "stt")).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : UtilsTable.stableSort(rows, UtilsTable.getComparator("asc", "stt"))
                            ).map((row, index) => {
                                return (
                                    <StyledTableRow hover key={index}>
                                        <TableCell className="tableBodyBorderRight" align="center">{index + 1}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.tenThuoc}</TableCell>
                                        <TableCell className="tableBodyBorderRight" align="center">{row.donVi}</TableCell>
                                        {ngayThang.length <= maxLastRows || expandAllRows ? (
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
                                                {row.ngayThang.slice(row.ngayThang.length - maxLastRows).map((nth, idx) => (
                                                    <TableCell key={`nth${idx}`} className="tableBodyBorderRight" align="center">
                                                        {nth !== 0 ? nth : ""}
                                                    </TableCell>
                                                ))}
                                            </>
                                        )}

                                        {(role === "DD" && !ngayRaVien && !updating) ? 
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
                                                    inputProps={{ 'aria-label': 'input so luong' }}
                                                />
                                            </TableCell>
                                        : null}
                                        <TableCell className="tableBodyBorderRight" align="center">{row.tongSo}</TableCell>
                                        <TableCell className="tableBodyBorderRight" align="center">{parseInt(row.donGia).toLocaleString()}</TableCell>
                                        <TableCell className="tableBodyBorderRight" align="center">{parseInt(row.thanhTien).toLocaleString()}</TableCell>
                                        <TableCell>{row.ghiChu}</TableCell>
                                    </StyledTableRow>
                                );
                            })}

                            {(role === "DD" && !ngayRaVien && !updating) ? 
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
                                        {ngayThang.length <= maxLastRows || expandAllRows ? (
                                            expandAllRows 
                                                ? Array.from(Array(ngayThang.length + 1)).map((_, id) => (<TableCell key={id} className="tableBodyBorderRight" />))
                                                : Array.from(Array(ngayThang.length)).map((_, id) => (<TableCell key={id} className="tableBodyBorderRight" />))
                                        ) : (
                                            <>
                                                <TableCell className="tableBodyBorderRight" />
                                                {ngayThang.slice(ngayThang.length - maxLastRows).map((_, id) => (
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
                                                inputProps={{ 'aria-label': 'input so luong' }}
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
                                                inputProps={{ 'aria-label': 'input ghi chu' }}
                                            />  
                                        </TableCell>
                                    </TableRow>
                                ))
                            : null}
                            
                            {rows.length > 0 ? 
                                <TableRow>
                                    <TableCell className="tableBodyBorderRight" colSpan={2}>Tổng số khoản thuốc dùng</TableCell>
                                    <TableCell className="tableBodyBorderRight" />
                                    {ngayThang.length <= maxLastRows || expandAllRows ? (
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
                                            {ngayThang.slice(ngayThang.length - maxLastRows).map((_, idx) => (
                                                <TableCell key={`tongSo${idx}`} className="tableBodyBorderRight" align="center">
                                                    {calculateTotalByDate(ngayThang.length - maxLastRows + idx)}
                                                </TableCell>
                                            ))}
                                        </>
                                    )}
                                    {(role === "DD" && !ngayRaVien && !updating) ? <TableCell className="tableBodyBorderRight" /> : null}
                                    <TableCell className="tableBodyBorderRight" />
                                    <TableCell className="tableBodyBorderRight" />
                                    <TableCell className="tableBodyBorderRight" align="center">
                                        {calculateTotalIntoMoney().toLocaleString()}
                                    </TableCell>
                                    <TableCell />
                                </TableRow>
                            : null}
                        </TableBody> 
                    </Table>
                </TableContainer>

                <TablePagination 
                    id={`${SECTION_NAME}/SE`}
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

            {updating && Object.keys(spellingError).some(subKey => !["changed", "loading"].includes(subKey) 
            && spellingError[subKey].correction.length > 0) ? 
                <Card sx={{ mt: 2 }}>
                    <CardHeader 
                        title={`${SECTION_NAME} (Ghi chú) - Xử lý lỗi`} 
                        titleTypographyProps={{ fontWeight: "bold", color: "primary.dark" }} 
                    />
                    <CardContent sx={{ py: 0 }}>
                        {rows.slice(content.data.length).map((row, index) => (
                            spellingError[row.tenThuoc].correction.length > 0 ?
                                <Card key={index} sx={{ mb: 2 }}>
                                    <CardHeader 
                                        title={`TÊN THUỐC, HÀM LƯỢNG: ${row.tenThuoc}`} 
                                        sx={{ bgcolor: "primary.light" }} 
                                        titleTypographyProps={{ fontWeight: "bold" }} 
                                    />
                                    <CardContent>
                                        <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography>
                                        <TextField 
                                            fullWidth
                                            multiline
                                            margin="dense"
                                            value={text[index]}
                                            onChange={({ target: { value } }) => {
                                                const tText = [...text];
                                                tText[index] = value;
                                                setText(tText);
                                            }}
                                            disabled={useResult[index]}
                                            inputProps={{ 'aria-label': 'original text' }}
                                        />

                                        {!!result[index] && !spellingError[row.tenThuoc].loading ? 
                                            <BoxLoiChinhTa
                                                result={result[index]}
                                                replaced={replaced[index]}
                                                setReplaced={(newReplaced) => {
                                                    const tReplaced = [...replaced];
                                                    tReplaced[index] = newReplaced;
                                                    setReplaced(tReplaced);
                                                }}
                                                useResult={useResult[index]}
                                                handleChangeCheckbox={(checked) => {
                                                    const tUseResult = [...useResult];
                                                    tUseResult[index] = checked;
                                                    setUseResult(tUseResult);
                                                    if (checked) {
                                                        dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: row.tenThuoc }));
                                                        dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: row.tenThuoc, text: text[index] }));
                                                    }
                                                }}
                                                handleUpdateSection={(newReplaced) => {}}
                                            />
                                        : ( 
                                            <div className="df fdc aic jcc">
                                                <CircularProgress size={20} sx={{ mt: 2, mb: 1, color: (theme) => theme.palette.primary.main }} />
                                                <Typography color="primary">Đang xử lý...</Typography>
                                            </div> 
                                        )}
                                    </CardContent>
                                </Card>
                            : null
                        ))}
                    </CardContent>
                </Card>
            : null}
        </>
    )
}

export default FPhieuCongKhaiThuoc;