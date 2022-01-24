import { Collapse, Typography, Box, Button } from "@mui/material";
import { Edit } from "@mui/icons-material";
import React, { useState } from "react";
import mdSections from "../../constants/md_sections.json";
import { useSelector } from "react-redux";
import { FTomTatBenhAn } from "../forms";

const CLTomTatBenhAn = ({ open, id }) => {
    const [edit, setEdit] = useState(false);
    const content = useSelector((state) => state.HSBA.tomTatBenhAn);
    const { role } = useSelector(state => state.auth.user);

    return (
        <Collapse in={open} timeout="auto" unmountOnExit sx={{ mb: 3 }}>
            {!edit ? 
            <>
                <Typography sx={{ mt: 2 }}>{!content ? <i>(trống)</i> : content}</Typography>

                { mdSections.canEdit[role].includes(id) && 
                <Box sx={{ width: '100%', textAlign: 'right', mt: 3 }}>
                    <Button 
                        sx={{ 
                            width: 150,
                            height: 36,
                            background: '#48B0F7', 
                            textTransform: 'none', 
                            fontWeight: 'bold',
                            color: 'white',
                            '&:hover': {
                                background: '#48B0F7', 
                            }
                        }} 
                        startIcon={<Edit fontSize="small"/>}
                        onClick={() => setEdit(!edit)}
                    >
                        Chỉnh sửa
                    </Button>
                </Box>
                }
            </>
            : <FTomTatBenhAn setEdit={setEdit} />
            }
        </Collapse>
    )
}

export default CLTomTatBenhAn;