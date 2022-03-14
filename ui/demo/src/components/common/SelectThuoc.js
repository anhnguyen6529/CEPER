import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import drugList from "../../constants/drug_list.json";

const SelectThuoc = ({ existValue, value, onChange, placeholder, hamLuong, inputProps, ...otherProps }) => {
    const mappedDrugs = drugList.map((drug) => {
        if (hamLuong) {
            return drug.ten_hoat_chat + ' ' + drug.nong_do_ham_luong; 
        } else {
            return drug.ten_hoat_chat;
        }
    });
    const drugs = [];
    mappedDrugs.forEach((mappedDrug) => {
        if (drugs.findIndex((drug) => drug === mappedDrug) === -1) {
            drugs.push(mappedDrug);
        }
    })

    return (
        <Autocomplete 
            value={value}
            onChange={onChange}
            renderInput={(params) => 
                <TextField 
                    {...params} 
                    placeholder={placeholder}
                    inputProps={{ ...params.inputProps, style: { paddingTop: 3, paddingBottom: 3 } }}
                    {...inputProps}
                />}
            options={drugs}
            disableClearable
            // PopperComponent={(params) => <Popper {...params} placement="bottom-start" />}
            getOptionDisabled={(option) => existValue.findIndex((eVal) => eVal === option) !== -1}
            {...otherProps}
        />
    )
}

SelectThuoc.defaultProps = {
    existValue: [],
    hamLuong: true
}

export default SelectThuoc;