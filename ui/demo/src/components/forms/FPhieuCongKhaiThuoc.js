import React, { useState } from "react";
import { 
    Box, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, TableSortLabel, Paper, IconButton, Grid
} from "@mui/material";
import { Add, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import UtilsTable from "../../utils/table";
import { useSelector } from "react-redux";
import "../../styles/index.css";
import { TablePagination, Button } from "../common";
import { format } from "date-fns";

const headCells = [
    { id: 'stt', numeric: false, label: 'STT', width: '5%' },
    { id: 'tenThuoc', numeric: false, label: 'Tên thuốc, hàm lượng', width: '25%' },
    { id: 'donVi', numeric: false, label: 'Đơn vị', width: '5%' },
    { id: 'ngayThang', numeric: false, label: 'Ngày tháng', width: '25%' },
    { id: 'tongSo', numeric: true, label: 'Tổng số', width: '10%' },
    { id: 'donGia', numeric: true, label: 'Đơn giá', width: '10%' },
    { id: 'thanhTien', numeric: true, label: 'Thành tiền', width: '10%' },
    { id: 'ghiChu', numeric: false, label: 'Ghi chú', width: '10%' }
];

const FPhieuCongKhaiThuoc = () => {
    const content = useSelector((state) => state.HSBA.phieuCongKhaiThuoc);
    const { role } = useSelector(state => state.auth.user);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('stt');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dateGroup, setDateGroup] = useState(0);

    const rows = content.data;

    const createSortHandler = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const calculateTotal = (id) => {
        var total = 0;
        rows.forEach((row) => {
            if (id < row.ngayThang.length) {
                total = total + row.ngayThang[id];
            }    
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

    const singleDateGroup = [...content.ngayThang].reverse().findIndex((element) => element !== '') >= 5;

    return (
        <>
            <Paper>
                <TableContainer>
                    <Table sx={{ '& .MuiTableCell-root': { fontSize: '16px' }, }}> 
                        <TableHead sx={{ '.MuiTableCell-root': { fontWeight: 'bold' }, '.MuiTableRow-root': { bgcolor: '#D9EFFE' } }}>
                            <TableRow>
                            {headCells.map((headCell, id) => (
                                headCell.id !== 'ngayThang'
                                    ? (
                                        <TableCell
                                            key={`${headCell.id}Head`}
                                            align="center"
                                            sortDirection={orderBy === headCell.id ? order : false}
                                            width={headCell.width}
                                            rowSpan={2}
                                            className={id < headCells.length - 1 ? "tableHeadBorderRight" : "" }
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
                                                    <IconButton size="small" disabled={dateGroup === 1 || singleDateGroup} onClick={handleNextDateGroup}>
                                                        <KeyboardArrowRight/>
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                    ) 
                            ))}
                            </TableRow>
                            <TableRow>
                                {content.ngayThang.slice(dateGroup * 5, dateGroup * 5 + 5).map((nth, index) => (
                                    <TableCell 
                                        key={`ngayThang${index}`}
                                        align="center"
                                        className="tableHeadBorderRight"
                                        width="6%"
                                        sx={{ p: '6px 10px', height: 40 }}
                                    >
                                        {!!nth ? format(new Date(nth), 'dd/MM') : "__/__"}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <TableRow hover key={index}>
                                            <TableCell className="tableBodyBorderRight">{index + 1}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.tenThuoc}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.donVi}</TableCell>
                                            {row.ngayThang.slice(dateGroup * 5, dateGroup * 5 + 5).map((nth, idx) => (
                                                <TableCell width="6%" key={`nth${idx}`} className="tableBodyBorderRight">
                                                    {nth !== 0 ? nth : ""}
                                                </TableCell>
                                            ))}
                                            <TableCell className="tableBodyBorderRight">{row.tongSo}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.donGia}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.thanhTien}</TableCell>
                                            <TableCell>{row.ghiChu}</TableCell>
                                        </TableRow>
                                    );
                            })}

                            <TableRow hover>
                                <TableCell className="tableBodyBorderRight" colSpan={2}>Tổng số khoản thuốc dùng</TableCell>
                                <TableCell className="tableBodyBorderRight"/>
                                {Array.from(Array(5)).map((value, idx) => (
                                    <TableCell width="6%" key={`tongSo${idx}`} className="tableBodyBorderRight">
                                        {calculateTotal(dateGroup * 5 + idx)}
                                    </TableCell>
                                ))}
                                <TableCell className="tableBodyBorderRight"/>
                                <TableCell className="tableBodyBorderRight"/>
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

            { role === "BS" && 
                <Box sx={{ width: '100%', textAlign: 'right', mt: 2 }}>
                    <Button 
                        sx={{ width: 150 }} 
                        startIcon={<Add fontSize="small"/>}
                        onClick={() => {}}
                    >
                        Thêm mới
                    </Button>
                </Box>
            }
        </>
    )
}

export default FPhieuCongKhaiThuoc;