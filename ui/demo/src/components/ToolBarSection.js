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

const ToolBarSection = ({ sectionId, id }) => {
    const { appearSec, setAppearSec, openSec, setOpenSec } = useContext(UserContext);

    return (
        <>
            <Tooltip title="Di chuyển lên trên" placement="top">
                <span>
                    <ArrowUpward 
                        color={id === 0 ? 'disabled' : 'secondary'}
                        sx={{ cursor: 'pointer', mx: 0.75 }}
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
                        color={id === appearSec.length - 1 ? 'disabled' : 'secondary'}
                        sx={{ cursor: 'pointer', mx: 0.75 }}
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
                        color='secondary'
                        sx={{ cursor: 'pointer', mx: 0.75 }}
                        fontSize="small"
                        onClick={() => {
                            var temp = [...appearSec];
                            temp.splice(id, 1);
                            setAppearSec(temp);
                        }}
                    />
                </span>
            </Tooltip>
            <Tooltip title="Thu gọn mục" placement="top">
                <span>
                    <CloseFullscreen 
                        color={!openSec[sectionId] ? 'disabled' : 'secondary'}
                        sx={{ cursor: 'pointer', mx: 0.75 }}
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
                        color={openSec[sectionId] ? 'disabled' : 'secondary'}
                        fontSize="small"
                        sx={{ cursor: 'pointer', mx: 0.75 }}
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