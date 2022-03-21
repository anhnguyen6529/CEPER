import { Box, Typography, TextField, Grid, Divider, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import UserContext from "../../contexts/UserContext";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import SpellingErrorThunk from "../../redux/thunks/spellingError.thunk";
import DateTimePicker from '@mui/lab/DateTimePicker';
import { UtilsText } from "../../utils";
import { BoxLoiChinhTa } from "../boxes";
import { Button } from "../common";
import mdSections from "../../constants/md_sections.json";

const SECTION_NAME = "Lý do vào viện";
const CLINICAL_SUBSECTION = mdSections[SECTION_NAME];

const FLyDoVaoVien = () => {
    const { updating, lyDoVaoVien } = useSelector((state) => state.HSBA);
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const spellingErrorLyDo = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[0]]);
    const spellingErrorChanDoan = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[1]]);
    const { confirmSec, setConfirmSec } = useContext(UserContext);
    const dispatch = useDispatch();

    const [lyDo, setLyDo] = useState(lyDoVaoVien.lyDo);
    const [ngayVaoVien, setNgayVaoVien] = useState(lyDoVaoVien.ngayVaoVien);
    const [vaoNgayThu, setVaoNgayThu] = useState(lyDoVaoVien.vaoNgayThu);
    const [chanDoanNoiGioiThieu, setChanDoanNoiGioiThieu] = useState(lyDoVaoVien.chanDoanNoiGioiThieu);
    const [noiGioiThieu, setNoiGioiThieu] = useState(lyDoVaoVien.noiGioiThieu);
    
    const [resultLyDo, setResultLyDo] = useState('');
    const [replacedLyDo, setReplacedLyDo] = useState([]);
    const [textLyDo, setTextLyDo] = useState([]);
    const [useResultLyDo, setUseResultLyDo] = useState(false);
    const [resultChanDoan, setResultChanDoan] = useState('');
    const [replacedChanDoan, setReplacedChanDoan] = useState([]);
    const [textChanDoan, setTextChanDoan] = useState([]);
    const [useResultChanDoan, setUseResultChanDoan] = useState(false);

    useEffect(() => {
        if (updating) {
            if (spellingErrorLyDo.changed) {
                dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0], text: lyDo }));
            }
            if (spellingErrorChanDoan.changed) {
                dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1], text: chanDoanNoiGioiThieu }));
            }
        }
        // eslint-disable-next-line
    }, [updating]);

    useEffect(() => {
        if (!spellingErrorLyDo.loading) {
            setResultLyDo(spellingErrorLyDo);
            setUseResultLyDo(true);
            setReplacedLyDo(spellingErrorLyDo.correction.map(res => ({ type: "correct", repText: res[0] })));
            setTextLyDo(UtilsText.getOriginalWordList(lyDo, spellingErrorLyDo.detection));
        }
        if (!spellingErrorChanDoan.loading) {
            setResultChanDoan(spellingErrorChanDoan);
            setUseResultChanDoan(true);
            setReplacedChanDoan(spellingErrorChanDoan.correction.map(res => ({ type: "correct", repText: res[0] })));
            setTextChanDoan(UtilsText.getOriginalWordList(chanDoanNoiGioiThieu, spellingErrorChanDoan.detection));
        }
        // eslint-disable-next-line
    }, [spellingErrorLyDo.loading, spellingErrorChanDoan.loading]);

    const handleReset = () => {
        setLyDo(lyDoVaoVien.lyDo);
        setNgayVaoVien(lyDoVaoVien.ngayVaoVien);
        setVaoNgayThu(lyDoVaoVien.vaoNgayThu);
        setChanDoanNoiGioiThieu(lyDoVaoVien.chanDoanNoiGioiThieu);
        setNoiGioiThieu(lyDoVaoVien.noiGioiThieu);
        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0], changed: false }));
        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1], changed: false }));
    }

    const handleConfirm = () => {
        setConfirmSec({ ...confirmSec, [SECTION_NAME]: true });
        if (useResultLyDo) {
            let confirmedLyDo = resultLyDo.detection.split(" "), countLyDo = 0;
            confirmedLyDo.forEach((word, id) => {
                if (word.includes("<mask>")) {
                    confirmedLyDo[id] = word.replace("<mask>", replacedLyDo[countLyDo].repText);
                    countLyDo++;
                }
            })
            setLyDo(confirmedLyDo.join(" "));
        }
        if (useResultChanDoan) {
            let confirmedChanDoan = resultChanDoan.detection.split(" "), countChanDoan = 0;
            confirmedChanDoan.forEach((word, id) => {
                if (word.includes("<mask>")) {
                    confirmedChanDoan[id] = word.replace("<mask>", replacedChanDoan[countChanDoan].repText);
                    countChanDoan++;
                }
            })
            setChanDoanNoiGioiThieu(confirmedChanDoan.join(" "));
        }
    }

    return (
        <Box component="form" noValidate sx={{ '.MuiGrid-container': { alignItems: 'center' } }}>
            <Grid container style={{ alignItems: "flex-start" }}>
                <Grid item xs={9}>
                    <TextField 
                        multiline
                        fullWidth
                        value={lyDo}
                        onChange={({ target: { value } }) => {
                            setLyDo(value);
                            if (!updating) {
                                if (value === lyDoVaoVien.lyDo) {
                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0], changed: false }));
                                    if (vaoNgayThu === lyDoVaoVien.vaoNgayThu && ngayVaoVien === lyDoVaoVien.ngayVaoVien
                                        && chanDoanNoiGioiThieu === lyDoVaoVien.chanDoanNoiGioiThieu && noiGioiThieu === lyDoVaoVien.noiGioiThieu) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                    }
                                } else {
                                    if (!spellingErrorLyDo.changed) {
                                        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0], changed: true }));
                                    }
                                    if (!spellingError.changed) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                    }
                                }
                            }
                        }}
                        disabled={updating && (useResultLyDo || confirmSec[SECTION_NAME] || !spellingErrorLyDo.changed)}
                    />

                    {!!resultLyDo && !confirmSec[SECTION_NAME] ? 
                        <BoxLoiChinhTa
                            text={textLyDo}
                            result={resultLyDo}
                            replaced={replacedLyDo}
                            setReplaced={setReplacedLyDo}
                            useResult={useResultLyDo}
                            setUseResult={setUseResultLyDo}
                            setSection={() => setLyDo(lyDoVaoVien.lyDo)}
                        />
                    : null}
                </Grid>
                <Grid item xs={3}>
                    <Box className="df aic jcfe" sx={{ mr: 2 }}>
                        <Typography>Vào ngày thứ</Typography>
                        <TextField 
                            type="number"
                            sx={{ width: 60, mx: 1 }}
                            InputProps={{ inputProps: { min: 0 } }}
                            value={vaoNgayThu}
                            onChange={({ target: { value } }) => {
                                setVaoNgayThu(value);
                                if (value !== lyDoVaoVien.vaoNgayThu) {
                                    if (!spellingError.changed) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                    }
                                } else {
                                    if (lyDo === lyDoVaoVien.lyDo && ngayVaoVien === lyDoVaoVien.ngayVaoVien
                                        && chanDoanNoiGioiThieu === lyDoVaoVien.chanDoanNoiGioiThieu && noiGioiThieu === lyDoVaoVien.noiGioiThieu) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                    }
                                }
                            }}
                            disabled={updating}
                        />
                        <Typography>của bệnh</Typography>
                    </Box>           
                </Grid>
            </Grid>
            <Divider sx={{ my: 2 }}/>

            <Grid container sx={{ mt: 1 }}>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Ngày vào viện</Typography>
                </Grid>
                <Grid item xs={9}>
                    <DateTimePicker
                        value={ngayVaoVien}
                        onChange={(newValue) => {
                            setNgayVaoVien(newValue);
                            if (newValue !== lyDoVaoVien.ngayVaoVien) {
                                if (!spellingError.changed) {
                                    dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                }
                            } else {
                                if (lyDo === lyDoVaoVien.lyDo && vaoNgayThu === lyDoVaoVien.vaoNgayThu
                                    && chanDoanNoiGioiThieu === lyDoVaoVien.chanDoanNoiGioiThieu && noiGioiThieu === lyDoVaoVien.noiGioiThieu) {
                                    dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                }
                            }
                        }}
                        renderInput={(params) => <TextField {...params}/>}
                        inputFormat="DD/MM/yyyy HH:mm"
                        ampm={false}
                        leftArrowButtonText=""
                        rightArrowButtonText=""
                        disabled={updating}
                    />
                </Grid>
            </Grid>
            <Grid container style={{ marginTop: 16, alignItems: "flex-start" }}>
                <Grid item xs={3}>
                    <Typography fontWeight="bold" sx={{ mt: '12px' }}>Chẩn đoán của nơi giới thiệu</Typography>
                </Grid>
                <Grid item xs={7}>
                    <TextField 
                        multiline
                        fullWidth
                        sx={{ width: '90%' }}
                        value={chanDoanNoiGioiThieu}
                        onChange={({ target: { value } }) => {
                            setChanDoanNoiGioiThieu(value);
                            if (!updating) {
                                if (value === lyDoVaoVien.chanDoanNoiGioiThieu) {
                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1], changed: false }));
                                    if (lyDo === lyDoVaoVien.lyDo && vaoNgayThu === lyDoVaoVien.vaoNgayThu 
                                        && ngayVaoVien === lyDoVaoVien.ngayVaoVien && noiGioiThieu === lyDoVaoVien.noiGioiThieu) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                    }
                                } else {
                                    if (!spellingErrorChanDoan.changed) {
                                        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1], changed: true }));
                                    }
                                    if (!spellingError.changed) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                    }
                                }
                            }
                        }}
                        disabled={updating && (useResultChanDoan || confirmSec[SECTION_NAME] || !spellingErrorChanDoan.changed)}
                    />

                    {!!resultChanDoan && !confirmSec[SECTION_NAME] ? 
                        <BoxLoiChinhTa
                            text={textChanDoan}
                            result={resultChanDoan}
                            replaced={replacedChanDoan}
                            setReplaced={setReplacedChanDoan}
                            useResult={useResultChanDoan}
                            setUseResult={setUseResultChanDoan}
                            setSection={() => setChanDoanNoiGioiThieu(lyDoVaoVien.chanDoanNoiGioiThieu)}
                        />
                    : null}
                </Grid>
                <Grid item xs={2}>
                    <RadioGroup 
                        row 
                        value={noiGioiThieu}
                        onChange={({ target: { value } }) => {
                            setNoiGioiThieu(value); 
                            if (value !== lyDoVaoVien.noiGioiThieu) {
                                if (!spellingError.changed) {
                                    dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                }
                            } else {
                                if (lyDo === lyDoVaoVien.lyDo && vaoNgayThu === lyDoVaoVien.vaoNgayThu 
                                    && ngayVaoVien === lyDoVaoVien.ngayVaoVien && chanDoanNoiGioiThieu === lyDoVaoVien.chanDoanNoiGioiThieu) {
                                    dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                }
                            }
                        }}
                    >
                        <FormControlLabel disabled={updating} value="Y tế" control={<Radio />} label="Y tế" />
                        <FormControlLabel disabled={updating} value="Tự đến" control={<Radio />} label="Tự đến" />
                    </RadioGroup>
                </Grid>
            </Grid>

            <Box sx={{ width: '100%', textAlign: 'right' }}>
                {(spellingError.changed && !updating) ?
                    <Button variant="outlined" sx={{ width: 150, mt: 2 }} onClick={handleReset}>Hủy</Button> : null}

                {(!confirmSec[SECTION_NAME] && (spellingErrorLyDo.changed || spellingErrorChanDoan.changed)) && updating ? 
                    <Button onClick={handleConfirm} sx={{ width: 150, mt: 2 }}>Xác nhận</Button> : null}
            </Box>
        </Box>
    )
}

export default FLyDoVaoVien;
