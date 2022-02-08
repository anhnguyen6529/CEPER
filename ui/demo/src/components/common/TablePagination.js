import React from "react";
import { TablePagination as MuiTablePagination } from "@mui/material";

const TablePagination = ({ length, page, setPage, rowsPerPage, setRowsPerPage }) => {
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <MuiTablePagination
            rowsPerPageOptions={[10, 25, 50, { label: 'Tất cả', value: length }]}
            component="div"
            count={length}
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
    )
}

export default TablePagination;