import React, { useContext } from "react";
import { 
    Drawer as MuiDrawer, IconButton, Box, List, 
    ListItem, ListItemIcon, ListItemText, Typography, Grid, Avatar
} from "@mui/material";
import logo from "../../images/logo.png";
import { faFileMedicalAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { makeStyles, styled } from "@mui/styles";
import { ChevronLeft } from "@mui/icons-material";
import mdSections from "../../constants/md_sections.json";
import { UtilsRole } from "../../utils";
import UserContext from "../../contexts/UserContext";
import '../../styles/index.css';
import { useParams } from "react-router";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const useStyles = makeStyles((theme) => ({
    listItem: {
        border: '1px solid #DDD',
        borderRadius: 2,
        marginTop: 8,
        marginBottom: 8,
        paddingTop: 4,
        paddingBottom: 4,
        boxShadow: theme.shadows[1]
    }
}))

const Drawer = ({ open, toggleDrawer, content }) => {
    const { pid } = useParams();
    const classes = useStyles();
    const { tabs, setTabs, setSelectedTab } = useContext(UserContext);

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
            
            
            {content.role === "BN" | typeof(pid) !== 'undefined' ?
            <>
                {/* <Divider color="#48B0F7"/>
                <List sx={{ pt: 0, pb: 0 }}>
                    <ListItem  
                        button
                        sx={{ 
                            '&:hover': { background: openMD ? '#009ABB' : 'white' },
                            background: openMD ? '#009ABB' : 'white',
                            color: openMD ? 'white' : '#009ABB',
                            py: 1.5,
                        }}
                        onClick={() => setOpenMD(!openMD)}
                    >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                            <FontAwesomeIcon color={openMD ? 'white' : '#009ABB'} size="lg" icon={faNotesMedical} />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography sx={{ mt: 0.5 }}>
                                Hồ sơ bệnh án
                            </Typography>
                        </ListItemText>
                    </ListItem>
                </List>
                <Divider color="#48B0F7"/> */}
            
                {/* <Collapse in={openMD} timeout="auto" unmountOnExit sx={{ overflowY: 'auto' }}> */}
                {/* <Divider/> */}
                    <List sx={{ pt: 0, pb: 0, px: 1, overflowY: 'auto' }}>
                        {mdSections["attached"].map((section, id) => (
                            <div key={id}>
                                <ListItem 
                                    // button 
                                    className={classes.listItem}
                                    sx={{ cursor: tabs.findIndex(element => element.label === section) === -1 ? 'pointer' : 'default' }}
                                    onClick={() => {
                                        var tTabs = [...tabs];
                                        if (tTabs.findIndex(element => element.label === section) === -1) {
                                            tTabs.push({ label: section, showIcon: true, icon: null })
                                            setTabs(tTabs);
                                            setSelectedTab(tTabs.length - 1);
                                        }
                                    }}
                                    // onClick={() => {
                                    //     var temp = [...appearSec], idx = temp.indexOf(id), tmp = [...openSec];
                                    //     if (idx === -1) {
                                    //         temp.unshift(id);
                                    //         tmp[id] = true;
                                    //     } else {
                                    //         temp.splice(idx, 1);
                                    //         tmp[id] = false;
                                    //         if (idx === selectedSec) {
                                    //             setSelectedSec(-1);
                                    //         }
                                    //     }
                                    //     setOpenSec(tmp);
                                    //     setAppearSec(temp);
                                    // }}
                                >
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <FontAwesomeIcon color='#48B0F7' icon={faFileMedicalAlt} />
                                    </ListItemIcon>
                                    <ListItemText sx={{ color: tabs.findIndex(element => element.label === section) === -1 ? 'black' : '#009ABB' }}>
                                        {section}
                                    </ListItemText>
                                </ListItem>
                            </div>
                        ))}
                    </List>
                {/* </Collapse> */}
            </> 
            : null
            }
        </MuiDrawer>
    )
}

export default Drawer;