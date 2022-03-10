import React, { useState } from "react";
import { 
    Dialog, DialogContent, DialogTitle, Grid, Box, Paper, Typography, IconButton,
    Divider, RadioGroup, FormControlLabel, Radio, List, ListItem, ListItemText, TextField, DialogActions 
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Warning, Close } from "@mui/icons-material";
import "../../styles/index.css";
import { UtilsText } from "../../utils";
import { Button } from "../common";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";

const BORDER = '0.5px solid rgb(200, 200, 224)';

const DialogXuLyChinhTa = ({ open, setOpen }) => {
    const spellingErr = useSelector(state => state.spellingError.checked);
    const dispatch = useDispatch();

    const [errorIndex, setErrorIndex] = useState(-1);
    const [selectedError, setSelectedError] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
    const [option, setOption] = useState("");
    const [enterText, setEnterText] = useState("");    

    const handleClose = (_, reason) => {
        if (reason !== "backdropClick") {
            setOpen(false);
        }        
    }

    const handleClickWord = (index, word, correction) => {
        setErrorIndex(index);
        setSelectedError(word);
        setSuggestions(correction);
        if (correction.length > 0) {
            setOption("suggest");
        } else {
            setOption("enter")
        }
    }

    const markDetection = (str, correction, replaced, ignored, lst) => {
        if (str === "") return;
        if (str.indexOf('<') === -1) {
            lst.push(str);
            return;
        }

        let start = str.indexOf('<'), end = str.indexOf('>', start), countMarked = 0;
        lst.forEach((element) => {
            if (typeof element !== 'string') {
                countMarked++;
            }
        });  
        lst.push(str.slice(0, start)); // bgcolor: '#F8D0D0',
        if (ignored[countMarked]) {
            lst.push(str.slice(start + 1, end));
        } else {
            if (!!replaced[countMarked]) {
                lst.push(<Typography component="span" color="success" fontWeight="bold"> 
                    {str.slice(start + 1, end)}</Typography>)
            } else {
                lst.push(<Typography component="span" color="error" fontWeight="bold" sx={{ cursor: 'pointer' }} onClick={() => handleClickWord(countMarked, str.slice(start + 1, end), correction[countMarked])}> 
                    {str.slice(start + 1, end)}</Typography>)
            }
        }
        markDetection(str.slice(end + 1), correction, replaced, ignored, lst);
    }

    const getMarkList = (str, correction, replaced, ignored) => {
        let lst = [];
        markDetection(str, correction, replaced, ignored, lst);
        return lst;
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            sx={{ minWidth: 900 }}
        >
            <DialogTitle sx={{ color: '#666', borderBottom: BORDER, px: 2 }}>
                {"Thông tin bệnh án đã chỉnh sửa"}
                {open ? (
                    <IconButton size="small" onClick={handleClose} sx={{ position: 'absolute', right: 4, top: 4 }}>
                        <Close />
                    </IconButton>
                ) : null}
            </DialogTitle>
            <DialogContent sx={{ px: 0, overflowY: 'hidden', pb: 0 }}>
                <Grid container>
                    <Grid item xs={8} sx={{ p: 2, maxHeight: 450, overflowY: 'auto', borderRight: BORDER }}>
                        {Object.keys(spellingErr).map((section, id) => (
                            <Paper key={id}>
                                <Box sx={{ px: 2, py: 1, bgcolor: '#09425A', color: 'white', borderRadius: '4px 4px 0px 0px' }}>
                                    <Typography>{UtilsText.getTextSection(section)}</Typography>
                                </Box>
                                <Box sx={{ px: 2 }}>
                                    {typeof spellingErr[section].detection === 'undefined'
                                        ? Object.keys(spellingErr[section]).map((subSec, id) => (
                                            <Box sx={{ py: 1 }} key={id}>
                                                <Typography fontWeight="bold">{UtilsText.getTextSubSection(subSec)}</Typography>
                                                    {typeof spellingErr[section][subSec].detection === 'undefined'
                                                        ? (
                                                            <Divider sx={{ py: 0.5 }}/>
                                                        )
                                                        : (
                                                            <Box className="df" sx={{ py: 1 }}>
                                                                <Warning color="warning" sx={{ mr: 1 }}/>
                                                                <Typography>
                                                                    {getMarkList(spellingErr[section][subSec].detection, spellingErr[section][subSec].correction, spellingErr[section][subSec].replaced, spellingErr[section][subSec].ignored).map(mark => mark)}
                                                                </Typography>
                                                            </Box>
                                                        )
                                                    }
                                            </Box>
                                        ))
                                        : null
                                    }
                                </Box>
                            </Paper>
                        ))}
                    </Grid>
                    <Grid item xs={4} sx={{ p: 2, maxHeight: 450, overflowY: 'auto' }}>
                        <Box>
                            {!!selectedError && (
                                <>
                                    <Typography>
                                        Lỗi được chọn:{' '} 
                                        <Typography component="span" color="error" fontWeight="bold">
                                            {selectedError}
                                        </Typography>
                                    </Typography>
                                    <Divider sx={{ mt: 1.5, mb: 1 }} />
                                </>
                            )} 

                            <RadioGroup 
                                value={option} 
                                onChange={(event) => {
                                    setOption(event.target.value);
                                    setSelectedSuggestion(-1);
                                }}
                            >
                                <FormControlLabel disabled={!selectedError || suggestions.length === 0} value="suggest" control={<Radio />} label="Thay thế lỗi với từ gợi ý" />
                                {!!selectedError && suggestions.length > 0 
                                    ? (
                                        <Box sx={{ border: BORDER, borderRadius: '4px', mt: 0.5, mb: 1 }}>
                                            <List sx={{ p: 0, maxHeight: 100, overflowY: 'auto' }}>
                                                {suggestions.map((suggest, id) => (
                                                    <ListItem key={id} button sx={{ py: 0 }} onClick={() => setSelectedSuggestion(id)}>
                                                        <ListItemText sx={{ color: selectedSuggestion === id ? "#009ABB" : "black" }}>
                                                            {suggest}
                                                        </ListItemText>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    ) 
                                    : !!selectedError && <Typography sx={{ color: '#999' }}><i>(Không có từ gợi ý)</i></Typography>
                                }

                                <FormControlLabel disabled={!selectedError} value="enter" control={<Radio />} label="Thay thế lỗi thủ công" />
                                
                                {!!selectedError &&
                                    <TextField 
                                        fullWidth
                                        sx={{ mt: 0.5 }}
                                        disabled={!selectedError || option !== "enter"}
                                        value={enterText}
                                        onChange={(event) => setEnterText(event.target.value)}
                                    />
                                }
                            </RadioGroup>
                            
                            {!!selectedError && 
                                <Box sx={{ mt: 2 }} className="df jcsb">
                                    <Button 
                                        variant="outlined"
                                        onClick={() => {
                                            let tIgnored = new Array(6).fill(false);
                                            tIgnored[errorIndex] = true;
                                            dispatch(SpellingErrorActions.updateKhamBenh({
                                                subSection: 'khamToanThan',
                                                data: {
                                                    ignored: tIgnored
                                                }
                                            }))
                                        }}
                                    >
                                        Bỏ qua
                                    </Button>

                                    <Button 
                                        disabled={(option === "suggest" && selectedSuggestion < 0) || (option === "enter" && !enterText)}
                                    >
                                        Thay thế
                                    </Button>
                                </Box>
                            }
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ borderTop: BORDER, pr: 2 }}>
                <Button variant="primary-dark" sx={{ width: 150 }}>Cập nhật</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogXuLyChinhTa;