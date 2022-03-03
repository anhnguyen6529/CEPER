import React, { useContext } from "react";
import { 
    Drawer as MuiDrawer, IconButton, Box, List, Divider, Tooltip,
    ListItem, ListItemIcon, ListItemText, Typography, Grid, Avatar, ListSubheader
} from "@mui/material";
import logo from "../../images/logo.png";
import { faFileMedicalAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "@mui/styles";
import { ChevronLeft, InfoOutlined } from "@mui/icons-material";
import mdSections from "../../constants/md_sections.json";
import { UtilsRole } from "../../utils";
import UserContext from "../../contexts/UserContext";
import '../../styles/index.css';
import { useParams } from "react-router";
import { ListSwitchColumn } from "../lists";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Drawer = ({ open, toggleDrawer, content }) => {
    const { pid } = useParams();
    const { appearSec, setAppearSec, openSec, setOpenSec, danhSachHSBATab, setDanhSachHSBATab } = useContext(UserContext);

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
            
            <Divider sx={{ mt: 2 }} />
            {(content.role === "BN" || typeof(pid) !== 'undefined') &&
            <>            
                {/* <Collapse in={openMD} timeout="auto" unmountOnExit sx={{ overflowY: 'auto' }}> */}
                    <List 
                        sx={{ overflowY: 'auto' }} 
                        subheader={<ListSubheader sx={{ lineHeight: '32px', mt: 1 }} component="div">Danh sách mục</ListSubheader>}
                    >
                        {mdSections["order"].map((section, id) => (
                            <div key={id}>
                                <ListItem 
                                    button 
                                    sx={{ '.MuiListItemSecondaryAction-root': { display: 'flex' } }}
                                    onClick={() => {
                                        var temp = [...appearSec], idx = temp.indexOf(id), tmp = [...openSec];
                                        if (idx === -1) {
                                            temp.unshift(id);
                                            tmp[id] = true;
                                        } else {
                                            temp.splice(idx, 1);
                                            tmp[id] = false;
                                        }
                                        setOpenSec(tmp);
                                        setAppearSec(temp);
                                    }}
                                    secondaryAction={
                                        section === "Bệnh án" 
                                            ? (
                                                <Tooltip placement="right" title="Những thông tin về quá trình bệnh lý, bệnh sử, thăm khám người bệnh, tóm tắt bệnh án và chẩn đoán tức thời" >
                                                    <InfoOutlined fontSize="small"/>
                                                </Tooltip>
                                            )
                                            : (section === "Tổng kết bệnh án"
                                                ? (
                                                    <Tooltip placement="right" title="Những thông tin về phương pháp điều trị, chẩn đoán ra viện, tình trạng người bệnh khi ra viện, hướng điều trị và các chế độ tiếp theo" >
                                                        <InfoOutlined fontSize="small"/>
                                                    </Tooltip>
                                                ) : null
                                            )
                                    }
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
                {/* </Collapse> */}
            </> 
            }

            {typeof(pid) === 'undefined' && content.role !== 'BN' &&
                <>
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
            }
        </MuiDrawer>
    )
}

export default Drawer;