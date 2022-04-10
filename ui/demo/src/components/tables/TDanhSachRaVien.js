import React, { useState, useEffect, useContext } from "react";
import { 
    Box, Avatar, TableContainer, TableCell, TableRow, TableSortLabel, TableBody, 
    Table, TableHead, TextField, InputAdornment
} from "@mui/material";
import "../../styles/index.css";
import { Search } from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import { UtilsTable } from "../../utils";
import { format } from "date-fns";
import { TablePagination, StyledTableRow } from "../common";
import UserContext from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const headCells = [
    { id: 'avatar', label: 'Ảnh đại diện', width: 88, show: true },
    { id: 'pid', label: 'Mã BN', width: 120, show: true },
    { id: 'hoTen', label: 'Họ tên', width: 180, show: true },
    { id: 'tuoi', label: 'Tuổi', width: 140, show: false },
    { id: 'gioiTinh', label: 'Giới tính', width: 120, show: false },
    { id: 'khoa', label: 'Khoa', width: 120, show: false },
    { id: 'ngayVaoVien', label: 'Ngày vào viện', width: 160, show: true },
    { id: 'ngayRaVien', label: 'Ngày ra viện', width: 160, show: true },
    { id: 'chanDoanKhiRaVien', label: 'Chẩn đoán khi ra viện', width: 220, show: true },
    { id: 'tinhTrangRaVien', label: 'Tình trạng ra viện', width: 190, show: true }
];

const TDanhSachRaVien = ({ data }) => {
    const navigate = useNavigate();
    const { danhSachHSBATab, setDanhSachHSBATab } = useContext(UserContext);
    useEffect(() => {
        setDanhSachHSBATab({
            ...danhSachHSBATab,
            raVienCols: headCells.map(hc => hc.label),
            raVienColsChecked: headCells.map(hc => hc.show)
        })
        // eslint-disable-next-line
    }, []);

    const [searchKeys, setSearchKeys] = useState(headCells.map(headCell => {
        let rHeadCell = { id: headCell.id, search: '' };
        return rHeadCell;
    }));
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('pid');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rows, setRows] = useState(data);

    const requestSearch = (searchKey, cellId) => {
        let fIndex = searchKeys.findIndex(element => element.id === cellId);
        const filteredRows = data.filter((row) => {
            var checkAll = true, keys = Object.keys(row);
            keys.forEach(key => {
                if (key === cellId) {
                    checkAll = checkAll && String(row[key]).toLowerCase().includes(searchKey.toLowerCase());
                } else {
                    var fKey = searchKeys.find(element => element.id === key);
                    if (typeof fKey !== "undefined") {
                        checkAll = checkAll & String(row[key]).toLowerCase().includes(fKey.search.toLowerCase());
                    }
                }
            })
            return checkAll;
        });
        setRows(filteredRows);
        var tmp = [...searchKeys];
        tmp[fIndex].search = searchKey;
        setSearchKeys(tmp);
    }

    const createSortHandler = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <>
            <TableContainer sx={{ maxHeight: 430 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow sx={{ height: 120, '& .MuiTableCell-root': { py: 2, bgcolor: 'white' } }}> 
                            {danhSachHSBATab.raVienColsChecked.every((element) => element === false) && 
                                <TableCell width="100%"></TableCell>
                            }

                            {headCells.map((headCell, id) => (
                                danhSachHSBATab.raVienColsChecked[id] &&
                                <TableCell
                                    key={id}
                                    align='left'
                                    sortDirection={orderBy === headCell.id ? order : false}
                                    sx={{ fontWeight: 'bold', width: headCell.width, minWidth: headCell.width }}
                                >
                                    {headCell.id !== "avatar" &&
                                        <TableSortLabel
                                            active={orderBy === headCell.id}
                                            direction={orderBy === headCell.id ? order : 'asc'}
                                            onClick={createSortHandler(headCell.id)}
                                            sx={{ pb: 1 }}
                                        >
                                            {headCell.label}
                                            {orderBy === headCell.id ? (
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            ) : null}
                                        </TableSortLabel>
                                    }
                                    {id > 0 &&
                                        <TextField 
                                            value={searchKeys[id].search}
                                            onChange={(event) => requestSearch(event.target.value, headCell.id)}
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
                        {rows.length === 0 ? (
                            <StyledTableRow>
                                <TableCell colSpan={danhSachHSBATab.raVienColsChecked.filter(checked => checked).length} align="center">
                                    (<i>trống</i>)
                                </TableCell>
                            </StyledTableRow>
                        ) : (rowsPerPage > 0
                            ? UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy))
                        ).map((row, index) => {
                            return (
                                <StyledTableRow hover key={index} sx={{ height: 90, cursor: 'pointer' }} onClick={() => navigate(`/user/HSBA/${row.pid}`)}>
                                    {danhSachHSBATab.raVienColsChecked[0] && 
                                        <TableCell>
                                            <Avatar src="/images/avatar_default.png" sx={{ width: 56, height: 56 }} />
                                        </TableCell>
                                    }
                                    {danhSachHSBATab.raVienColsChecked[1] && <TableCell>{row.pid}</TableCell>}
                                    {danhSachHSBATab.raVienColsChecked[2] && <TableCell>{row.hoTen}</TableCell>}  
                                    {danhSachHSBATab.raVienColsChecked[3] && <TableCell>{row.tuoi}</TableCell>}
                                    {danhSachHSBATab.raVienColsChecked[4] && <TableCell>{row.gioiTinh}</TableCell>}
                                    {danhSachHSBATab.raVienColsChecked[5] && <TableCell>{row.khoa}</TableCell>}
                                    {danhSachHSBATab.raVienColsChecked[6] && <TableCell>{format(new Date(row.ngayVaoVien), 'dd/MM/yyyy')}</TableCell>}
                                    {danhSachHSBATab.raVienColsChecked[7] && <TableCell>{format(new Date(row.ngayRaVien), 'dd/MM/yyyy')}</TableCell>}
                                    {danhSachHSBATab.raVienColsChecked[8] && <TableCell>{row.chanDoanKhiRaVien}</TableCell>}
                                    {danhSachHSBATab.raVienColsChecked[9] && <TableCell>{row.tinhTrangRaVien}</TableCell>}
                                </StyledTableRow>
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
        </>
    )
}

export default TDanhSachRaVien;