import { Box, Typography, TextField, Grid, Divider, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import DateTimePicker from '@mui/lab/DateTimePicker';
import SpellingErrorThunk from "../../redux/thunks/spellingError.thunk";
import { Button } from "../common";
import { BoxLoiChinhTa } from "../boxes";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import { CancelOutlined } from "@mui/icons-material";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { UtilsText } from "../../utils";

const SECTION_NAME = "Chẩn đoán khi ra viện";
const SECTION_FIELD = "chanDoanKhiRaVien";
const CLINICAL_SUBSECTION = "Chẩn đoán";

const FChanDoanKhiRaVien = () => {
    const { chanDoanKhiRaVien, updating } = useSelector((state) => state.HSBA);
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const dispatch = useDispatch();

    const [chanDoan, setChanDoan] = useState(chanDoanKhiRaVien.chanDoan);
    const [ngayRaVien, setNgayRaVien] = useState(chanDoanKhiRaVien.ngayRaVien);
    const [result, setResult] = useState('');
    const [replaced, setReplaced] = useState([]);
    const [useResult, setUseResult] = useState(true);

    useEffect(() => {
        if (updating) {
            if (spellingError[CLINICAL_SUBSECTION].changed) {
                dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION, text: chanDoan }));
            }
            dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: { chanDoan, ngayRaVien } }));
        }
        // eslint-disable-next-line
    }, [updating]);

    useEffect(() => {
        if (!spellingError[CLINICAL_SUBSECTION].loading) {
            setResult(spellingError[CLINICAL_SUBSECTION]);
            const tReplaced = spellingError[CLINICAL_SUBSECTION].correction.map(res => ({ type: "correct", repText: res[1] }));
            setReplaced(tReplaced);
            dispatch(HSBAActions.updateSection({
                section: SECTION_FIELD,
                data: {
                    ...chanDoanKhiRaVien,
                    chanDoan: UtilsText.replaceMaskWord(spellingError[CLINICAL_SUBSECTION].detection, tReplaced)
                }
            }));
        }
        // eslint-disable-next-line
    }, [spellingError[CLINICAL_SUBSECTION].loading]);

    const handleReset = () => {
        setChanDoan(chanDoanKhiRaVien.chanDoan);
        setNgayRaVien(chanDoanKhiRaVien.ngayRaVien);
        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION, changed: false }));
    }

    return (
        <Box component="form" noValidate>
            {(updating && !!result) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
            <TextField 
                multiline
                fullWidth
                margin={(updating && !!result) ? "dense" : "none"}
                value={chanDoan}
                onChange={({ target: { value } }) => {
                    setChanDoan(value);
                    if (!updating) {
                        if (value === chanDoanKhiRaVien.chanDoan) {
                            dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION, changed: false }));
                            if (ngayRaVien === chanDoanKhiRaVien.ngayRaVien) {
                                dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                            }
                        } else {
                            if (!spellingError[CLINICAL_SUBSECTION].changed) {
                                dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION, changed: true }));
                            }
                            if (!spellingError.changed) {
                                dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                            }
                        }
                    } else {
                        dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: { ...chanDoanKhiRaVien, chanDoan: value } }));
                    }
                }}
                disabled={updating && (useResult || !spellingError.changed)}
            />

            {!!result && !spellingError[CLINICAL_SUBSECTION].loading ? 
                <BoxLoiChinhTa
                    result={result}
                    replaced={replaced}
                    setReplaced={setReplaced}
                    useResult={useResult}
                    handleChangeCheckbox={(checked) => {
                        setUseResult(checked);
                        if (checked) {
                            dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION }));
                            dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION, text: chanDoan }));
                        }
                    }}
                    handleUpdateSection={(newReplaced) => {
                        dispatch(HSBAActions.updateSection({
                            section: SECTION_FIELD,
                            data: {
                                ...chanDoanKhiRaVien,
                                chanDoan: UtilsText.replaceMaskWord(spellingError[CLINICAL_SUBSECTION].detection, newReplaced)
                            }
                        }));
                    }}
                />
            : ( 
                !!result ? 
                    <div className="df fdc aic jcc">
                        <CircularProgress size={20} sx={{ mt: 2, mb: 1 }} />
                        <Typography color="primary">Đang xử lý...</Typography>
                    </div> 
                : null
            )}

            <Divider sx={{ my: 2 }}/>

            <Grid container sx={{ mt: 1 }} alignItems="center">
                <Grid item xs={1.5}>
                    <Typography fontWeight="bold">Ngày ra viện</Typography>
                </Grid>
                <Grid item xs={10.5}>
                    <DateTimePicker
                        value={!ngayRaVien ? null : ngayRaVien}
                        onChange={(newValue) => {
                            setNgayRaVien(new Date(newValue).toISOString());
                            if (new Date(newValue).toISOString() !== chanDoanKhiRaVien.ngayRaVien) {
                                if (!spellingError.changed) {
                                    dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                }
                            } else {
                                if (chanDoan === chanDoanKhiRaVien.chanDoan) {
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

            <Box sx={{ width: '100%', textAlign: 'right' }}>
                {(spellingError.changed && !updating) ?
                    <Button startIcon={<CancelOutlined />} variant="outlined" sx={{ mt: 2 }} onClick={handleReset}>Hủy</Button> 
                : null}
            </Box>
        </Box>
    )
}

export default FChanDoanKhiRaVien;
