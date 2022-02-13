import React, { useState } from "react";
import { 
    Box, Avatar, TableContainer, TableCell, TableRow, TableSortLabel, TableBody, 
    Table, TableHead, TextField, InputAdornment, Link
} from "@mui/material";
import "../../styles/index.css";
import { Search } from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import UtilsTable from "../../utils/table";
import { format } from "date-fns";
import { TablePagination, TableToolBar } from "../common";

const headCells = [
    { id: 'avatar', label: 'Ảnh đại diện', width: 88 },
    { id: 'pid', label: 'Mã BN', width: 120 },
    { id: 'hoTen', label: 'Họ tên', width: 180 },
    { id: 'ngaySinh', label: 'Ngày sinh', width: 140 },
    { id: 'gioiTinh', label: 'Giới tính', width: 120 },
    { id: 'khoa', label: 'Khoa', width: 120 },
    { id: 'phong', label: 'Phòng', width: 120 },
    { id: 'giuong', label: 'Giường', width: 120 },
    { id: 'benhDieuTri', label: 'Bệnh điều trị', width: 200 },
    { id: 'tinhTrangHienTai', label: 'Tình trạng hiện tại', width: 200 },
    { id: 'ngayVaoVien', label: 'Ngày vào viện', width: 160 }
];

const TDanhSachHienTai = ({ data }) => {
    const [searchKeys, setSearchKeys] = useState(headCells.map(headCell => {
        let rHeadCell = { id: headCell.id, search: '' };
        return rHeadCell;
    }));
    const [colsChecked, setColsChecked] = useState(new Array(headCells.length).fill(true));
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('pid');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = useState(data);
    
    const requestSearch = (searchKey, cellId) => {
        let fIndex = searchKeys.findIndex(element => element.id === cellId);
        const filteredRows = data.filter((row) => {
            var checkAll = true, keys = Object.keys(row);
            keys.forEach(key => {
                if (key === cellId) {
                    checkAll = checkAll && row[key].toLowerCase().includes(searchKey.toLowerCase());
                } else {
                    var fKey = searchKeys.find(element => element.id === key);
                    checkAll = checkAll & row[key].toLowerCase().includes(fKey.search.toLowerCase());
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
            <TableToolBar 
                columns={headCells.map(headCell => {
                    let rHeadCell = { id: headCell.id, label: headCell.label };
                    return rHeadCell;
                })} 
                colsChecked={colsChecked}
                setColsChecked={setColsChecked}
            />

            <TableContainer>
                <Table sx={{ '& .MuiTableCell-root': { fontSize: '16px' } }}> 
                    <TableHead>
                        <TableRow sx={{ height: 135.5 }}> 
                        {colsChecked.every((element) => element === false) && 
                            <TableCell width="100%"></TableCell>
                        }

                        {headCells.map((headCell, id) => (
                            colsChecked[id] &&
                            <TableCell
                                key={id}
                                align='left'
                                sortDirection={orderBy === headCell.id ? order : false}
                                sx={{ fontWeight: 'bold', minWidth: headCell.width, width: headCell.width }}
                            >
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                    sx={{ height: 56 }}
                                >
                                    {headCell.id !== "avatar" ? headCell.label : ""}
                                    {orderBy === headCell.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
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
                    {UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                            return (
                                <TableRow hover key={index} sx={{ height: 90 }}>
                                    {colsChecked[0] && 
                                        <TableCell>
                                            <Avatar src="/images/avatar_default.png" sx={{ width: 56, height: 56 }} />
                                        </TableCell>
                                    }
                                    {colsChecked[1] && <TableCell>{row.pid}</TableCell>}
                                    {colsChecked[2] && 
                                        <TableCell>
                                            <Link underline="none" href={`/user/HSBA/${row.pid}`}>{row.hoTen}</Link>
                                        </TableCell>
                                    }
                                    {colsChecked[3] && <TableCell>{format(new Date(row.ngaySinh), 'dd/MM/yyyy')}</TableCell>}
                                    {colsChecked[4] && <TableCell>{row.gioiTinh}</TableCell>}
                                    {colsChecked[5] && <TableCell>{row.khoa}</TableCell>}
                                    {colsChecked[6] && <TableCell>{row.phong}</TableCell>}
                                    {colsChecked[7] && <TableCell>{row.giuong}</TableCell>}
                                    {colsChecked[8] && <TableCell>{row.benhDieuTri}</TableCell>}
                                    {colsChecked[9] && <TableCell>{row.tinhTrangHienTai}</TableCell>}
                                    {colsChecked[10] && <TableCell>{format(new Date(row.ngayVaoVien), 'dd/MM/yyyy')}</TableCell>}
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
        </>
    )
}

export default TDanhSachHienTai;