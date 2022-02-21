import React, { Fragment } from "react";
import { 
    Box, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, TableSortLabel, Paper
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import UtilsTable from "../../utils/table";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import "../../styles/index.css";
import { TablePagination, Button } from "../common";

const headCells = [
    { id: 'ngayThang', numeric: false, label: 'Ngày tháng', width: '5%' },
    { id: 'tenDichTruyen', numeric: false, label: 'TÊN DỊCH TRUYỀN/HÀM LƯỢNG', width: '20%' },
    { id: 'soLuong', numeric: true, label: 'Số lượng', width: '5%' },
    { id: 'loSanXuat', numeric: false, label: 'Lô/Số sản xuất', width: '10%' },
    { id: 'tocDo', numeric: true, label: 'Tốc độ giọt/ph', width: '6%' },
    { id: 'thoiGianBatDau', numeric: false, label: 'Bắt đầu', width: '8%' },
    { id: 'thoiGianKetThuc', numeric: false, label: 'Kết thúc', width: '8%' },
    { id: 'BSChiDinh', numeric: false, label: 'Bác sĩ chỉ định', width: '19%' },
    { id: 'DDThucHien', numeric: false, label: 'Điều dưỡng thực hiện', width: '19%' }
];

const FPhieuTDTruyenDich = () => {
    const content = useSelector((state) => state.HSBA.phieuTDTruyenDich);
    const { role } = useSelector(state => state.auth.user);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('ngayThang');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const rows = content.data;

    const createSortHandler = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const CustomTableCell = ({ headCell, ...other }) => {    
        return (
            <TableCell
                align="center"
                sortDirection={orderBy === headCell.id ? order : false}
                width={headCell.width}
                {...other}
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
    }

    return (
        <>
            <Paper>
                <TableContainer>
                    <Table sx={{ '& .MuiTableCell-root': { fontSize: '16px' } }}> 
                        <TableHead sx={{ '.MuiTableCell-root': { fontWeight: 'bold' }, '.MuiTableRow-root': { bgcolor: '#D9EFFE' } }}>
                            <TableRow>
                                {headCells.map((headCell, id) => (
                                    id < 5 || id > 6 
                                    ?   <CustomTableCell 
                                            key={`${headCell.id}Head`}
                                            headCell={headCell}
                                            rowSpan={2}
                                            className={id < headCells.length - 1 ? "tableHeadBorderRight" : ""} 
                                        />
                                    : (id === 5 
                                        ?   <TableCell 
                                                className="tableHeadBorderRight" 
                                                sx={{ borderBottom: '1px solid rgb(200, 200, 224)' }}
                                                key="thoiGian" 
                                                align="center" 
                                                colSpan={2}
                                            >
                                                Thời gian
                                            </TableCell> 
                                        : null )
                                ))}
                            </TableRow>
                            <TableRow>
                                {headCells.slice(5, 7).map((headCell) => (
                                    <CustomTableCell className="tableHeadBorderRight" key={`${headCell.id}Head`} headCell={headCell} />                     
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {UtilsTable.stableSort(rows, UtilsTable.getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <Fragment key={index}>
                                    <TableRow hover>
                                        <TableCell className="tableBodyBorderRight" rowSpan={row.values.length + 1}>
                                            {format(new Date(row.ngayThang), 'dd/MM')}
                                        </TableCell>
                                    </TableRow>
                                        {row.values.map((value, idx) => (
                                            <TableRow hover key={idx}>
                                                {headCells.slice(1).map((headCell, id) => (
                                                    <TableCell className={id < headCells.length -2 ? "tableBodyBorderRight" : ""} key={headCell.id}>
                                                        {value[headCell.id]}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </Fragment>
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

export default FPhieuTDTruyenDich;