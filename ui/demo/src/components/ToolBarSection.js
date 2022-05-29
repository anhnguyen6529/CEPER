import React, { useContext } from "react";
import { IconButton, styled, Tooltip } from "@mui/material";
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

const StyledIconButton = styled(IconButton)({
    padding: 0,
    verticalAlign: "initial",
    '&:hover': {
        backgroundColor: 'transparent'
    }
});

const ToolBarSection = ({ id, sectionId, sectionName }) => {
    const { appearSec, setAppearSec, openSec, setOpenSec, setOpenDialog } = useContext(UserContext);
    const { spellingError } = useSelector(state => state);

    return (
        <>
            <Tooltip title="Di chuyển lên trên" placement="top">
                <StyledIconButton
                    onClick={() => {
                        var temp = [...appearSec];
                        [temp[id], temp[id - 1]] = [temp[id - 1], temp[id]];
                        setAppearSec(temp);
                    }}
                >
                    <ArrowUpward 
                        sx={{ 
                            cursor: 'pointer', 
                            mx: 0.75, 
                            color: (theme) => id === 0 ? theme.palette.action.disabled : theme.palette.primary.dark 
                        }}
                        fontSize="small"
                    />
                </StyledIconButton>
            </Tooltip>
            <Tooltip title="Di chuyển xuống dưới" placement="top">
                <StyledIconButton
                    onClick={() => {
                        var temp = [...appearSec];
                        [temp[id], temp[id + 1]] = [temp[id + 1], temp[id]];
                        setAppearSec(temp);
                    }}
                >
                    <ArrowDownward 
                        sx={{ 
                            cursor: 'pointer',
                            mx: 0.75,
                            color: (theme) => id === appearSec.length - 1 ? theme.palette.action.disabled : theme.palette.primary.dark
                        }}
                        fontSize="small"
                    />
                </StyledIconButton>
            </Tooltip>
            <Tooltip title="Ẩn mục" placement="top">
                <StyledIconButton
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
                >
                    <VisibilityOff 
                        sx={{ cursor: 'pointer', mx: 0.75, color: (theme) => theme.palette.primary.dark }}
                        fontSize="small"
                        
                    />
                </StyledIconButton>
            </Tooltip>
            <Tooltip title="Thu gọn mục" placement="top">
                <StyledIconButton
                    onClick={() => {
                        var temp = [...openSec];
                        temp[sectionId] = false;
                        setOpenSec(temp);
                    }}
                >
                    <CloseFullscreen 
                        sx={{ 
                            cursor: 'pointer', 
                            mx: 0.75,
                            color: (theme) => !openSec[sectionId] ? theme.palette.action.disabled : theme.palette.primary.dark
                        }}
                        fontSize="small"    
                    />
                </StyledIconButton>
            </Tooltip>
            <Tooltip title="Mở rộng mục" placement="top">
                <StyledIconButton
                    onClick={() => {
                        var temp = [...openSec];
                        temp[sectionId] = true;
                        setOpenSec(temp);
                    }}
                >
                    <OpenInFull 
                        fontSize="small"
                        sx={{ 
                            cursor: 'pointer', 
                            mx: 0.75,
                            color: (theme) => openSec[sectionId] ? theme.palette.action.disabled : theme.palette.primary.dark
                        }}
                    />
                </StyledIconButton>
            </Tooltip>
        </>
    )
}

export default ToolBarSection;