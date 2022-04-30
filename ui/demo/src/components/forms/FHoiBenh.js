import { Box, Typography, TextField, Grid, List, ListItem, ListItemIcon, ListItemText, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import SpellingErrorThunk from "../../redux/thunks/spellingError.thunk";
import { BoxLoiChinhTa } from "../boxes";
import { Button } from "../common";
import { CancelOutlined, Circle } from "@mui/icons-material";
import { TDacDiemLienQuanBenh } from "../tables";
import mdSections from "../../constants/md_sections.json";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { UtilsText } from "../../utils";

const SECTION_NAME = "Hỏi bệnh";
const SECTION_FIELD = "hoiBenh";
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
    const { loadingError } = useSelector((state) => state.spellingError);
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const spellingErrorQuaTrinhBenhLy = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[0]]);
    const spellingErrorBanThan = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[1]]);
    const spellingErrorGiaDinh = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[2]]);
    const dispatch = useDispatch();

    const [quaTrinhBenhLy, setQuaTrinhBenhLy] = useState(hoiBenh.quaTrinhBenhLy);
    const [banThan, setBanThan] = useState(hoiBenh.tienSu.banThan);
    const [dacDiemLienQuan, setDacDiemLienQuan] = useState(hoiBenh.tienSu.dacDiemLienQuanBenh);
    const [giaDinh, setGiaDinh] = useState(hoiBenh.tienSu.giaDinh);

    const [result, setResult] = useState(new Array(CLINICAL_SUBSECTION.length).fill(""));
    const [replaced, setReplaced] = useState(new Array(CLINICAL_SUBSECTION.length).fill([]));
    const [useResult, setUseResult] = useState(new Array(CLINICAL_SUBSECTION.length).fill(true));

    useEffect(() => {
        if (updating) {
            if (!loadingError) {
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
            dispatch(HSBAActions.updateSection({
                section: SECTION_FIELD,
                data: { ...hoiBenh, quaTrinhBenhLy, tienSu: { ...hoiBenh.tienSu, banThan, dacDiemLienQuanBenh: dacDiemLienQuan, giaDinh } }
            }));
        }
        // eslint-disable-next-line
    }, [updating]);

    useEffect(() => {
        const tResult = [...result], tReplaced = [...replaced];
        if (!spellingErrorQuaTrinhBenhLy.loading && !spellingErrorQuaTrinhBenhLy.error) {
            tResult[0] = spellingErrorQuaTrinhBenhLy; setResult(tResult);
            tReplaced[0] = spellingErrorQuaTrinhBenhLy.correction.map(res => ({ type: "correct", repText: res[1] })); setReplaced(tReplaced);
            dispatch(HSBAActions.updateSection({
                section: SECTION_FIELD,
                data: { ...hoiBenh, quaTrinhBenhLy: UtilsText.replaceMaskWord(spellingErrorQuaTrinhBenhLy.detection, tReplaced[0]) }
            }));
        }
        if (!spellingErrorBanThan.loading && !spellingErrorBanThan.error) {
            tResult[1] = spellingErrorBanThan; setResult(tResult);
            tReplaced[1] = spellingErrorBanThan.correction.map(res => ({ type: "correct", repText: res[1] })); setReplaced(tReplaced);
            dispatch(HSBAActions.updateSection({
                section: SECTION_FIELD,
                data: { ...hoiBenh, tienSu: { ...hoiBenh.tienSu, banThan: UtilsText.replaceMaskWord(spellingErrorBanThan.detection, tReplaced[1]) } }
            }));
        }
        if (!spellingErrorGiaDinh.loading && !spellingErrorGiaDinh.error) {
            tResult[2] = spellingErrorGiaDinh; setResult(tResult);
            tReplaced[2] = spellingErrorGiaDinh.correction.map(res => ({ type: "correct", repText: res[1] })); setReplaced(tReplaced);
            dispatch(HSBAActions.updateSection({
                section: SECTION_FIELD,
                data: { ...hoiBenh, tienSu: { ...hoiBenh.tienSu, giaDinh: UtilsText.replaceMaskWord(spellingErrorGiaDinh.detection, tReplaced[2]) } }
            }));
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

    return (
        <Box component="form" noValidate>
            <Grid container>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Quá trình bệnh lý</Typography>
                </Grid>
                <Grid item xs={10}>
                    {(updating && !!result[0]) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
                    <TextField 
                        multiline
                        fullWidth
                        margin={(updating && !!result[0]) ? "dense" : "none"}
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
                            } else {
                                dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: { ...hoiBenh, quaTrinhBenhLy: value } }));
                            }
                        }}
                        disabled={updating && (useResult[0] || !spellingErrorQuaTrinhBenhLy.changed)}
                    />

                    {!!result[0] && !spellingErrorQuaTrinhBenhLy.loading ? 
                        <BoxLoiChinhTa
                            result={result[0]}
                            replaced={replaced[0]}
                            setReplaced={(newReplaced) => {
                                const tReplaced = [...replaced];
                                tReplaced[0] = newReplaced;
                                setReplaced(tReplaced);
                            }}
                            useResult={useResult[0]}
                            handleChangeCheckbox={(checked) => {
                                const tUseResult = [...useResult];
                                tUseResult[0] = checked;
                                setUseResult(tUseResult);
                                if (checked) {
                                    dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0] }));
                                    dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0], text: quaTrinhBenhLy }));
                                }
                            }}
                            handleUpdateSection={(newReplaced) => {
                                dispatch(HSBAActions.updateSection({
                                    section: SECTION_FIELD,
                                    data: { ...hoiBenh, quaTrinhBenhLy: UtilsText.replaceMaskWord(spellingErrorQuaTrinhBenhLy.detection, newReplaced) } 
                                }));
                            }}
                        />
                    : ( 
                        !!result[0] ? 
                            <div className="df fdc aic jcc">
                                <CircularProgress size={20} sx={{ mt: 2, mb: 1 }} />
                                <Typography color="primary">Đang xử lý...</Typography>
                            </div> 
                        : null
                    )}
                </Grid>
            </Grid>

            <Typography sx={{ mt: 2 }} fontWeight="bold">Tiền sử bệnh</Typography>
            <Box sx={{ '.MuiListItemIcon-root': { minWidth: 24 }, '.MuiListItem-root': { pr: 0, alignItems: "flex-start" } }}>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <Circle sx={{ width: 9, color: 'black', mt: 0.5 }}/>
                        </ListItemIcon>
                        <ListItemText>
                            <Grid container>
                                <Grid item xs={1}>
                                    <Typography fontWeight="bold">Bản thân</Typography>
                                </Grid>
                                <Grid item xs={11}>
                                    {(updating && !!result[1]) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
                                    <TextField 
                                        multiline
                                        fullWidth
                                        margin={(updating && !!result[1]) ? "dense" : "none"}
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
                                            } else {
                                                dispatch(HSBAActions.updateSection({
                                                    section: SECTION_FIELD,
                                                    data: { ...hoiBenh, tienSu: { ...hoiBenh.tienSu, banThan: value } }
                                                }));
                                            }
                                        }}
                                        disabled={updating && (useResult[1] || !spellingErrorBanThan.changed)}
                                    />

                                    {!!result[1] && !spellingErrorBanThan.loading ? 
                                        <BoxLoiChinhTa
                                            result={result[1]}
                                            replaced={replaced[1]}
                                            setReplaced={(newReplaced) => {
                                                const tReplaced = [...replaced];
                                                tReplaced[1] = newReplaced;
                                                setReplaced(tReplaced);
                                            }}
                                            useResult={useResult[1]}
                                            handleChangeCheckbox={(checked) => {
                                                const tUseResult = [...useResult];
                                                tUseResult[1] = checked;
                                                setUseResult(tUseResult);
                                                if (checked) {
                                                    dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1] }));
                                                    dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1], text: banThan }));
                                                }
                                            }}
                                            handleUpdateSection={(newReplaced) => {
                                                dispatch(HSBAActions.updateSection({
                                                    section: SECTION_FIELD,
                                                    data: { ...hoiBenh, tienSu: { ...hoiBenh.tienSu, banThan: UtilsText.replaceMaskWord(spellingErrorBanThan.detection, newReplaced) } }
                                                }));
                                            }}
                                        />
                                    : ( 
                                        !!result[1] ? 
                                            <div className="df fdc aic jcc">
                                                <CircularProgress size={20} sx={{ mt: 2, mb: 1 }} />
                                                <Typography color="primary">Đang xử lý...</Typography>
                                            </div> 
                                        : null
                                    )}
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
                            <Circle sx={{ width: 9, color: 'black', mt: 0.5 }}/>
                        </ListItemIcon>
                        <ListItemText>
                            <Grid container>
                                <Grid item xs={1}>
                                    <Typography fontWeight="bold">Gia đình</Typography>
                                </Grid>
                                <Grid item xs={11}>
                                    {(updating && !!result[2]) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
                                    <TextField 
                                        multiline
                                        fullWidth
                                        margin={(updating && !!result[2]) ? "dense" : "none"}
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
                                            } else {
                                                dispatch(HSBAActions.updateSection({
                                                    section: SECTION_FIELD,
                                                    data: { ...hoiBenh, tienSu: { ...hoiBenh.tienSu, giaDinh: value } }
                                                }));
                                            }
                                        }}
                                        disabled={updating && (useResult[2] || !spellingErrorGiaDinh.changed)}
                                    />

                                    {!!result[2] && !spellingErrorGiaDinh.loading ? 
                                        <BoxLoiChinhTa
                                            result={result[2]}
                                            replaced={replaced[2]}
                                            setReplaced={(newReplaced) => {
                                                const tReplaced = [...replaced];
                                                tReplaced[2] = newReplaced;
                                                setReplaced(tReplaced);
                                            }}
                                            useResult={useResult[2]}
                                            handleChangeCheckbox={(checked) => {
                                                const tUseResult = [...useResult];
                                                tUseResult[2] = checked;
                                                setUseResult(tUseResult);
                                                if (checked) {
                                                    dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[2] }));
                                                    dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[2], text: giaDinh }));
                                                }
                                            }}
                                            handleUpdateSection={(newReplaced) => {
                                                dispatch(HSBAActions.updateSection({
                                                    section: SECTION_FIELD,
                                                    data: { ...hoiBenh, tienSu: { ...hoiBenh.tienSu, giaDinh: UtilsText.replaceMaskWord(spellingErrorGiaDinh.detection, newReplaced) } }
                                                }));
                                            }}
                                        />
                                    : ( 
                                        !!result[2] ? 
                                            <div className="df fdc aic jcc">
                                                <CircularProgress size={20} sx={{ mt: 2, mb: 1 }} />
                                                <Typography color="primary">Đang xử lý...</Typography>
                                            </div> 
                                        : null
                                    )}
                                </Grid>
                            </Grid>
                        </ListItemText>
                    </ListItem>            
                </List>
            </Box>

            <Box sx={{ width: '100%', textAlign: 'right' }}>
                {(spellingError.changed && !updating) ?
                    <Button startIcon={<CancelOutlined />} variant="outlined" sx={{ mt: 2 }} onClick={handleReset}>Hủy</Button> 
                : null}
            </Box>
        </Box>
    )
}

export default FHoiBenh;
