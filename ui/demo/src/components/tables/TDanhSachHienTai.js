import React, { useState } from "react";
import { 
    Box, Avatar, TableContainer, TableCell, TableRow, TableSortLabel, TableBody, 
    TablePagination, Table, TableHead, TextField, InputAdornment, Link
} from "@mui/material";
import "../../styles/index.css";
import { Search } from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import UtilsTable from "../../utils/table";
import { format } from "date-fns";

const headCells = [
    { id: 'avatar', label: '', minWidth: 88 },
    { id: 'pid', label: 'Mã BN', minWidth: 120 },
    { id: 'hoTen', label: 'Họ tên', minWidth: 180 },
    { id: 'ngaySinh', label: 'Ngày sinh', minWidth: 140 },
    { id: 'gioiTinh', label: 'Giới tính', minWidth: 120 },
    { id: 'khoa', label: 'Khoa', minWidth: 120 },
    { id: 'phong', label: 'Phòng', minWidth: 120 },
    { id: 'giuong', label: 'Giường', minWidth: 120 },
    { id: 'benhDieuTri', label: 'Bệnh điều trị', minWidth: 200 },
    { id: 'tinhTrangHienTai', label: 'Tình trạng hiện tại', minWidth: 200 },
    { id: 'ngayVaoVien', label: 'Ngày vào viện', minWidth: 160 }
];

const TDanhSachHienTai = ({ data }) => {
    const [searchKeys, setSearchKeys] = useState(new Array(14).fill(''));
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('pid');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = useState(data);
    
    const requestSearch = (searchKey, index) => {
        const filteredRows = data.filter((row) => {
            var checkAll = true, keys = Object.keys(row);
            for (var i = 0; i < keys.length; i++) {
                if (i + 1 === index) {
                    checkAll = checkAll && row[keys[i]].toLowerCase().includes(searchKey.toLowerCase());
                } else {
                    checkAll = checkAll && row[keys[i]].toLowerCase().includes(searchKeys[i + 1].toLowerCase());
                }
            }
            return checkAll;
        });
        setRows(filteredRows);
        var tmp = [...searchKeys];
        tmp[index] = searchKey;
        setSearchKeys(tmp);
    }

    const createSortHandler = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value === 'Tất cả' ? rows.length : event.target.value, 10));
        setPage(0);
    };
    
    return (
        <>
            <TableContainer>
                <Table sx={{ '& .MuiTableCell-root': { fontSize: '16px' } }}> 
                    <TableHead>
                        <TableRow> 
                        {headCells.map((headCell, id) => (
                            <TableCell
                                key={id}
                                align='left'
                                sortDirection={orderBy === headCell.id ? order : false}
                                sx={{ fontWeight: 'bold', minWidth: headCell.minWidth }}
                            >
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                    sx={{ height: 56 }}
                                >
                                    {headCell.label}
                                    {orderBy === headCell.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                                {id > 0 &&
                                    <TextField 
                                        value={searchKeys[id]}
                                        onChange={(event) => requestSearch(event.target.value, id)}
                                        fullWidth
                                        size="small"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">
                                                <Search fontSize="small"/>
                                            </InputAdornment>,
                                            sx: { pl: 1, '& .MuiInputBase-input': { pr: 1 } }
                                        }}
                                    />
                                }
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
                                    <TableCell>
                                        <Avatar src="/images/avatar_default.png" sx={{ width: 56, height: 56 }} />
                                    </TableCell>
                                    <TableCell>{row.pid}</TableCell>
                                    <TableCell>
                                        <Link underline="none" href={`/user/HSBA/${row.pid}`}>{row.hoTen}</Link>
                                    </TableCell>
                                    <TableCell>{format(new Date(row.ngaySinh), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>{row.gioiTinh}</TableCell>
                                    <TableCell>{row.khoa}</TableCell>
                                    <TableCell>{row.phong}</TableCell>
                                    <TableCell>{row.giuong}</TableCell>
                                    <TableCell>{row.benhDieuTri}</TableCell>
                                    <TableCell>{row.tinhTrangHienTai}</TableCell>
                                    <TableCell>{format(new Date(row.ngayVaoVien), 'dd/MM/yyyy')}</TableCell>
                                </TableRow>
                            );
                    })}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 'Tất cả']}
                SelectProps={{ renderValue: value => (value === rows.length ? 'Tất cả' : value) }}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage='Hiển thị tối đa cho mỗi trang:'
                labelDisplayedRows={({ from, to, count }) => {
                    return `${from}–${to} trong số ${count}`;
                }}
                sx={{ color: '#666666', '& p': { fontSize: '16px' } }}
                showFirstButton
                showLastButton
            />
        </>
    )
}

export default TDanhSachHienTai;