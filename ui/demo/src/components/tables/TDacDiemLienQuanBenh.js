import React from "react";
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Checkbox, TextField, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import "../../styles/index.css";

const headCells = [
    { id: 'tt', label: 'TT' },
    { id: 'benh', label: '' },
    { id: 'kyHieu', label: 'Ký hiệu' },
    { id: 'thoiGian', label: 'Thời gian (tính theo tháng)' }
]
headCells.push(...headCells);

const TDacDiemLienQuanBenh = ({ dacDiemLienQuan, setDacDiemLienQuan, handleChange }) => {
    const { role } = useSelector((state) => state.auth.user);
    const data = dacDiemLienQuan;

    const handleChangeCheckbox = (event, id) => {
        let tData = [...data];
        tData[id] = { ...tData[id], kyHieu: event.target.checked };
        setDacDiemLienQuan(tData);
        handleChange();
    }

    const handleChangeTextField = (event, id) => {
        var tData = [...data];
        tData[id] = { ...tData[id], thoiGian: event.target.value };
        setDacDiemLienQuan(tData);
        handleChange();
    }
    
    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead sx={{ '.MuiTableCell-root': { textAlign: 'center', bgcolor: '#EFEFEF' } }}>
                    <TableRow>
                        {headCells.map((headCell, id) => (
                            <TableCell 
                                key={`head${headCell.id}${id}`} 
                                className={id < headCells.length - 1 && headCell.id !== "benh" ? "tableHeadBorderRight" : ""}
                            >
                                    {headCell.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.from(Array(data.length * 0.5)).map((value, idx) => (
                        <TableRow key={`rowDacDiemLienQuanBenh${idx}`}>
                            {Object.keys(data[idx]).map((key, id) => (
                                <TableCell
                                    key={`${key}${id}`}
                                    className={key !== "benh" ? "tableBodyBorderRight" : ""}
                                    align={key === "benh" ? 'left' : 'center'}
                                >
                                    {key === "kyHieu" && 
                                        <Checkbox 
                                            checked={data[idx].kyHieu} 
                                            onChange={(event) => handleChangeCheckbox(event, idx)} 
                                            disable={(role !== "BS").toString()} 
                                        />
                                    }
                                    {key === "thoiGian" && 
                                        <TextField 
                                            multiline
                                            fullWidth
                                            margin="dense"
                                            value={data[idx].thoiGian}
                                            onChange={(event) => handleChangeTextField(event, idx)}
                                            disabled={role !== "BS"}
                                        />    
                                    }
                                    {(key !== "kyHieu" && key !== "thoiGian") && data[idx][key]}
                                </TableCell>
                            ))}

                            {Object.keys(data[idx + 3]).map((key, id) => (
                                <TableCell
                                    key={`${key}${id + 3}`}
                                    className={id < Object.keys(data[idx + 3]).length - 1 && key !== "benh" ? "tableHeadBorderRight" : ""}
                                    align={key === "benh" ? 'left' : 'center'}
                                >
                                    {key === "kyHieu" && 
                                        <Checkbox 
                                            checked={data[idx + 3].kyHieu} 
                                            onChange={(event) => handleChangeCheckbox(event, idx + 3)} 
                                            disable={(role !== "BS").toString()} 
                                        />
                                    }
                                    {key === "thoiGian" && 
                                        <TextField 
                                            multiline
                                            fullWidth
                                            margin="dense"
                                            value={data[idx + 3].thoiGian}
                                            onChange={(event) => handleChangeTextField(event, idx + 3)}
                                            disabled={role !== "BS"}
                                        />    
                                    }
                                    {(key !== "kyHieu" && key !== "thoiGian") && data[idx + 3][key]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer> 
    )
}

export default TDacDiemLienQuanBenh;