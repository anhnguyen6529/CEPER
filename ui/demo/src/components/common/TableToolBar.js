import { ViewColumn } from "@mui/icons-material";
import { Menu, MenuItem, Switch, Typography, Box, Grid } from "@mui/material";
import React, { useState } from "react";
import Button from "./Button";
import "../../styles/index.css";

const TableToolBar = ({ columns, colsChecked, setColsChecked }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangeSwitch = (id) => {
        let tColsChecked = [...colsChecked];
        tColsChecked[id] = !tColsChecked[id];
        setColsChecked(tColsChecked);
    }

    const handleHideAll = () => {
        setColsChecked(new Array(colsChecked.length).fill(false));
    }

    const handleShowAll = () => {
        setColsChecked(new Array(colsChecked.length).fill(true));
    }

    return (
        <div>
            <Button variant="primary" startIcon={<ViewColumn />} onClick={handleClick}>
                Ẩn/hiện các cột
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{ 
                    '.MuiMenu-list': { minWidth: 200, overflow: 'hidden', py: 0 }, 
                    '.MuiMenuItem-root': { px: 1 }, 
                    '.MuiSwitch-root': { mr: 0.5 } 
                }}
            >
                <Typography color="#999" sx={{ mt: 1, mb: 0.5, ml: 1.5 }}><i>Danh sách cột</i></Typography>
                <Box sx={{ maxHeight: 200, overflow: 'auto', pb: 1 }}>
                    {columns.map((column, index) => (
                        <MenuItem key={column.id} sx={{ py: 0.25 }} onClick={() => handleChangeSwitch(index)}>
                            <Switch 
                                size="small"
                                checked={colsChecked[index]}
                            />

                            <Typography>{column.label}</Typography>
                        </MenuItem>
                    ))}
                </Box>
                <Box sx={{ position: 'sticky', bottom: 0, bgcolor: 'white', p: 1 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6}>
                            <Button 
                                variant="secondary" 
                                sx={{ minWidth: 105 }} 
                                onClick={handleHideAll}
                                disabled={colsChecked.every((element) => element === false)}
                            >
                                Ẩn tất cả cột
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button 
                                variant="secondary" 
                                sx={{ minWidth: 105 }} 
                                onClick={handleShowAll}
                                disabled={colsChecked.every((element) => element === true)}
                            >
                                Hiện tất cả cột
                            </Button>
                        </Grid>
                    </Grid>  
                </Box>  
            </Menu>
        </div>
    )
}

export default TableToolBar;