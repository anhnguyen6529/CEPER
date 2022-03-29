import React from "react";
import { Menu, MenuItem, ListItemIcon } from "@mui/material";
import { Settings, Help, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router";
import store from "../../redux/store";

const DropDownMenu = ({ anchorEl, open, onClose }) => {
    const navigate = useNavigate();

    return (
        <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        onClick={onClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Cài đặt
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Help fontSize="small" />
          </ListItemIcon>
          Trợ giúp & hỗ trợ
        </MenuItem>
        <MenuItem onClick={() => {
          store.dispatch({ type: 'LOG_OUT'});
          localStorage.removeItem('user');
          navigate('/login');
        }}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    )
}

export default DropDownMenu;