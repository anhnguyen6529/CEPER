import { 
    Box, Table, TableRow, TableContainer, TableBody,
    TableHead, TableCell, TableSortLabel, Paper, TextField, Grid, Typography
} from "@mui/material";
import { Add, Close, Save } from "@mui/icons-material";
import React, { useState, useContext } from "react";
import { visuallyHidden } from "@mui/utils";
import UtilsTable from "../../utils/table";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import "../../styles/index.css";
import { TablePagination, Button } from "../common";
import DateTimePicker from "@mui/lab/DateTimePicker";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import HSBAContext from "../../contexts/HSBAContext";

const headCells = [
    { id: 'ngayGio', numeric: false, label: 'Ngày giờ', width: '20%' },
    { id: 'dienBienBenh', numeric: true, label: 'Diễn biến bệnh', width: '35%' },
    { id: 'yLenh', numeric: true, label: 'Y lệnh', width: '25%' },
    { id: 'bacSiGhi', numeric: false, label: 'Bác sĩ ghi', width: '20%' },
];

const FToDieuTri = () => {
    const content = useSelector((state) => state.HSBA.toDieuTri);
    const { role, name } = useSelector(state => state.auth.user);
    const { tabsDinhKemState, setTabsDinhKemState } = useContext(HSBAContext);
    const dispatch = useDispatch();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('ngayGio');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [addNew, setAddNew] = useState(false);
    const [newNgayGio, setNewNgayGio] = useState(null);
    const [newDienBienBenh, setNewDienBienBenh] = useState('');
    const [newYLenh, setNewYLenh] = useState('');
    const [errors, setErrors] = useState([]);

    const rows = content.data;

    const createSortHandler = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };   

    const clearData = () => {
        setNewNgayGio(null);
        setNewDienBienBenh('');
        setNewYLenh('');
        setAddNew(false);
        setErrors([]);
    }

    const handleCancel = () => {
        clearData();
    };

    const handleSave = () => {
        if (!!newNgayGio && !!newDienBienBenh && !!newYLenh) {
            dispatch(HSBAActions.updateDinhKemSection({
                section: 'toDieuTri',
                value: {},
                newData: { ngayGio: newNgayGio.toISOString(), dienBienBenh: newDienBienBenh, yLenh: newYLenh, bacSiGhi: name }
            }));
            setTabsDinhKemState({
                ...tabsDinhKemState, 
                toDieuTri: { saved: true, date: new Date() }
            });
            clearData();
        } else {
            let errs = [];
            if (!newNgayGio) errs.push('ngày giờ');
            if (!newDienBienBenh) errs.push('diễn biến bệnh');
            if (!newYLenh) errs.push('y lệnh');
            setErrors(errs);
        }
    };

    return (
        <>
            {tabsDinhKemState.toDieuTri.saved && 
                <Box sx={{ width: '100%', textAlign: 'right', mb: 1 }}>
                    <Typography color="primary">
                        <i>Đã chỉnh sửa: {format(new Date(tabsDinhKemState.toDieuTri.date), 'dd/MM/yyyy HH:mm:ss')}</i>
                    </Typography>
                </Box>
            }

            <Paper>
                <TableContainer sx={{ maxHeight: 500 }}>
                    <Table stickyHeader> 
                        <TableHead sx={{ '.MuiTableCell-root': { bgcolor: '#D9EFFE' } }}>
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
                                            <TableCell className="tableBodyBorderRight">{format(new Date(row.ngayGio), 'dd/MM/yyyy, HH:mm')}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.dienBienBenh}</TableCell>
                                            <TableCell className="tableBodyBorderRight">{row.yLenh}</TableCell>
                                            <TableCell>{row.bacSiGhi}</TableCell>
                                        </TableRow>
                                    );
                            })}

                            {addNew && 
                                <TableRow sx={{ position: 'sticky', bottom: 0, bgcolor: 'white', '.MuiTableCell-root': { borderTop: '0.5px solid rgba(224, 224, 224, 1)' } }}>
                                    <TableCell className="tableBodyBorderRight">
                                        <DateTimePicker
                                            value={newNgayGio}
                                            onChange={(newValue) => setNewNgayGio(newValue)}
                                            renderInput={(params) => <TextField {...params}/>}
                                            inputFormat="DD/MM/yyyy HH:mm"
                                            ampm={false}
                                            leftArrowButtonText=""
                                            rightArrowButtonText=""
                                        />
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <TextField
                                            multiline
                                            fullWidth
                                            value={newDienBienBenh}
                                            onChange={(event) => setNewDienBienBenh(event.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="tableBodyBorderRight">
                                        <TextField
                                            multiline
                                            fullWidth
                                            value={newYLenh}
                                            onChange={(event) => setNewYLenh(event.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>{name}</TableCell>
                                </TableRow>
                            }
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

            { role === "BS" && 
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                        {errors.length > 0 && <Typography color="error">Vui lòng nhập đầy đủ thông tin: <b>{errors.join(', ')}</b>.</Typography>}
                    </Grid>
                    <Grid item xs={6} align="right">
                        {!addNew
                        ? (
                            <Button 
                                sx={{ width: 150 }} 
                                startIcon={<Add fontSize="small"/>}
                                onClick={() => {
                                    setNewNgayGio(new Date());
                                    setAddNew(true);
                                }}
                            >
                                Thêm diễn biến
                            </Button>
                        ) : (
                            <>
                                <Button variant="outlined" startIcon={<Close />} sx={{ width: 150, mr: 2 }} onClick={handleCancel}>
                                    Hủy
                                </Button>

                                <Button variant="primary" startIcon={<Save />} sx={{ width: 150 }} onClick={handleSave}>
                                    Lưu tạm thời
                                </Button>
                            </>
                        )
                        }
                    </Grid>
                </Grid>
            }
        </>
    )
}

export default FToDieuTri;