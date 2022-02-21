import { 
    Box, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, TableSortLabel, Paper
} from "@mui/material";
import { Add } from "@mui/icons-material";
import React from "react";
import { visuallyHidden } from "@mui/utils";
import UtilsTable from "../../utils/table";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import "../../styles/index.css";
import { TablePagination, Button } from "../common";

const headCells = [
    { id: 'ngay', numeric: false, label: 'Ngày', width: '10%' },
    { id: 'gio', numeric: false, label: 'Giờ', width: '10%' },
    { id: 'theoDoiDienBien', numeric: true, label: 'Theo dõi diễn biến', width: '35%' },
    { id: 'thucHienYLenh', numeric: true, label: 'Thực hiện y lệnh', width: '25%' },
    { id: 'dieuDuongGhi', numeric: true, label: 'Điều dưỡng ghi', width: '20%' }
];

const FPhieuChamSoc = () => {
    const content = useSelector((state) => state.HSBA.phieuChamSoc);
    const { role } = useSelector(state => state.auth.user);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('ngay');
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
                    <Table sx={{ '& .MuiTableCell-root': { fontSize: '16px' } }}> 
                        <TableHead sx={{ '.MuiTableCell-root': { fontWeight: 'bold' }, '.MuiTableRow-root': { bgcolor: '#D9EFFE' } }}>
                            <TableRow>
                            {headCells.map((headCell, id) => (
                                <TableCell
                                    key={id}
                                    align='left'
                                    sortDirection={orderBy === headCell.id ? order : false}
                                    width={headCell.width}
                                    className={id < headCells.length - 1 ? "tableHeadBorderRight" : ""} 
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
                            ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow hover key={index}>
                                        <TableCell className="tableBodyBorderRight">{format(new Date(row.ngay), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.gio}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.theoDoiDienBien}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.thucHienYLenh}</TableCell>
                                        <TableCell>{row.dieuDuongGhi}</TableCell>
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

            { role === "DD" &&
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

export default FPhieuChamSoc;