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
import { useNavigate } from "react-router";
import { UtilsDateTime } from "../../utils";
import { sectionState } from "../../redux/slices/spellingError.slice";
import mdSections from "../../constants/md_sections.json";

const ToolBar = ({ open, toggleDrawer }) => {
    const { notifications, id, errorNoti } = useSelector((state) => state.auth.user);
    const { updating } = useSelector((state) => state.HSBA);
    const { spellingError } = useSelector((state) => state);
    const { accentColor } = useSelector((state) => state.auth.settings.appearance);
    const { today, handleLogout } = useContext(UserContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
            if ((updating && Object.keys(sectionState).filter(key => !mdSections["attached"].includes(key)).some(key => 
            (["Lý do vào viện", "Hỏi bệnh", "Khám bệnh", "Chẩn đoán khi ra viện"].includes(key) && mdSections[key].some(subKey => 
            spellingError[key][subKey].loading)) || (!["Lý do vào viện", "Hỏi bệnh", "Khám bệnh", "Chẩn đoán khi ra viện"].includes(key) 
            && spellingError[key].loading))) || !updating) {
                if (!errorNoti) { 
                    // dispatch(authThunk.getNotifications(id));
                }
            }
        }, 5000);
        return () => {
            clearInterval(timer);
        }
        // eslint-disable-next-line
    }, []);

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
            <Toolbar sx={{ pr: 24, bgcolor: (theme) => theme.palette[accentColor].dark }}>
                <IconButton 
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

                <IconButton onClick={onClickMenu} sx={{ background: 'white', ml: 2, '&:hover': { background: 'white' } }}>
                    <ArrowDropDown />
                </IconButton>
                <DropDownMenu anchorEl={anchorElMenu} open={openMenu} onClose={onCloseMenu} />
            </Toolbar>
        </AppBar>
    )
}

export default ToolBar;