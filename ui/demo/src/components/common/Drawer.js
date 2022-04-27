import React, { useContext } from "react";
import { 
    Drawer as MuiDrawer, IconButton, Box, List, Divider,
    ListItem, ListItemIcon, ListItemText, Typography, Grid, Avatar, ListSubheader
} from "@mui/material";
import logo from "../../images/logo.png";
import { faFileMedicalAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronLeft, EditLocationOutlined } from "@mui/icons-material";
import mdSections from "../../constants/md_sections.json";
import { UtilsRole } from "../../utils";
import UserContext from "../../contexts/UserContext";
import '../../styles/index.css';
import { useParams } from "react-router";
import { ListSwitchColumn } from "../lists";
import DrawerHeader from "./DrawerHeader";
import { useSelector } from "react-redux";
import Button from "./Button";
import { sectionState } from "../../redux/slices/spellingError.slice";

const Drawer = ({ open, toggleDrawer, content }) => {
    const { pid } = useParams();
    const { role } = useSelector((state) => state.auth.user);
    const { appearSec, setAppearSec, appearTime, setAppearTime, openSec, setOpenSec, 
        danhSachHSBATab, setDanhSachHSBATab, setOpenDialog, handleConfirmUpdate } = useContext(UserContext);
    const { updating } = useSelector((state) => state.HSBA);
    const { creatingMode } = useSelector((state) => state.danhSachHSBA);
    const { spellingError } = useSelector((state) => state);

    return (
        <MuiDrawer 
            sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 240,
                    boxSizing: 'border-box',
                    overflowY: 'hidden' 
                },       
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
                <img src={logo} alt="logo" style={{ maxWidth: 150 }}/>
                <IconButton onClick={toggleDrawer}>
                    <ChevronLeft />
                </IconButton>      
            </DrawerHeader>              
            
            <Box sx={{ mt: 3, mb: 3 }}>
                <Grid container spacing={1.5}>
                    <Grid item xs={4} align="right">
                        <Avatar src="/images/avatar_default.png" sx={{ width: 48, height: 48, border: '3px solid #009ABB' }} />
                    </Grid>
                    <Grid item xs={8}>
                        <div sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography fontWeight="bold">{content.name}</Typography>
                            <Typography variant="subtitle2" sx={{ color: '#666666' }}>{UtilsRole.getRoleText(content.role)}</Typography>
                        </div>
                    </Grid>
                </Grid>
            </Box>
            
            {(content.role === "BN" || typeof(pid) !== 'undefined') &&
                <>
                    <Divider sx={{ mt: 0.5 }} />
                    <Box sx={{ overflowY: 'auto' }}>     
                        {(content.role !== "BN" && updating) ?
                            <>
                                <List subheader={<ListSubheader sx={{ lineHeight: '32px', mt: 1, position: 'inherit' }} component="div">Danh sách mục - Xử lý lỗi</ListSubheader>}>
                                    {Object.keys(sectionState).filter(key => !mdSections["attached"].includes(key)).map((key, id) =>
                                        ((["Lý do vào viện", "Hỏi bệnh", "Khám bệnh", "Chẩn đoán khi ra viện"].includes(key) && mdSections[key].some(subKey => spellingError[key][subKey].changed))) 
                                        || (!["Lý do vào viện", "Hỏi bệnh", "Khám bệnh", "Chẩn đoán khi ra viện"].includes(key) && spellingError[key].changed) ?
                                            <ListItem 
                                                key={id}
                                                sx={{ py: 0.5 }}
                                                alignItems="flex-start"
                                                button
                                                onClick={() => document.getElementById(key).scrollIntoView({ behavior: "smooth" })}
                                            >
                                                <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                                                    <EditLocationOutlined fontSize="small" sx={{ color: (theme) => theme.palette.primary.main, mt: 0.5 }} />
                                                </ListItemIcon>
                                                <ListItemText primary={key} />
                                            </ListItem>
                                        : null
                                    )}
                                    <ListItem>
                                        <Button sx={{ width: "100%" }} variant="primary-dark" onClick={handleConfirmUpdate}>
                                            Xác nhận cập nhật
                                        </Button>
                                    </ListItem>
                                </List>  
                                <Divider />
                            </>
                            : null}

                        <List subheader={<ListSubheader sx={{ lineHeight: '32px', mt: 1, position: 'inherit' }} component="div">Danh sách mục - Hồ sơ bệnh án</ListSubheader>}>
                            {mdSections["sortOrder"][role].map((section, id) => (
                                <div key={id}>
                                    <ListItem 
                                        button 
                                        sx={{ '.MuiListItemSecondaryAction-root': { display: 'flex' } }}
                                        onClick={() => {
                                            var tAppearSec = [...appearSec], idx = tAppearSec.indexOf(id), tOpenSec = [...openSec];
                                            if (idx === -1) {
                                                tAppearSec.unshift(id);
                                                tOpenSec[id] = true;
                                                setAppearTime({ ...appearTime, [section]: new Date().toISOString() });
                                            } else {
                                                if (mdSections["attached"].includes(section)) {
                                                    if (spellingError[section].changed) {
                                                        setOpenDialog(true);
                                                    } else {
                                                        tAppearSec.splice(idx, 1);
                                                        tOpenSec[id] = false;
                                                        setAppearTime({ ...appearTime, [section]: null });
                                                    }
                                                } else if (section === "Bệnh án" || section === "Tổng kết bệnh án") {
                                                    if (mdSections[section].some(sec => spellingError[sec].changed)) {
                                                        setOpenDialog(true);
                                                    } else {
                                                        tAppearSec.splice(idx, 1);
                                                        tOpenSec[id] = false;
                                                        setAppearTime({ ...appearTime, [section]: null });
                                                    }
                                                }      
                                            }
                                            setOpenSec(tOpenSec);
                                            setAppearSec(tAppearSec);
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                            <FontAwesomeIcon color='#48B0F7' icon={faFileMedicalAlt} />
                                        </ListItemIcon>
                                        <ListItemText sx={{ color: appearSec.indexOf(id) === -1 ? 'black' : '#009ABB' }}>
                                            {section}
                                        </ListItemText>
                                    </ListItem>
                                </div>
                            ))}
                        </List>
                    </Box> 
                </>
            }

            {typeof(pid) === 'undefined' && content.role !== 'BN' && !creatingMode ?
                <>
                    <Divider sx={{ mt: 0.5 }} />
                    {danhSachHSBATab.value === 0 &&
                        <ListSwitchColumn 
                            columns={danhSachHSBATab.hienTaiCols}
                            columnsChecked={danhSachHSBATab.hienTaiColsChecked}
                            onClickItem={(id) => {
                                let tColsChecked = [...danhSachHSBATab.hienTaiColsChecked];
                                tColsChecked[id] = !tColsChecked[id];
                                setDanhSachHSBATab({
                                    ...danhSachHSBATab,
                                    hienTaiColsChecked: tColsChecked
                                });
                            }}
                            onClickShowAll={() => {
                                setDanhSachHSBATab({
                                    ...danhSachHSBATab,
                                    hienTaiColsChecked: new Array(danhSachHSBATab.hienTaiColsChecked.length).fill(true)
                                })
                            }}
                        />
                    }  
                    {danhSachHSBATab.value === 1 && 
                        <ListSwitchColumn 
                            columns={danhSachHSBATab.raVienCols}
                            columnsChecked={danhSachHSBATab.raVienColsChecked}
                            onClickItem={(id) => {
                                let tColsChecked = [...danhSachHSBATab.raVienColsChecked];
                                tColsChecked[id] = !tColsChecked[id];
                                setDanhSachHSBATab({
                                    ...danhSachHSBATab,
                                    raVienColsChecked: tColsChecked
                                });
                            }}
                            onClickShowAll={() => {
                                setDanhSachHSBATab({
                                    ...danhSachHSBATab,
                                    raVienColsChecked: new Array(danhSachHSBATab.raVienColsChecked.length).fill(true)
                                })
                            }}
                        />
                    }
                </>
            : null}
        </MuiDrawer>
    )
}

export default Drawer;