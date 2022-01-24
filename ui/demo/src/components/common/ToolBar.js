import React, { useContext, useState } from "react";
import { Toolbar, IconButton, Typography, Badge } from "@mui/material";
import { Menu, Notifications, ArrowDropDown } from "@mui/icons-material";
import AppBar from "./AppBar";
import DropDownMenu from "./DropDownMenu";
import dayOfWeek from "../../constants/day_of_week.json";
import { format } from "date-fns";
import UserContext from "../../contexts/UserContext";

const ToolBar = ({ open, toggleDrawer }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const user = useContext(UserContext);

    const onClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const onCloseMenu = () => {
        setAnchorEl(null);
    }

    return (
        <AppBar position="absolute" open={open}>
            <Toolbar sx={{ pr: 24, background: '#09425A'}}>
                <IconButton 
                    edge="start"
                    sx={{
                        marginRight: 36,
                        color: 'white',
                        ...(open && { display: 'none' })
                    }}
                    onClick={toggleDrawer}
                >
                    <Menu />
                </IconButton>

                <Typography textAlign="right" sx={{ flexGrow: 1 }}>
                    {format(user.today, "HH:mm")} | {dayOfWeek[user.today.getDay().toString()]}, {format(user.today, "dd/MM/yyyy")}
                </Typography>

                <IconButton sx={{ background: 'white', ml: 4, '&:hover': { background: 'white' } }}>
                    <Badge badgeContent={0} color="primary" >
                        <Notifications />
                    </Badge>
                </IconButton>

                <IconButton onClick={onClickMenu} sx={{ background: 'white', ml: 2, '&:hover': { background: 'white' } }}>
                    <ArrowDropDown />
                </IconButton>
                <DropDownMenu anchorEl={anchorEl} open={openMenu} onClose={onCloseMenu} />
            </Toolbar>
        </AppBar>
    )
}

export default ToolBar;