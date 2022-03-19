import { Box, Typography, TextField, Grid, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import UserContext from "../../contexts/UserContext";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import SpellingErrorThunk from "../../redux/thunks/spellingError.thunk";
import { UtilsText } from "../../utils";
import { BoxLoiChinhTa } from "../boxes";
import { Button } from "../common";
import { Circle } from "@mui/icons-material";
import { TDacDiemLienQuanBenh } from "../tables";

const SECTION_NAME = "Hỏi bệnh";
const CLINICAL_SUBSECTION = ["Quá trình bệnh lý", "Bản thân", "Gia đình"];

const equalsTo = (arr1, arr2) => {
    let equal = true;
    arr1.forEach((element, id) => {
        const keys = Object.keys(element);
        keys.forEach((key) => {
            if (Array.isArray(element[key])) {
                if (element[key].some((k, idx) => k !== arr2[id][key][idx])) {
                    equal = false;
                }
            } else {
                if (element[key] !== arr2[id][key]) {
                    equal = false;
                }
            }
        })
    })
    return equal;
}

const FHoiBenh = () => {
    const { updating, hoiBenh } = useSelector((state) => state.HSBA);
    const spellingErrorQuaTrinhBenhLy = useSelector((state) => state.spellingError[CLINICAL_SUBSECTION[0]]);
    const spellingErrorBanThan = useSelector((state) => state.spellingError[CLINICAL_SUBSECTION[1]]);
    const spellingErrorGiaDinh = useSelector((state) => state.spellingError[CLINICAL_SUBSECTION[2]]);
    const { confirmSec, setConfirmSec, hasChanged, setHasChanged } = useContext(UserContext);
    const dispatch = useDispatch();

    const [quaTrinhBenhLy, setQuaTrinhBenhLy] = useState(hoiBenh.quaTrinhBenhLy);
    const [banThan, setBanThan] = useState(hoiBenh.tienSu.banThan);
    const [dacDiemLienQuan, setDacDiemLienQuan] = useState(hoiBenh.tienSu.dacDiemLienQuanBenh);
    const [giaDinh, setGiaDinh] = useState(hoiBenh.tienSu.giaDinh);

    const [result, setResult] = useState(new Array(CLINICAL_SUBSECTION.length).fill(""));
    const [replaced, setReplaced] = useState(new Array(CLINICAL_SUBSECTION.length).fill([]));
    const [text, setText] = useState(new Array(CLINICAL_SUBSECTION.length).fill([]));
    const [useResult, setUseResult] = useState(new Array(CLINICAL_SUBSECTION.length).fill(false));

    useEffect(() => {
        if (updating) {
            if (quaTrinhBenhLy !== hoiBenh.quaTrinhBenhLy) {
                dispatch(SpellingErrorThunk.getProcessResult({ section: CLINICAL_SUBSECTION[0], text: quaTrinhBenhLy }));
            }
            if (banThan !== hoiBenh.tienSu.banThan) {
                dispatch(SpellingErrorThunk.getProcessResult({ section: CLINICAL_SUBSECTION[1], text: banThan }));
            }
            if (giaDinh !== hoiBenh.tienSu.giaDinh) {
                dispatch(SpellingErrorThunk.getProcessResult({ section: CLINICAL_SUBSECTION[2], text: giaDinh }));
            }
        }
        // eslint-disable-next-line
    }, [updating]);

    useEffect(() => {
        const tResult = [...result], tUseResult = [...useResult], tReplaced = [...replaced], tText = [...text];
        if (!spellingErrorQuaTrinhBenhLy.loading) {
            tResult[0] = spellingErrorQuaTrinhBenhLy; setResult(tResult);
            tUseResult[0] = true; setUseResult(tUseResult);
            tReplaced[0] = spellingErrorQuaTrinhBenhLy.correction.map(res => { return { type: "correct", repText: res[0] } }); setReplaced(tReplaced);
            tText[0] = UtilsText.getOriginalWordList(quaTrinhBenhLy, spellingErrorQuaTrinhBenhLy.detection); setText(tText);
        }
        if (!spellingErrorBanThan.loading) {
            tResult[1] = spellingErrorBanThan; setResult(tResult);
            tUseResult[1] = true; setUseResult(tUseResult);
            tReplaced[1] = spellingErrorBanThan.correction.map(res => { return { type: "correct", repText: res[0] } }); setReplaced(tReplaced);
            tText[1] = UtilsText.getOriginalWordList(banThan, spellingErrorBanThan.detection); setText(tText);
        }
        if (!spellingErrorGiaDinh.loading) {
            tResult[2] = spellingErrorGiaDinh; setResult(tResult);
            tUseResult[2] = true; setUseResult(tUseResult);
            tReplaced[2] = spellingErrorGiaDinh.correction.map(res => { return { type: "correct", repText: res[0] } }); setReplaced(tReplaced);
            tText[2] = UtilsText.getOriginalWordList(giaDinh, spellingErrorGiaDinh.detection); setText(tText);
        }
        // eslint-disable-next-line
    }, [spellingErrorQuaTrinhBenhLy.loading, spellingErrorBanThan.loading, spellingErrorGiaDinh.loading]);

    const handleReset = () => {
        setQuaTrinhBenhLy(hoiBenh.quaTrinhBenhLy);
        setBanThan(hoiBenh.tienSu.banThan);
        setDacDiemLienQuan(hoiBenh.tienSu.dacDiemLienQuanBenh);
        setGiaDinh(hoiBenh.tienSu.giaDinh);
        CLINICAL_SUBSECTION.forEach(subSection => dispatch(SpellingErrorActions.updateChanged({ section: subSection, changed: false })));
        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
    }

    const handleConfirm = () => {
        CLINICAL_SUBSECTION.forEach((subSection, index) => {
            setConfirmSec({ ...confirmSec, [subSection]: true });
            if (useResult[index]) {
                let confirmed = result[index].detection.split(" "), count = 0;
                confirmed.forEach((word, id) => {
                    if (word.includes("<mask>")) {
                        confirmed[id] = word.replace("<mask>", replaced[index][count].repText);
                        count++;
                    }
                })
                if (subSection === "Quá trình bệnh lý") setQuaTrinhBenhLy(confirmed.join(" ")); 
                else if (subSection === "Bản thân") setBanThan(confirmed.join(" "));
                else if (subSection === "Gia đình") setGiaDinh(confirmed.join(" "));
            }
        });
    }

    return (
        <Box component="form" noValidate sx={{ '.MuiGrid-container': { alignItems: 'center' } }}>
            <Grid container id={CLINICAL_SUBSECTION[0]}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Quá trình bệnh lý</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={quaTrinhBenhLy}
                        onChange={({ target: { value } }) => {
                            setQuaTrinhBenhLy(value);
                            if (!updating) {
                                if (value === hoiBenh.quaTrinhBenhLy) {
                                    dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[0], changed: false }));
                                    if (banThan === hoiBenh.tienSu.banThan && equalsTo(dacDiemLienQuan, hoiBenh.tienSu.dacDiemLienQuanBenh) 
                                        && giaDinh === hoiBenh.tienSu.giaDinh) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
                                    }
                                } else {
                                    if (!spellingErrorQuaTrinhBenhLy.changed) {
                                        dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[0], changed: true }));
                                    }
                                    if (!hasChanged[SECTION_NAME]) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: true });
                                    }
                                }
                            }
                        }}
                        disabled={updating && (useResult[0] || confirmSec[CLINICAL_SUBSECTION[0]] || !spellingErrorQuaTrinhBenhLy.changed)}
                    />

                    {!!result[0] && !confirmSec[CLINICAL_SUBSECTION[0]] ? 
                        <BoxLoiChinhTa
                            text={text[0]}
                            result={result[0]}
                            replaced={replaced[0]}
                            setReplaced={(newReplaced) => {
                                const tReplaced = [...replaced];
                                tReplaced[0] = newReplaced;
                                setReplaced(tReplaced);
                            }}
                            useResult={useResult[0]}
                            setUseResult={(newUseResult) => {
                                const tUseResult = [...useResult];
                                tUseResult[0] = newUseResult;
                                setUseResult(tUseResult);
                            }}
                            setSection={() => setQuaTrinhBenhLy(hoiBenh.quaTrinhBenhLy)}
                        />
                    : null}
                </Grid>
            </Grid>

            <Typography sx={{ mt: 2 }} fontWeight="bold">Tiền sử bệnh</Typography>
            <Box sx={{ '.MuiListItemIcon-root': { minWidth: 24 }, '.MuiListItem-root': { pr: 0 } }}>
                <List>
                    <ListItem id="Bản thân">
                        <ListItemIcon>
                            <Circle sx={{ width: 9, color: 'black' }}/>
                        </ListItemIcon>
                        <ListItemText>
                            <Grid container>
                                <Grid item xs={1}>
                                    <Typography fontWeight="bold">Bản thân</Typography>
                                </Grid>
                                <Grid item xs={11}>
                                    <TextField 
                                        multiline
                                        fullWidth
                                        value={banThan}
                                        onChange={({ target: { value } }) => {
                                            setBanThan(value);
                                            if (!updating) {
                                                if (value === hoiBenh.tienSu.banThan) {
                                                    dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[1], changed: false }));
                                                    if (quaTrinhBenhLy === hoiBenh.quaTrinhBenhLy && equalsTo(dacDiemLienQuan, hoiBenh.tienSu.dacDiemLienQuanBenh)
                                                        && giaDinh === hoiBenh.tienSu.giaDinh) {
                                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
                                                    }
                                                } else {
                                                    if (!spellingErrorBanThan.changed) {
                                                        dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[1], changed: true }));
                                                    }
                                                    if (!hasChanged[SECTION_NAME]) {
                                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: true });
                                                    }
                                                }
                                            }
                                        }}
                                        disabled={updating && (useResult[1] || confirmSec[CLINICAL_SUBSECTION[1]] || !spellingErrorBanThan.changed)}
                                    />

                                    {!!result[1] && !confirmSec[CLINICAL_SUBSECTION[1]] ? 
                                        <BoxLoiChinhTa
                                            text={text[1]}
                                            result={result[1]}
                                            replaced={replaced[1]}
                                            setReplaced={(newReplaced) => {
                                                const tReplaced = [...replaced];
                                                tReplaced[1] = newReplaced;
                                                setReplaced(tReplaced);
                                            }}
                                            useResult={useResult[1]}
                                            setUseResult={(newUseResult) => {
                                                const tUseResult = [...useResult];
                                                tUseResult[1] = newUseResult;
                                                setUseResult(tUseResult);
                                            }}
                                            setSection={() => setBanThan(hoiBenh.tienSu.banThan)}
                                        />
                                    : null}
                                </Grid>
                            </Grid>
                        </ListItemText>
                    </ListItem>

                    <ListItem>
                        <ListItemIcon>
                            <Circle sx={{ width: 9, color: 'black' }}/>
                        </ListItemIcon>
                        <ListItemText>
                            <Typography fontWeight="bold">Đặc điểm liên quan bệnh</Typography>
                        </ListItemText>
                    </ListItem>
                    <Box sx={{ ml: 5 }}>
                        <TDacDiemLienQuanBenh 
                            dacDiemLienQuan={dacDiemLienQuan} 
                            setDacDiemLienQuan={setDacDiemLienQuan} 
                            handleChange={(value) => {
                                if (equalsTo(value, hoiBenh.tienSu.dacDiemLienQuanBenh)) {
                                    if (quaTrinhBenhLy === hoiBenh.quaTrinhBenhLy && banThan === hoiBenh.tienSu.banThan && giaDinh === hoiBenh.tienSu.giaDinh) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
                                    }
                                } else {
                                    if (!hasChanged[SECTION_NAME]) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: true });
                                    }
                                }
                            }} 
                        /> 
                    </Box>
                    
                    <ListItem sx={{ mt: 1 }} id="Gia đình">
                        <ListItemIcon>
                            <Circle sx={{ width: 9, color: 'black' }}/>
                        </ListItemIcon>
                        <ListItemText>
                            <Grid container>
                                <Grid item xs={1}>
                                    <Typography fontWeight="bold">Gia đình</Typography>
                                </Grid>
                                <Grid item xs={11}>
                                    <TextField 
                                        multiline
                                        fullWidth
                                        value={giaDinh}
                                        onChange={({ target: { value } }) => {
                                            setGiaDinh(value);
                                            if (!updating) {
                                                if (value === hoiBenh.tienSu.giaDinh) {
                                                    dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[2], changed: false }));
                                                    if (quaTrinhBenhLy === hoiBenh.quaTrinhBenhLy && banThan === hoiBenh.tienSu.banThan 
                                                        && equalsTo(dacDiemLienQuan, hoiBenh.tienSu.dacDiemLienQuanBenh)) {
                                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
                                                    }
                                                } else {
                                                    if (!spellingErrorGiaDinh.changed) {
                                                        dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[2], changed: true }));
                                                    }
                                                    if (!hasChanged[SECTION_NAME]) {
                                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: true });
                                                    }
                                                }
                                            }
                                        }}
                                        disabled={updating && (useResult[2] || confirmSec[CLINICAL_SUBSECTION[2]] || !spellingErrorGiaDinh.changed)}
                                    />

                                    {!!result[2] && !confirmSec[CLINICAL_SUBSECTION[2]] ? 
                                        <BoxLoiChinhTa
                                            text={text[2]}
                                            result={result[2]}
                                            replaced={replaced[2]}
                                            setReplaced={(newReplaced) => {
                                                const tReplaced = [...replaced];
                                                tReplaced[2] = newReplaced;
                                                setReplaced(tReplaced);
                                            }}
                                            useResult={useResult[2]}
                                            setUseResult={(newUseResult) => {
                                                const tUseResult = [...useResult];
                                                tUseResult[2] = newUseResult;
                                                setUseResult(tUseResult);
                                            }}
                                            setSection={() => setGiaDinh(hoiBenh.tienSu.giaDinh)}
                                        />
                                    : null}
                                </Grid>
                            </Grid>
                        </ListItemText>
                    </ListItem>            
                </List>
            </Box>

            <Box sx={{ width: '100%', textAlign: 'right' }}>
                {hasChanged[SECTION_NAME] && !updating ?
                    <Button variant="outlined" sx={{ width: 150, mt: 2 }} onClick={handleReset}>Hủy</Button> : null}

                {((spellingErrorQuaTrinhBenhLy.changed && !confirmSec[CLINICAL_SUBSECTION[0]]) 
                    || (spellingErrorBanThan.changed && !confirmSec[CLINICAL_SUBSECTION[1]])
                    || (spellingErrorGiaDinh.changed && !confirmSec[CLINICAL_SUBSECTION[2]])) && updating ? 
                    <Button onClick={handleConfirm} sx={{ width: 150, mt: 2 }}>Xác nhận</Button> : null}
            </Box>
        </Box>
    )
}

export default FHoiBenh;
