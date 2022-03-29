import React from "react";
import { Select, MenuItem } from "@mui/material";

const SelectYLenh = ({ danhSachYLenh, existValue, value, onChange, ...otherProps }) => {
    const filteredDSYL = [];
    danhSachYLenh.forEach((dsyl) => {
        if (dsyl.xacNhan !== "Thực hiện xong") filteredDSYL.push(dsyl);
    });
    filteredDSYL.sort((a, b) => {
        const dA = a.yLenh.split('-')[0].split(' ')[0].split('/'), dB = b.yLenh.split('-')[0].split(' ')[0].split('/');
        const tA = a.yLenh.split('-')[0].split(' ')[1].split(':'), tB = a.yLenh.split('-')[0].split(' ')[1].split(':');
        const ngayGioA = new Date(dA[dA.length - 1], dA[dA.length - 2], dA[0], tA[0], tA[1]);
        const ngayGioB = new Date(dB[dB.length - 1], dB[dB.length - 2], dB[0], tB[0], tB[1]);
        return ngayGioA - ngayGioB;
    });

    return (
        <Select
            value={value}
            onChange={onChange}
            SelectDisplayProps={{ style: { whiteSpace: 'unset' } }}
            displayEmpty
            renderValue={(selected) => !selected ? '-- Chọn y lệnh --' : selected}
            {...otherProps}
        >
            {filteredDSYL.map((dsyl, id) => (
                <MenuItem 
                    key={`yl-${id}`} 
                    value={dsyl.yLenh} 
                    sx={{ maxWidth: 350, whiteSpace: 'unset' }} 
                    disabled={dsyl.yLenh === value || existValue.findIndex((eVal) => eVal.yLenh === dsyl.yLenh) !== -1}
                >
                    {dsyl.yLenh}
                </MenuItem>
            ))}
        </Select>
    )
}

SelectYLenh.defaultProps = {
    existValue: [],
}

export default SelectYLenh;