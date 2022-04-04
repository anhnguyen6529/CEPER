import React from "react";
import { TableContainer, Table, TableHead, TableBody, TableRow, 
    TableCell, Checkbox, Paper, Typography
} from "@mui/material";
import "../../styles/index.css";

const headCells = [
    { id: 'tt', label: 'TT', unit: '', width: '5%' },
    { id: 'benh', label: '', unit: '', width: '10%' },
    { id: 'kyHieu', label: '', unit: '', width: '5%' },
    { id: 'thoiGian', label: 'Thời gian', unit: 'tính theo tháng', width: '20%' }
]
headCells.push(...headCells);

const BoxDacDiemLienQuanBenh = ({ dacDiemLienQuan }) => {
    const data = dacDiemLienQuan;

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
                            <TableCell className="tableBodyBorderRight" align="center">
                                <Checkbox 
                                    checked={data[idx].kyHieu} 
                                    disabled
                                />
                            </TableCell>
                            <TableCell className="tableBodyBorderRight">
                                {data[idx].benh === "Dị ứng" ? 
                                    data[idx].diNguyen.map((diNguyen, id) => (
                                        !!diNguyen && <Typography key={id}>{diNguyen} - {data[idx].thoiGian[id]} tháng</Typography>
                                    ))
                                : (data[idx].thoiGian > 0 && <Typography>{data[idx].thoiGian} tháng</Typography>)}
                            </TableCell>

                            <TableCell className="tableBodyBorderRight" align="center">{data[idx + 3].tt}</TableCell>
                            <TableCell>
                                {data[idx + 3].tt === "06" ? (
                                    data[idx + 3].kyHieu ? (
                                        data[idx + 3].benh.map((benh, id) => (
                                            !!benh && <Typography key={id}>{benh}</Typography>
                                        ))
                                    ) : "Khác"
                                ) : data[idx + 3].benh}
                            </TableCell>
                            <TableCell className="tableBodyBorderRight" align="center">
                                <Checkbox 
                                    checked={data[idx + 3].kyHieu} 
                                    disabled
                                />
                            </TableCell>
                            <TableCell className="tableBodyBorderRight" sx={{ verticalAlign: "top" }}>
                                {data[idx + 3].tt === "06" ? 
                                    data[idx + 3].thoiGian.map((thoiGian, id) => (
                                        thoiGian > 0 && <Typography key={id}>{thoiGian} tháng</Typography>
                                    ))
                                : (data[idx + 3].thoiGian > 0 && <Typography>{data[idx + 3].thoiGian} tháng</Typography>)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer> 
    )
}

export default BoxDacDiemLienQuanBenh;