import React from "react";
import { Box, Grid, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Circle } from "@mui/icons-material";
import { useSelector } from "react-redux";
import "../../styles/index.css";

const BoxHoiBenh = () => {
    const { hoiBenh } = useSelector(state => state.HSBA);

    return (
        <Box>
            <Grid container>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Quá trình bệnh lý</Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography sx={{ pl: 3 }}>{!!hoiBenh.quaTrinhBenhLy ? hoiBenh.quaTrinhBenhLy : <i>(trống)</i>}</Typography>
                </Grid>
            </Grid>

            <Typography sx={{ mt: 2 }} fontWeight="bold">Tiền sử bệnh</Typography>
            <Box sx={{ '.MuiListItemIcon-root': { minWidth: 24 }, '.MuiListItem-root': { pr: 0 } }}>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <Circle sx={{ width: 9, color: 'black' }}/>
                        </ListItemIcon>
                        <ListItemText>
                            <Grid container>
                                <Grid item xs={2}>
                                    <Typography fontWeight="bold">Bản thân</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography>{!!hoiBenh.tienSu.banThan ? hoiBenh.tienSu.banThan : <i>(trống)</i>}</Typography>
                                </Grid>
                            </Grid>
                        </ListItemText>
                    </ListItem>

                    <ListItem>
                        <ListItemIcon>
                            <Circle sx={{ width: 9, color: 'black' }}/>
                        </ListItemIcon>
                        <ListItemText>
                            <Typography fontWeight="bold">Đặc điểm liên quan bệnh</Typography>
                        </ListItemText>
                    </ListItem>
                    <Box sx={{ ml: 5 }}>
                        {/* <TDacDiemLienQuanBenh dacDiemLienQuan={dacDiemLienQuan} setDacDiemLienQuan={setDacDiemLienQuan} handleChange={() => handleChange(2)} />  */}
                    </Box>
                    
                    <ListItem sx={{ mt: 1 }}>
                        <ListItemIcon>
                            <Circle sx={{ width: 9, color: 'black' }}/>
                        </ListItemIcon>
                        <ListItemText>
                            <Grid container>
                                <Grid item xs={2}>
                                    <Typography fontWeight="bold">Gia đình</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography>{!!hoiBenh.tienSu.giaDinh ? hoiBenh.tienSu.giaDinh : <i>(trống)</i>}</Typography>
                                </Grid>
                            </Grid>
                        </ListItemText>
                    </ListItem>            
                </List>
            </Box>
        </Box>
    )
}

export default BoxHoiBenh;