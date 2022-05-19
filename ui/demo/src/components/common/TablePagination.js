import React from "react";
import { TablePagination as MuiTablePagination } from "@mui/material";

const TablePagination = ({ length, page, setPage, rowsPerPage, setRowsPerPage, rowsPerPageOptions, ...other }) => {
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <MuiTablePagination
            rowsPerPageOptions={[...rowsPerPageOptions, { label: 'Tất cả', value: -1 }]}
            component="div"
            count={length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage='Hiển thị tối đa mỗi trang:'
            labelDisplayedRows={({ from, to, count }) => {
                return `${from}–${to} trong số ${count}`;
            }}
            sx={{ color: '#666666', '& p': { fontSize: '16px' } }}
            showFirstButton
            showLastButton
            {...other}
        />
    )
}

TablePagination.defaultProps = {
    rowsPerPageOptions: [10, 25, 50]
}

export default TablePagination;