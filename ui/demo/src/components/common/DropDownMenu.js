import React from "react";
import { Menu, MenuItem, ListItemIcon } from "@mui/material";
import { Settings, Help, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router";
import store from "../../redux/store";
import authApi from "../../apis/auth";

const DropDownMenu = ({ anchorEl, open, onClose }) => {
    const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			const apiResponse = await authApi.logout();

			if (apiResponse.status !== 200) {
				throw new Error(apiResponse.statusText);
			}

			store.dispatch({ type: 'LOG_OUT'});
			localStorage.removeItem('token');
			navigate('/login');
		} catch (error) {
			console.log(error.message);
		}
	}

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
			<MenuItem onClick={handleLogout}>
				<ListItemIcon>
					<Logout fontSize="small" />
				</ListItemIcon>
				Đăng xuất
			</MenuItem>
      </Menu>
    )
}

export default DropDownMenu;