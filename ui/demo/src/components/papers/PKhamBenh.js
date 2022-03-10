import React from "react";
import { Paper, Box, Typography, Divider } from "@mui/material";
import { Warning } from "@mui/icons-material";
import { useSelector } from "react-redux";

const PKhamBenh = () => {
    const { checked } = useSelector(state => state.spellingError);
    const { khamBenh } = checked;

    return (
        <>
            {typeof khamBenh !== 'undefined' ? 
                <Paper key={id}>
                    <Box sx={{ px: 2, py: 1, bgcolor: '#09425A', color: 'white', borderRadius: '4px 4px 0px 0px' }}>
                        <Typography>Khám bệnh</Typography>
                    </Box>
                    <Box sx={{ px: 2 }}>
                        {Object.keys(khamBenh).map((subSec, id) => (
                                <Box sx={{ py: 1 }} key={`subSec${id}`}>
                                    <Typography fontWeight="bold">{UtilsText.getTextSubSection(subSec)}</Typography>
                                        <Box className="df" sx={{ py: 1 }}>
                                            <Warning color="warning" sx={{ mr: 1 }}/>
                                            <Typography>
                                                {/* {getMarkList(spellingErr[section][subSec].detection, spellingErr[section][subSec].correction, spellingErr[section][subSec].replaced, spellingErr[section][subSec].ignored).map(mark => mark)} */}
                                            </Typography>
                                        </Box>
                                </Box>
                            ))
                        }
                    </Box>
                </Paper>
            : null}
        </>
    )
}

export default PKhamBenh;