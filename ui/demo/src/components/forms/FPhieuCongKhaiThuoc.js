import React from "react";
import { 
    Box, Button, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, TableSortLabel, Paper
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import UtilsTable from "../../utils/table";
// import mdSections from "../../constants/md_sections.json";
import { useSelector } from "react-redux";
// import { format } from "date-fns";
import "../../styles/index.css";
import { TablePagination } from "../common";

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
    // const { role } = useSelector(state => state.auth.user);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('stt');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const rows = content.data;

    const createSortHandler = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <>
            <Paper>
                <TableContainer>
                    <Table sx={{ '& .MuiTableCell-root': { fontSize: '16px' }, }}> 
                        <TableHead sx={{ '.MuiTableCell-root': { fontWeight: 'bold' }, '.MuiTableRow-root': { bgcolor: '#D9EFFE' } }}>
                            <TableRow>
                            {headCells.map((headCell, id) => (
                                <TableCell
                                    key={`${headCell.id}Head`}
                                    align="center"
                                    sortDirection={orderBy === headCell.id ? order : false}
                                    width={headCell.width}
                                    className={id < headCells.length - 1 ? "tableHeadBorderRight" : "" }
                                    colSpan={headCell.id === 'ngayThang' ? 5 : 0}
                                >
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? order : 'asc'}
                                        onClick={createSortHandler(headCell.id)}
                                    >
                                        {headCell.label}<br />{headCell.unit}
                                        {orderBy === headCell.id ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
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
                                        {Array.from(Array(5)).map((value, idx) => (
                                            <TableCell width="5%" key={`ngayThang${idx}`} className="tableBodyBorderRight">
                                                {idx < row.ngayThang.length ? row.ngayThang[idx] : ''}
                                            </TableCell>
                                        ))}
                                        <TableCell className="tableBodyBorderRight">{row.tongSo}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.donGia}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.thanhTien}</TableCell>
                                        <TableCell>{row.ghiChu}</TableCell>
                                    </TableRow>
                                );
                        })}
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

            {/* { mdSections.canEdit[role].includes(id) &&  */}
            <Box sx={{ width: '100%', textAlign: 'right', mt: 3 }}>
                <Button 
                    sx={{ 
                        width: 150,
                        height: 36,
                        background: '#48B0F7', 
                        textTransform: 'none', 
                        fontWeight: 'bold',
                        color: 'white',
                        '&:hover': {
                            background: '#48B0F7', 
                        }
                    }} 
                    startIcon={<Add fontSize="small"/>}
                    onClick={() => {}}
                >
                    Thêm mới
                </Button>
            </Box>
            {/* } */}
        </>
    )
}

export default FPhieuCongKhaiThuoc;