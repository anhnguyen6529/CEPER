import React from "react";
import { Select, MenuItem } from "@mui/material";

const SelectYLenh = ({ danhSachYLenh, existValue, value, onChange, ...otherProps }) => {
    const filteredDSYL = [];
    danhSachYLenh.forEach((dsyl) => {
        if (dsyl.xacNhan !== "Thực hiện xong") filteredDSYL.push(dsyl);
    })

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