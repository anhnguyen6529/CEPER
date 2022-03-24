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
import mdSections from "../../constants/md_sections.json";

const SECTION_NAME = "Hỏi bệnh";
const CLINICAL_SUBSECTION = mdSections[SECTION_NAME];

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
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const spellingErrorQuaTrinhBenhLy = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[0]]);
    const spellingErrorBanThan = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[1]]);
    const spellingErrorGiaDinh = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[2]]);
    const { confirmSec, setConfirmSec } = useContext(UserContext);
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
            if (spellingErrorQuaTrinhBenhLy.changed) {
                dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0], text: quaTrinhBenhLy }));
            }
            if (spellingErrorBanThan.changed) {
                dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1], text: banThan }));
            }
            if (spellingErrorGiaDinh.changed) {
                dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[2], text: giaDinh }));
            }
        }
        // eslint-disable-next-line
    }, [updating]);

    useEffect(() => {
        const tResult = [...result], tUseResult = [...useResult], tReplaced = [...replaced], tText = [...text];
        if (!spellingErrorQuaTrinhBenhLy.loading) {
            tResult[0] = spellingErrorQuaTrinhBenhLy; setResult(tResult);
            tUseResult[0] = true; setUseResult(tUseResult);
            tReplaced[0] = spellingErrorQuaTrinhBenhLy.correction.map(res => ({ type: "correct", repText: res[0] })); setReplaced(tReplaced);
            tText[0] = UtilsText.getOriginalWordList(quaTrinhBenhLy, spellingErrorQuaTrinhBenhLy.detection); setText(tText);
        }
        if (!spellingErrorBanThan.loading) {
            tResult[1] = spellingErrorBanThan; setResult(tResult);
            tUseResult[1] = true; setUseResult(tUseResult);
            tReplaced[1] = spellingErrorBanThan.correction.map(res => ({ type: "correct", repText: res[0] })); setReplaced(tReplaced);
            tText[1] = UtilsText.getOriginalWordList(banThan, spellingErrorBanThan.detection); setText(tText);
        }
        if (!spellingErrorGiaDinh.loading) {
            tResult[2] = spellingErrorGiaDinh; setResult(tResult);
            tUseResult[2] = true; setUseResult(tUseResult);
            tReplaced[2] = spellingErrorGiaDinh.correction.map(res => ({ type: "correct", repText: res[0] })); setReplaced(tReplaced);
            tText[2] = UtilsText.getOriginalWordList(giaDinh, spellingErrorGiaDinh.detection); setText(tText);
        }
        // eslint-disable-next-line
    }, [spellingErrorQuaTrinhBenhLy.loading, spellingErrorBanThan.loading, spellingErrorGiaDinh.loading]);

    const handleReset = () => {
        setQuaTrinhBenhLy(hoiBenh.quaTrinhBenhLy);
        setBanThan(hoiBenh.tienSu.banThan);
        setDacDiemLienQuan(hoiBenh.tienSu.dacDiemLienQuanBenh);
        setGiaDinh(hoiBenh.tienSu.giaDinh);
        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
        CLINICAL_SUBSECTION.forEach(subSection => dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection, changed: false })));
    }

    const handleConfirm = () => {
        setConfirmSec({ ...confirmSec, [SECTION_NAME]: true });
        CLINICAL_SUBSECTION.forEach((subSection, index) => {
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
        <Box component="form" noValidate>
            <Grid container>
                <Grid item xs={2}>
                    <Typography fontWeight="bold" sx={{ mt: '12px' }}>Quá trình bệnh lý</Typography>
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
                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0], changed: false }));
                                    if (banThan === hoiBenh.tienSu.banThan && equalsTo(dacDiemLienQuan, hoiBenh.tienSu.dacDiemLienQuanBenh) 
                                        && giaDinh === hoiBenh.tienSu.giaDinh) {
                                            dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                    }
                                } else {
                                    if (!spellingErrorQuaTrinhBenhLy.changed) {
                                        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0], changed: true }));
                                    }
                                    if (!spellingError.changed) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                    }
                                }
                            }
                        }}
                        disabled={updating && (useResult[0] || confirmSec[SECTION_NAME] || !spellingErrorQuaTrinhBenhLy.changed)}
                    />

                    {!!result[0] && !confirmSec[SECTION_NAME] ? 
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
            <Box sx={{ '.MuiListItemIcon-root': { minWidth: 24 }, '.MuiListItem-root': { pr: 0, alignItems: "flex-start" } }}>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <Circle sx={{ width: 9, color: 'black', mt: 2 }}/>
                        </ListItemIcon>
                        <ListItemText>
                            <Grid container>
                                <Grid item xs={1}>
                                    <Typography sx={{ mt: '12px' }} fontWeight="bold">Bản thân</Typography>
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
                                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1], changed: false }));
                                                    if (quaTrinhBenhLy === hoiBenh.quaTrinhBenhLy && equalsTo(dacDiemLienQuan, hoiBenh.tienSu.dacDiemLienQuanBenh)
                                                        && giaDinh === hoiBenh.tienSu.giaDinh) {
                                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                                    }
                                                } else {
                                                    if (!spellingErrorBanThan.changed) {
                                                        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1], changed: true }));
                                                    }
                                                    if (!spellingError.changed) {
                                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                                    }
                                                }
                                            }
                                        }}
                                        disabled={updating && (useResult[1] || confirmSec[SECTION_NAME] || !spellingErrorBanThan.changed)}
                                    />

                                    {!!result[1] && !confirmSec[SECTION_NAME] ? 
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
                            <Circle sx={{ width: 9, color: 'black', mt: 0.5 }}/>
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
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                    }
                                } else {
                                    if (!spellingError.changed) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                    }
                                }
                            }} 
                        /> 
                    </Box>
                    
                    <ListItem sx={{ mt: 1 }}>
                        <ListItemIcon>
                            <Circle sx={{ width: 9, color: 'black', mt: 2 }}/>
                        </ListItemIcon>
                        <ListItemText>
                            <Grid container>
                                <Grid item xs={1}>
                                    <Typography sx={{ mt: '12px' }} fontWeight="bold">Gia đình</Typography>
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
                                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[2], changed: false }));
                                                    if (quaTrinhBenhLy === hoiBenh.quaTrinhBenhLy && banThan === hoiBenh.tienSu.banThan 
                                                        && equalsTo(dacDiemLienQuan, hoiBenh.tienSu.dacDiemLienQuanBenh)) {
                                                            dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                                    }
                                                } else {
                                                    if (!spellingErrorGiaDinh.changed) {
                                                        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[2], changed: true }));
                                                    }
                                                    if (!spellingError.changed) {
                                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                                    }
                                                }
                                            }
                                        }}
                                        disabled={updating && (useResult[2] || confirmSec[SECTION_NAME] || !spellingErrorGiaDinh.changed)}
                                    />

                                    {!!result[2] && !confirmSec[SECTION_NAME] ? 
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
                {(spellingError.changed && !updating) ?
                    <Button variant="outlined" sx={{ mt: 2 }} onClick={handleReset}>Hủy</Button> : null}

                {(!confirmSec[SECTION_NAME] && (spellingErrorQuaTrinhBenhLy.changed
                    || spellingErrorBanThan.changed || spellingErrorGiaDinh.changed)) && updating ? 
                    <Button onClick={handleConfirm} sx={{ mt: 2 }}>Xác nhận</Button> : null}
            </Box>
        </Box>
    )
}

export default FHoiBenh;
