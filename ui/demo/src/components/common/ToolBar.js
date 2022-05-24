import React, { useContext, useEffect, useState } from "react";
import { Toolbar, IconButton, Typography, Badge, MenuItem, Divider } from "@mui/material";
import { Menu as MenuIcon, Notifications, ArrowDropDown } from "@mui/icons-material";
import AppBar from "./AppBar";
import DropDownMenu from "./DropDownMenu";
import dayOfWeek from "../../constants/day_of_week.json";
import { format } from "date-fns";
import UserContext from "../../contexts/UserContext";
import { useDispatch, useSelector } from "react-redux";
import Menu from "./Menu";
import authThunk from "../../redux/thunks/auth.thunk";
import { useNavigate, useParams } from "react-router";
import { UtilsDateTime } from "../../utils";
import { sectionState } from "../../redux/slices/spellingError.slice";
import mdSections from "../../constants/md_sections.json";

const ToolBar = ({ open, toggleDrawer }) => {
    const { notifications, id, errorNoti, getting, saving } = useSelector((state) => state.auth.user);
    const { updating, setting, loading, transfering } = useSelector((state) => state.HSBA);
    const { spellingError, danhSachHSBA } = useSelector((state) => state);
    const { changing } = useSelector((state) => state.auth.settings.appearance);
    const { functionality } = useSelector((state) => state.auth.settings);
    const { today, handleLogout } = useContext(UserContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pid } = useParams();

    const [anchorElMenu, setAnchorElMenu] = useState(null);
    const [anchorElNoti, setAnchorElNoti] = useState(null);
    const openMenu = Boolean(anchorElMenu);
    const openNoti = Boolean(anchorElNoti);
    
    const onClickMenu = (event) => {
        setAnchorElMenu(event.currentTarget);
    }

    const onCloseMenu = () => {
        setAnchorElMenu(null);
    }

    const onClickNoti = (event) => {
        setAnchorElNoti(event.currentTarget);
    }

    const onCloseNoti = () => {
        setAnchorElNoti(null);
    }
    
    useEffect(() => {
        const timer = setInterval(() => {
            if (!getting && !saving && !danhSachHSBA.loading && !danhSachHSBA.creatingHSBA && (!loading || typeof(pid) === "undefined") && !changing
            && !functionality.changing && !setting && !transfering && (!updating || (updating && !spellingError.loading && Object.keys(sectionState).filter(key =>
            mdSections["clinical"].includes(key)).every(key => (typeof(spellingError[key].loading) === "undefined" 
            && !mdSections[key].some(subKey => spellingError[key][subKey].changed && spellingError[key][subKey].loading)) ||
            (typeof(spellingError[key].loading) !== "undefined" && !(spellingError[key].changed && spellingError[key].loading)))))) {
                if (!errorNoti) { 
                    dispatch(authThunk.getNotifications(id));
                }
            }
        }, 5000);
        return () => {
            clearInterval(timer);
        }
        // eslint-disable-next-line
    }, [getting, danhSachHSBA.loading, danhSachHSBA.creatingHSBA, loading, setting, updating, spellingError]);

    useEffect(() => {
        if (errorNoti === "Token has expired") {
            handleLogout();
        }
        // eslint-disable-next-line
    }, [errorNoti]);

    const handleSeen = (notificationID) => {
        dispatch(authThunk.markNotificationSeen({ userID: id, notificationID }));
    }

    return (
        <AppBar position="fixed" open={open}>
            <Toolbar sx={{ pr: 24, bgcolor: (theme) => theme.palette.primary.dark }}>
                <IconButton 
                    aria-label="menu"
                    edge="start"
                    sx={{
                        marginRight: 36,
                        color: 'white',
                        ...(open && { display: 'none' })
                    }}
                    onClick={toggleDrawer}
                >
                    <MenuIcon />
                </IconButton>

                <Typography textAlign="right" sx={{ flexGrow: 1 }}>
                    {format(today, "HH:mm")} | {dayOfWeek[today.getDay().toString()]}, {format(today, "dd/MM/yyyy")}
                </Typography>

                <IconButton onClick={onClickNoti} sx={{ background: 'white', ml: 4, '&:hover': { background: 'white' } }}>
                    <Badge badgeContent={notifications.length} color="primary" >
                        <Notifications />
                    </Badge>
                </IconButton>
                <Menu anchorEl={anchorElNoti} open={openNoti} onClose={onCloseNoti}>
                    {notifications.length > 0 ?
                        [...notifications.map((notification, id) => [
                            (notification.type === "Created" &&
                                <MenuItem 
                                    key={id} 
                                    onClick={() => {
                                        handleSeen(notification.id);
                                        navigate(`/user/HSBA/${notification.content.pid}`)
                                    }}
                                    sx={{ flexDirection: "column", alignItems: "flex-start" }}
                                >
                                    <Typography>
                                        Bệnh nhân{' '}
                                        <Typography component="span" fontWeight="bold">{notification.content.name}</Typography>
                                    </Typography>
                                    <Typography>
                                        Vào viện lúc{' '}
                                        <Typography component="span" color="primary">
                                            {format(new Date(notification.timeCreated), 'dd/MM/yyyy hh:mm')}
                                        </Typography>
                                        <Typography component="span" color="text.secondary">
                                            {' '}•{' '}
                                            {!UtilsDateTime.timeSince(notification.timeCreated) 
                                                ? "Mới" : `Cách đây ${UtilsDateTime.timeSince(notification.timeCreated)}`}
                                        </Typography>
                                    </Typography>
                                </MenuItem>
                            ), 
                            (id < notifications.length - 1 && <Divider />)
                        ])]
                    : <MenuItem sx={{ color: "#999" }}>Không có thông báo</MenuItem>}
                </Menu>

                <IconButton aria-label="dropdown menu" onClick={onClickMenu} sx={{ background: 'white', ml: 2, '&:hover': { background: 'white' } }}>
                    <ArrowDropDown />
                </IconButton>
                <DropDownMenu anchorEl={anchorElMenu} open={openMenu} onClose={onCloseMenu} />
            </Toolbar>
        </AppBar>
    )
}

export default ToolBar;