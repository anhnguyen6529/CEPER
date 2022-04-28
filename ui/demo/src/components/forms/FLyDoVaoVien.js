import { Box, Typography, TextField, Grid, Divider, RadioGroup, FormControlLabel, Radio, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import SpellingErrorThunk from "../../redux/thunks/spellingError.thunk";
import DateTimePicker from '@mui/lab/DateTimePicker';
import { UtilsText } from "../../utils";
import { BoxLoiChinhTa } from "../boxes";
import { Button } from "../common";
import mdSections from "../../constants/md_sections.json";
import { CancelOutlined } from "@mui/icons-material";

const SECTION_NAME = "Lý do vào viện";
const SECTION_FIELD = "lyDoVaoVien";
const CLINICAL_SUBSECTION = mdSections[SECTION_NAME];

const FLyDoVaoVien = () => {
    const { updating, lyDoVaoVien } = useSelector((state) => state.HSBA);
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const spellingErrorLyDo = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[0]]);
    const spellingErrorChanDoan = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[1]]);
    const dispatch = useDispatch();

    const [lyDo, setLyDo] = useState(lyDoVaoVien.lyDo);
    const [vaoNgayThu, setVaoNgayThu] = useState(lyDoVaoVien.vaoNgayThu);
    const [chanDoanNoiGioiThieu, setChanDoanNoiGioiThieu] = useState(lyDoVaoVien.chanDoanNoiGioiThieu);
    const [noiGioiThieu, setNoiGioiThieu] = useState(lyDoVaoVien.noiGioiThieu);
    
    const [resultLyDo, setResultLyDo] = useState('');
    const [replacedLyDo, setReplacedLyDo] = useState([]);
    const [useResultLyDo, setUseResultLyDo] = useState(true);
    const [resultChanDoan, setResultChanDoan] = useState('');
    const [replacedChanDoan, setReplacedChanDoan] = useState([]);
    const [useResultChanDoan, setUseResultChanDoan] = useState(true);

    useEffect(() => {
        if (updating) {
            if (spellingErrorLyDo.changed) {
                dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0], text: lyDo }));
            }
            if (spellingErrorChanDoan.changed) {
                dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1], text: chanDoanNoiGioiThieu }));
            }
            dispatch(HSBAActions.updateSection({
                section: SECTION_FIELD,
                data: { ...lyDoVaoVien, lyDo, vaoNgayThu, chanDoanNoiGioiThieu, noiGioiThieu }
            }));
        }
        // eslint-disable-next-line
    }, [updating]);

    useEffect(() => {
        if (!spellingErrorLyDo.loading) {
            setResultLyDo(spellingErrorLyDo);
            const tReplacedLyDo = spellingErrorLyDo.correction.map(res => ({ type: "correct", repText: res[1] }));
            setReplacedLyDo(tReplacedLyDo);
            dispatch(HSBAActions.updateSection({
                section: SECTION_FIELD,
                data: { ...lyDoVaoVien, lyDo: UtilsText.replaceMaskWord(spellingErrorLyDo.detection, tReplacedLyDo) }
            }));
        }
        if (!spellingErrorChanDoan.loading) {
            setResultChanDoan(spellingErrorChanDoan);
            const tReplacedChanDoan = spellingErrorChanDoan.correction.map(res => ({ type: "correct", repText: res[1] }));
            setReplacedChanDoan(tReplacedChanDoan);
            dispatch(HSBAActions.updateSection({
                section: SECTION_FIELD,
                data: { ...lyDoVaoVien, chanDoanNoiGioiThieu: UtilsText.replaceMaskWord(spellingErrorChanDoan.detection, tReplacedChanDoan) }
            }));
        }
        // eslint-disable-next-line
    }, [spellingErrorLyDo.loading, spellingErrorChanDoan.loading]);

    const handleReset = () => {
        setLyDo(lyDoVaoVien.lyDo);
        setVaoNgayThu(lyDoVaoVien.vaoNgayThu);
        setChanDoanNoiGioiThieu(lyDoVaoVien.chanDoanNoiGioiThieu);
        setNoiGioiThieu(lyDoVaoVien.noiGioiThieu);
        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0], changed: false }));
        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1], changed: false }));
    }

    return (
        <Box component="form" noValidate>
            {(updating && !!resultLyDo) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
            <Grid container>
                <Grid item xs={9}>
                    <TextField 
                        multiline
                        fullWidth
                        margin={(updating && !!resultLyDo) ? "dense" : "none"}
                        value={lyDo}
                        onChange={({ target: { value } }) => {
                            setLyDo(value);
                            if (!updating) {
                                if (value === lyDoVaoVien.lyDo) {
                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0], changed: false }));
                                    if (vaoNgayThu === lyDoVaoVien.vaoNgayThu && chanDoanNoiGioiThieu === lyDoVaoVien.chanDoanNoiGioiThieu && noiGioiThieu === lyDoVaoVien.noiGioiThieu) {
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
                            } else {
                                dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: { ...lyDoVaoVien, lyDo: value } }));
                            }
                        }}
                        disabled={updating && (useResultLyDo || !spellingErrorLyDo.changed)}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Box className="df aic jcfe" sx={{ mr: 2, mt: (updating && !!resultLyDo) ? 1 : 0 }}>
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
                                    if (lyDo === lyDoVaoVien.lyDo && chanDoanNoiGioiThieu === lyDoVaoVien.chanDoanNoiGioiThieu && noiGioiThieu === lyDoVaoVien.noiGioiThieu) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                    }
                                }
                            }}
                            disabled={updating}
                        />
                        <Typography>của bệnh</Typography>
                    </Box>           
                </Grid>

                <Grid item xs={12}>
                    {!!resultLyDo && !spellingErrorLyDo.loading ? 
                        <BoxLoiChinhTa
                            result={resultLyDo}
                            replaced={replacedLyDo}
                            setReplaced={setReplacedLyDo}
                            useResult={useResultLyDo}
                            handleChangeCheckbox={(checked) => {
                                setUseResultLyDo(checked);
                                if (checked) {
                                    dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0] }));
                                    dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0], text: lyDo }));
                                }
                            }}
                            handleUpdateSection={(newReplaced) => {
                                dispatch(HSBAActions.updateSection({
                                    section: SECTION_FIELD,
                                    data: { ...lyDoVaoVien, lyDo: UtilsText.replaceMaskWord(spellingErrorLyDo.detection, newReplaced) }
                                }));
                            }}
                        />
                    : ( 
                        !!resultLyDo ? 
                            <div className="df fdc aic jcc">
                                <CircularProgress size={20} sx={{ mt: 2, mb: 1 }} />
                                <Typography color="primary">Đang xử lý...</Typography>
                            </div> 
                        : null
                    )}
                </Grid>
            </Grid>
            <Divider sx={{ my: 2 }}/>

            <Grid container sx={{ mt: 1 }}>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Ngày vào viện</Typography>
                </Grid>
                <Grid item xs={9}>
                    <DateTimePicker
                        value={lyDoVaoVien.ngayVaoVien}
                        onChange={(_) => {}}
                        renderInput={(params) => <TextField {...params}/>}
                        inputFormat="DD/MM/yyyy HH:mm"
                        ampm={false}
                        leftArrowButtonText=""
                        rightArrowButtonText=""
                        disabled
                    />
                </Grid>
            </Grid>
            <Grid container style={{ marginTop: 16 }}>
                <Grid item xs={3}>
                    <Typography fontWeight="bold">Chẩn đoán của nơi giới thiệu</Typography>
                </Grid>
                <Grid item xs={7}>
                    {(updating && !!resultChanDoan) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
                    <TextField 
                        multiline
                        fullWidth
                        margin={(updating && !!resultChanDoan) ? "dense" : "none"}
                        sx={{ width: '90%' }}
                        value={chanDoanNoiGioiThieu}
                        onChange={({ target: { value } }) => {
                            setChanDoanNoiGioiThieu(value);
                            if (!updating) {
                                if (value === lyDoVaoVien.chanDoanNoiGioiThieu) {
                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1], changed: false }));
                                    if (lyDo === lyDoVaoVien.lyDo && vaoNgayThu === lyDoVaoVien.vaoNgayThu && noiGioiThieu === lyDoVaoVien.noiGioiThieu) {
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
                            } else {
                                dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: { ...lyDoVaoVien, chanDoanNoiGioiThieu: value } }));
                            }
                        }}
                        disabled={updating && (useResultChanDoan || !spellingErrorChanDoan.changed)}
                    />

                    {!!resultChanDoan && !spellingErrorChanDoan.loading ? 
                        <BoxLoiChinhTa
                            result={resultChanDoan}
                            replaced={replacedChanDoan}
                            setReplaced={setReplacedChanDoan}
                            useResult={useResultChanDoan}
                            handleChangeCheckbox={(checked) => {
                                setUseResultChanDoan(checked);
                                if (checked) {
                                    dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1] }));
                                    dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1], text: chanDoanNoiGioiThieu }));
                                }
                            }}
                            handleUpdateSection={(newReplaced) => {
                                dispatch(HSBAActions.updateSection({
                                    section: SECTION_FIELD,
                                    data: { ...lyDoVaoVien, chanDoanNoiGioiThieu: UtilsText.replaceMaskWord(spellingErrorChanDoan.detection, newReplaced) }
                                }));
                            }}
                        />
                    : ( 
                        !!resultChanDoan ? 
                            <div className="df fdc aic jcc">
                                <CircularProgress size={20} sx={{ mt: 2, mb: 1 }} />
                                <Typography color="primary">Đang xử lý...</Typography>
                            </div> 
                        : null
                    )}
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
                                if (lyDo === lyDoVaoVien.lyDo && vaoNgayThu === lyDoVaoVien.vaoNgayThu && chanDoanNoiGioiThieu === lyDoVaoVien.chanDoanNoiGioiThieu) {
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
                    <Button startIcon={<CancelOutlined />} variant="outlined" sx={{ mt: 2 }} onClick={handleReset}>Hủy</Button> 
                : null}
            </Box>
        </Box>
    )
}

export default FLyDoVaoVien;
