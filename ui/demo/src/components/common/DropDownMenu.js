import React, { useContext } from "react";
import { MenuItem, ListItemIcon } from "@mui/material";
import { Settings, Help, Logout, Ballot } from "@mui/icons-material";
import UserContext from "../../contexts/UserContext";
import Menu from "./Menu";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const DropDownMenu = ({ anchorEl, open, onClose }) => {
    const { handleLogout } = useContext(UserContext);
	const navigate = useNavigate();
	const { role } = useSelector(state => state.auth.user);

	const handleClickDSBA = () => {
		navigate('/user/HSBA');
	}

	const handleClickSettings = () => {
		navigate('/user/settings');
	}

    return (
        <Menu
			anchorEl={anchorEl}
			open={open}
			onClose={onClose}
			onClick={onClose}
		>
			{role !== "BN" ? 
				<MenuItem onClick={handleClickDSBA}>
					<ListItemIcon>
						<Ballot fontSize="small" />
					</ListItemIcon>
					Danh sách bệnh án
				</MenuItem>
			: null}
			<MenuItem onClick={handleClickSettings}>
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
			<MenuItem onClick={() => handleLogout(false)}>
				<ListItemIcon>
					<Logout fontSize="small" />
				</ListItemIcon>
				Đăng xuất
			</MenuItem>
      </Menu>
    )
}

export default DropDownMenu;