import { 
    Box, 
    Button,
    Table,
    TableRow,
    TableContainer,
    TableBody,
    TableHead,
    TableCell,
    TableSortLabel,
    Paper
} from "@mui/material";
import { Add } from "@mui/icons-material";
import React from "react";
import { visuallyHidden } from "@mui/utils";
import UtilsTable from "../../utils/table";
// import mdSections from "../../constants/md_sections.json";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import "../../styles/index.css";
import { TablePagination } from "../common";

const headCells = [
    { id: 'ngayGio', numeric: false, label: 'Ngày giờ', unit: '', width: '18%' },
    { id: 'mach', numeric: true, label: 'Mạch', unit: '(lần/phút)', width: '12%' },
    { id: 'nhietDo', numeric: true, label: 'Nhiệt độ', unit: '(°C)', width: '12%' },
    { id: 'huyetAp', numeric: true, label: 'Huyết áp', unit: '(mmHg)', width: '12%' },
    { id: 'nhipTho', numeric: true, label: 'Nhịp thở', unit: '(lần/phút)', width: '12%' },
    { id: 'canNang', numeric: true, label: 'Cân nặng', unit: '(kg)', width: '14%' },
    { id: 'dieuDuongGhi', numeric: false, label: 'Điều dưỡng ghi', unit: '', width: '20%' }
];

const FPhieuTDChucNangSong = () => {
    const content = useSelector((state) => state.HSBA.phieuTDChucNangSong);
    // const { role } = useSelector(state => state.auth.user);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('ngayGio');
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
                                        <TableCell className="tableBodyBorderRight">{format(new Date(row.ngayGio), 'dd/MM/yyyy, HH:mm')}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.mach}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.nhietDo}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.huyetAp}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.nhipTho}</TableCell>
                                        <TableCell className="tableBodyBorderRight">{row.canNang}</TableCell>
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

export default FPhieuTDChucNangSong;