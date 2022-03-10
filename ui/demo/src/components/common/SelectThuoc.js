import React from "react";
import { Autocomplete, Popper, TextField } from "@mui/material";
import drugList from "../../constants/drug_list.json";

const SelectThuoc = ({ existValue, value, onChange, hamLuong, inputProps, ...otherProps }) => {
    const mappedDrugs = drugList.map((drug) => {
        if (hamLuong) {
            return drug.ten_hoat_chat + ' ' + drug.nong_do_ham_luong; 
        } else {
            return drug.ten_hoat_chat;
        }
    });
    const drugs = [];
    mappedDrugs.forEach((mappedDrug) => {
        if (drugs.findIndex((drug) => drug === mappedDrug) === -1 
            && existValue.findIndex((eVal) => eVal === mappedDrug) === -1) drugs.push(mappedDrug);
    })

    return (
        <Autocomplete 
            value={value}
            onChange={onChange}
            renderInput={(params) => 
                <TextField 
                    {...params} 
                    placeholder="-- Chọn --" 
                    inputProps={{ ...params.inputProps, style: { paddingTop: 3, paddingBottom: 3 } }}
                    sx={{ '.MuiAutocomplete-input': { '&::placeholder': { opacity: 1 } }}}
                    {...inputProps}
                />}
            options={drugs}
            noOptionsText="(trống)"
            PopperComponent={(params) => <Popper {...params} placement="bottom-start" />}
            {...otherProps}
        />
    )
}

SelectThuoc.defaultProps = {
    existValue: [],
    hamLuong: true
}

export default SelectThuoc;