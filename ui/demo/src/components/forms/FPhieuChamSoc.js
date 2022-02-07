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
    Paper,
    TablePagination
} from "@mui/material";
import { Add } from "@mui/icons-material";
import React from "react";
import { visuallyHidden } from "@mui/utils";
import UtilsTable from "../../utils/table";
// import mdSections from "../../constants/md_sections.json";
import { useSelector } from "react-redux";
import { format } from "date-fns";

const headCells = [
    { id: 'ngay', numeric: false, label: 'Ngày', unit: '', width: '10%' },
    { id: 'gio', numeric: false, label: 'Giờ', unit: '', width: '10%' },
    { id: 'theoDoiDienBien', numeric: true, label: 'Theo dõi diễn biến', unit: '', width: '35%' },
    { id: 'thucHienYLenh', numeric: true, label: 'Thực hiện y lệnh', unit: '', width: '25%' },
    { id: 'dieuDuongGhi', numeric: true, label: 'Điều dưỡng ghi', unit: '', width: '20%' }
];

const FPhieuChamSoc = () => {
    const content = useSelector((state) => state.HSBA.phieuChamSoc);
    // const { role } = useSelector(state => state.auth.user);
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value === 'Tất cả' ? rows.length : event.target.value, 10));
        setPage(0);
    };
    

    return (
        <>
            <Paper>
                <TableContainer>
                    <Table sx={{ '& .MuiTableCell-root': { fontSize: '16px' } }}> 
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#D9EFFE'}}>
                            {headCells.map((headCell, id) => (
                                <TableCell
                                    key={id}
                                    align='left'
                                    sortDirection={orderBy === headCell.id ? order : false}
                                    width={headCell.width}
                                    sx={{ fontWeight: 'bold' }}
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
                                        <TableCell>{format(new Date(row.ngay), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell>{row.gio}</TableCell>
                                        <TableCell>{row.theoDoiDienBien}</TableCell>
                                        <TableCell>{row.thucHienYLenh}</TableCell>
                                        <TableCell>{row.dieuDuongGhi}</TableCell>
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

export default FPhieuChamSoc;