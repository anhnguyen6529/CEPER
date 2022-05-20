import React from "react";
import { TableContainer, Table, TableHead, TableBody, TableRow, 
    TableCell, Checkbox, TextField, Paper, Box, Typography
} from "@mui/material";
import { useSelector } from "react-redux";
import "../../styles/index.css";
import { Add } from "@mui/icons-material";

const headCells = [
    { id: 'tt', label: 'TT', unit: '', width: '5%' },
    { id: 'benh', label: '', unit: '', width: '16%' },
    { id: 'kyHieu', label: '', unit: '', width: '5%' },
    { id: 'thoiGian', label: 'Thời gian', unit: 'tính theo tháng', width: '24%' }
]
headCells.push(...headCells);

const TDacDiemLienQuanBenh = ({ dacDiemLienQuan, setDacDiemLienQuan, handleChange }) => {
    const { updating } = useSelector((state) => state.HSBA);
    const data = dacDiemLienQuan;

    const handleChangeCheckbox = (checked, id) => {
        let tData = [...data];
        tData[id] = { ...tData[id], kyHieu: checked };
        if (!checked) {
            if (tData[id].benh === "Dị ứng") {
                tData[id].diNguyen = [""];
                tData[id].thoiGian = [0];
            } else {
                if (tData[id].tt === "06") {
                    tData[id].benh = [""];
                    tData[id].thoiGian = [0];
                } else {
                    tData[id].thoiGian = 0;
                }
            }
        }
        setDacDiemLienQuan(tData);
        handleChange(tData);
    }

    const handleChangeTextField = (value, id) => {
        var tData = [...data];
        tData[id] = { ...tData[id], thoiGian: value };
        setDacDiemLienQuan(tData);
        handleChange(tData);
    }

    const handleAddDiNguyenClick = (diUngIndex) => {
        const tData = [...data];
        tData[diUngIndex].diNguyen = [...tData[diUngIndex].diNguyen, ""];
        tData[diUngIndex].thoiGian = [...tData[diUngIndex].thoiGian, 0];
        setDacDiemLienQuan(tData);
        handleChange(tData);
    }

    const handleAddBenhClick = (index) => {
        const tData = [...data];
        tData[index].benh = [...tData[index].benh, ""];
        tData[index].thoiGian = [...tData[index].thoiGian, 0];
        setDacDiemLienQuan(tData);
        handleChange(tData);
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
                                width={headCell.width}
                            >
                                {headCell.label}{' '}
                                {!!headCell.unit ? <Typography component="span" fontWeight="bold">({<i>{headCell.unit}</i>})</Typography> : ""}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.from(Array(data.length * 0.5)).map((_, idx) => (
                        <TableRow key={`rowDacDiemLienQuanBenh${idx}`}>
                            <TableCell className="tableBodyBorderRight" align="center">{data[idx].tt}</TableCell>
                            <TableCell>{data[idx].benh}</TableCell>
                            <TableCell className="tableBodyBorderRight" align="center" sx={{ pl: 0 }}>
                                <Checkbox 
                                    sx={{ p: 0 }}
                                    checked={data[idx].kyHieu} 
                                    onChange={({ target: { checked }}) => handleChangeCheckbox(checked, idx)} 
                                    disabled={updating} 
                                    color="primary"
                                />
                            </TableCell>
                            <TableCell className="tableBodyBorderRight">
                                {data[idx].benh === "Dị ứng" ? 
                                    data[idx].diNguyen.map((diNguyen, id) => (
                                        <Box className="df aic" key={id}>
                                            <TextField 
                                                multiline
                                                margin="dense"
                                                value={diNguyen}
                                                onChange={({ target: { value } }) => {
                                                    const tData = [...data], tDiNguyen = [...tData[idx].diNguyen];
                                                    tDiNguyen[id] = value;
                                                    tData[idx] = { ...tData[idx], diNguyen: tDiNguyen };
                                                    setDacDiemLienQuan(tData);
                                                    handleChange(tData);
                                                }}
                                                sx={{ width: "65%" }}
                                                disabled={updating || (!updating && !data[idx].kyHieu)}
                                                placeholder="Dị nguyên"
                                            /> 
                                            <Typography sx={{ mx: 1 }}>-</Typography>
                                            <TextField 
                                                type="number"
                                                sx={{ width: "35%" }}
                                                margin="dense"
                                                InputProps={{ inputProps: { min: 0 } }}
                                                value={data[idx].thoiGian[id]}
                                                onChange={({ target: { value } }) => {
                                                    const tData = [...data], tThoiGian = [...tData[idx].thoiGian];
                                                    tThoiGian[id] = value;
                                                    tData[idx] = { ...tData[idx], thoiGian: tThoiGian };
                                                    setDacDiemLienQuan(tData);
                                                    handleChange(tData);
                                                }}
                                                disabled={updating || (!updating && !data[idx].kyHieu)}
                                            />  
                                            
                                            {id === data[idx].diNguyen.length - 1 && data[idx].kyHieu ? 
                                                <Add sx={{ ml: 0.5, cursor: "pointer", color: "#999" }} onClick={() => handleAddDiNguyenClick(idx)} />
                                            : null}
                                        </Box>
                                    ))
                                : (
                                    <TextField 
                                        type="number"
                                        fullWidth
                                        margin="dense"
                                        InputProps={{ inputProps: { min: 0 } }}
                                        value={data[idx].thoiGian}
                                        onChange={({ target: { value } }) => handleChangeTextField(value, idx)}
                                        disabled={updating || (!updating && !data[idx].kyHieu)}
                                    /> 
                                )}
                            </TableCell>

                            <TableCell className="tableBodyBorderRight" align="center">{data[idx + 3].tt}</TableCell>
                            <TableCell sx={{ pr: 0 }}>
                                {data[idx + 3].tt === "06" ? (
                                    data[idx + 3].kyHieu ? (
                                        data[idx + 3].benh.map((benh, id) => (
                                            <Box className="df aic" key={id}>
                                                <TextField 
                                                    key={id}
                                                    fullWidth
                                                    margin="dense"
                                                    value={benh}
                                                    onChange={({ target: { value } }) => {
                                                        const tData = [...data], tBenh = [...tData[idx + 3].benh];
                                                        tBenh[id] = value;
                                                        tData[idx + 3] = { ...tData[idx + 3], benh: tBenh }; 
                                                        setDacDiemLienQuan(tData);
                                                        handleChange(tData);
                                                    }}
                                                    placeholder="Khác"
                                                />
                                                {id === data[idx + 3].benh.length - 1 ? 
                                                    <Add sx={{ ml: 0.5, cursor: "pointer", color: "#999" }} onClick={() => handleAddBenhClick(idx + 3)} />
                                                : null}
                                            </Box>
                                        ))
                                    ) : "Khác"
                                ) : data[idx + 3].benh}
                            </TableCell>
                            <TableCell className="tableBodyBorderRight" align="center">
                                <Checkbox 
                                    sx={{ p: 0 }}
                                    checked={data[idx + 3].kyHieu} 
                                    onChange={({ target: { checked }}) => handleChangeCheckbox(checked, idx + 3)} 
                                    disabled={updating} 
                                    color="primary"
                                />
                            </TableCell>
                            <TableCell className="tableBodyBorderRight" sx={{ verticalAlign: data[idx + 3].tt === "06" ? "top" : "middle" }}>
                                {data[idx + 3].tt === "06" ? 
                                    data[idx + 3].thoiGian.map((thoiGian, id) => (
                                        <TextField 
                                            key={id}
                                            type="number"
                                            fullWidth
                                            margin="dense"
                                            InputProps={{ inputProps: { min: 0 } }}
                                            value={thoiGian}
                                            onChange={({ target: { value } }) => {
                                                const tData = [...data], tThoiGian = [...tData[idx + 3].thoiGian];
                                                tThoiGian[id] = value;
                                                tData[idx + 3] = { ...tData[idx + 3], thoiGian: tThoiGian };
                                                setDacDiemLienQuan(tData);
                                                handleChange(tData);
                                            }}
                                            disabled={updating || (!updating && !data[idx + 3].kyHieu)}
                                        /> 
                                    ))
                                 : (
                                    <TextField 
                                        type="number"
                                        fullWidth
                                        margin="dense"
                                        InputProps={{ inputProps: { min: 0 } }}
                                        value={data[idx + 3].thoiGian}
                                        onChange={({ target: { value } }) => handleChangeTextField(value, idx + 3)}
                                        disabled={updating || (!updating && !data[idx + 3].kyHieu)}
                                    /> 
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer> 
    )
}

export default TDacDiemLienQuanBenh;