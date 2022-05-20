import React, { useContext } from "react";
import { Tooltip } from "@mui/material";
import { 
    CloseFullscreen, 
    OpenInFull, 
    ArrowUpward, 
    ArrowDownward, 
    VisibilityOff
} from "@mui/icons-material";
import UserContext from "../contexts/UserContext";
import mdSections from "../constants/md_sections.json";
import { useSelector } from "react-redux";

const ToolBarSection = ({ id, sectionId, sectionName }) => {
    const { appearSec, setAppearSec, openSec, setOpenSec, setOpenDialog } = useContext(UserContext);
    const { spellingError } = useSelector(state => state);

    return (
        <>
            <Tooltip title="Di chuyển lên trên" placement="top">
                <span>
                    <ArrowUpward 
                        sx={{ 
                            cursor: 'pointer', 
                            mx: 0.75, 
                            color: (theme) => id === 0 ? theme.palette.action.disabled : theme.palette.primary.dark 
                        }}
                        fontSize="small"
                        onClick={() => {
                            var temp = [...appearSec];
                            [temp[id], temp[id - 1]] = [temp[id - 1], temp[id]];
                            setAppearSec(temp);
                        }}
                    />
                </span>
            </Tooltip>
            <Tooltip title="Di chuyển xuống dưới" placement="top">
                <span>
                    <ArrowDownward 
                        sx={{ 
                            cursor: 'pointer',
                            mx: 0.75,
                            color: (theme) => id === appearSec.length - 1 ? theme.palette.action.disabled : theme.palette.primary.dark
                        }}
                        fontSize="small"
                        onClick={() => {
                            var temp = [...appearSec];
                            [temp[id], temp[id + 1]] = [temp[id + 1], temp[id]];
                            setAppearSec(temp);
                        }}
                    />
                </span>
            </Tooltip>
            <Tooltip title="Ẩn mục" placement="top">
                <span>
                    <VisibilityOff 
                        sx={{ cursor: 'pointer', mx: 0.75, color: (theme) => theme.palette.primary.dark }}
                        fontSize="small"
                        onClick={() => {
                            var temp = [...appearSec];
                            if (mdSections["attached"].includes(sectionName)) {
                                if (spellingError[sectionName].changed) {
                                    setOpenDialog(true);
                                } else {
                                    temp.splice(id, 1);
                                }
                            } else if (sectionName === "Bệnh án" || sectionName === "Tổng kết bệnh án") {
                                if (mdSections[sectionName].some(sec => spellingError[sec].changed)) {
                                    setOpenDialog(true);
                                } else {
                                    temp.splice(id, 1);
                                }
                            } else {
                                temp.splice(id, 1);
                            }
                            setAppearSec(temp);
                        }}
                    />
                </span>
            </Tooltip>
            <Tooltip title="Thu gọn mục" placement="top">
                <span>
                    <CloseFullscreen 
                        sx={{ 
                            cursor: 'pointer', 
                            mx: 0.75,
                            color: (theme) => !openSec[sectionId] ? theme.palette.action.disabled : theme.palette.primary.dark
                        }}
                        fontSize="small"
                        onClick={() => {
                            var temp = [...openSec];
                            temp[sectionId] = false;
                            setOpenSec(temp);
                        }}
                    />
                </span>
            </Tooltip>
            <Tooltip title="Mở rộng mục" placement="top">
                <span>
                    <OpenInFull 
                        fontSize="small"
                        sx={{ 
                            cursor: 'pointer', 
                            mx: 0.75,
                            color: (theme) => openSec[sectionId] ? theme.palette.action.disabled : theme.palette.primary.dark
                        }}
                        onClick={() => {
                            var temp = [...openSec];
                            temp[sectionId] = true;
                            setOpenSec(temp);
                        }}
                    />
                </span>
            </Tooltip>
        </>
    )
}

export default ToolBarSection;