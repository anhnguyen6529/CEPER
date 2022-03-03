import { Box, Typography, TextField, Grid, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { Button } from "../common";
import HSBAContext from "../../contexts/HSBAContext";
import mdSections from "../../constants/md_sections.json";
import { Circle } from "@mui/icons-material";
import { TDacDiemLienQuanBenh } from "../tables";

const FHoiBenh = () => {
    const { hoiBenh } = useSelector((state) => state.HSBA);
    const { role } = useSelector((state) => state.auth.user);
    const { saveSec, setSaveSec } = useContext(HSBAContext);
    const dispatch = useDispatch();

    const [quaTrinhBenhLy, setQuaTrinhBenhLy] = useState(hoiBenh.quaTrinhBenhLy);
    const [banThan, setBanThan] = useState(hoiBenh.tienSu.banThan);
    const [dacDiemLienQuan, setDacDiemLienQuan] = useState(hoiBenh.tienSu.dacDiemLienQuanBenh);
    const [giaDinh, setGiaDinh] = useState(hoiBenh.tienSu.giaDinh);
    const [hasChanged, setHasChanged] = useState(false);

    const benhAnId = mdSections["order"].indexOf("Bệnh án");
    const sectionId = mdSections["Bệnh án"].indexOf("Hỏi bệnh");
  
    const handleSave = () => {
        dispatch(HSBAActions.updateBacSiSection({
            section: 'hoiBenh',
            data: {
                quaTrinhBenhLy,
                tienSu: {
                    banThan,
                    dacDiemLienQuanBenh: dacDiemLienQuan,
                    giaDinh
                }
            }
        }))
        setHasChanged(false);
        let tSaveSec = [...saveSec];
        tSaveSec[benhAnId][sectionId] = new Date();
        setSaveSec(tSaveSec);
    }

    const handleReset = () => {
        setQuaTrinhBenhLy(hoiBenh.quaTrinhBenhLy);
        setBanThan(hoiBenh.tienSu.banThan);
        setDacDiemLienQuan(hoiBenh.tienSu.dacDiemLienQuanBenh);
        setGiaDinh(hoiBenh.tienSu.giaDinh);
        setHasChanged(false);
    }

    const handleChange = () => {
        if (!hasChanged) {
            setHasChanged(true);
        }
    }

    return (
        <Box component="form" noValidate sx={{ '.MuiGrid-container': { alignItems: 'center' } }}>
            <Grid container>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Quá trình bệnh lý</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={quaTrinhBenhLy}
                        onChange={(event) => {
                            setQuaTrinhBenhLy(event.target.value);
                            handleChange();
                        }}
                        disabled={role !== "BS"}
                    />
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
                                <Grid item xs={1}>
                                    <Typography fontWeight="bold">Bản thân</Typography>
                                </Grid>
                                <Grid item xs={11}>
                                    <TextField 
                                        multiline
                                        fullWidth
                                        value={banThan}
                                        onChange={(event) => {
                                            setBanThan(event.target.value);
                                            handleChange();
                                        }}
                                        disabled={role !== "BS"}
                                    />
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
                        <TDacDiemLienQuanBenh dacDiemLienQuan={dacDiemLienQuan} setDacDiemLienQuan={setDacDiemLienQuan} handleChange={handleChange} /> 
                    </Box>
                    
                    <ListItem sx={{ mt: 1 }}>
                        <ListItemIcon>
                            <Circle sx={{ width: 9, color: 'black' }}/>
                        </ListItemIcon>
                        <ListItemText>
                            <Grid container>
                                <Grid item xs={1}>
                                    <Typography fontWeight="bold">Gia đình</Typography>
                                </Grid>
                                <Grid item xs={11}>
                                    <TextField 
                                        multiline
                                        fullWidth
                                        value={giaDinh}
                                        onChange={(event) => {
                                            setGiaDinh(event.target.value);
                                            handleChange();
                                        }}
                                        disabled={role !== "BS"}
                                    />
                                </Grid>
                            </Grid>
                        </ListItemText>
                    </ListItem>            
                </List>
            </Box>

            {hasChanged &&
                <Box sx={{ width: '100%', textAlign: 'right', mt: 2 }}>
                    <Button variant="outlined" sx={{ mr: 2 }} onClick={handleReset}>
                        Hủy
                    </Button>

                    <Button variant="primary" onClick={handleSave}>
                        Lưu tạm thời
                    </Button>
                </Box>
            }
        </Box>
    )
}

export default FHoiBenh;
