import { Box, Typography, TextField, Grid, Divider } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import DateTimePicker from '@mui/lab/DateTimePicker';
import UserContext from "../../contexts/UserContext";
import SpellingErrorThunk from "../../redux/thunks/spellingError.thunk";
import { Button } from "../common";
import { BoxLoiChinhTa } from "../boxes";
import { UtilsText } from "../../utils";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";

const SECTION_NAME = "Chẩn đoán khi ra viện";
const CLINICAL_SUBSECTION = "Chẩn đoán";

const FChanDoanKhiRaVien = () => {
    const { chanDoanKhiRaVien, updating } = useSelector((state) => state.HSBA);
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const { confirmSec, setConfirmSec } = useContext(UserContext);
    const dispatch = useDispatch();

    const [chanDoan, setChanDoan] = useState(chanDoanKhiRaVien.chanDoan);
    const [ngayRaVien, setNgayRaVien] = useState(chanDoanKhiRaVien.ngayRaVien);
    const [result, setResult] = useState('');
    const [replaced, setReplaced] = useState([]);
    const [text, setText] = useState([]);
    const [useResult, setUseResult] = useState(false);

    useEffect(() => {
        if (updating && spellingError.changed) {
            dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION, text: chanDoan }));
        }
        // eslint-disable-next-line
    }, [updating]);

    useEffect(() => {
        if (!spellingError[CLINICAL_SUBSECTION].loading) {
            setResult(spellingError[CLINICAL_SUBSECTION]);
            setUseResult(true);
            setReplaced(spellingError[CLINICAL_SUBSECTION].correction.map(res => ({ type: "correct", repText: res[0] })));
            setText(UtilsText.getOriginalWordList(chanDoan, spellingError[CLINICAL_SUBSECTION].detection));
        }
        // eslint-disable-next-line
    }, [spellingError[CLINICAL_SUBSECTION].loading]);

    const handleReset = () => {
        setChanDoan(chanDoanKhiRaVien.chanDoan);
        setNgayRaVien(chanDoanKhiRaVien.ngayRaVien);
        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION, changed: false }));
    }

    const handleConfirm = () => {
        setConfirmSec({ ...confirmSec, [SECTION_NAME]: true });
        if (useResult) {
            let confirmed = result.detection.split(" "), count = 0;
            confirmed.forEach((word, id) => {
                if (word.includes("<mask>")) {
                    confirmed[id] = word.replace("<mask>", replaced[count].repText);
                    count++;
                }
            })
            setChanDoan(confirmed.join(" "));
        }
    }

    return (
        <Box component="form" noValidate>
            <TextField 
                multiline
                fullWidth
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
                    }
                }}
                disabled={updating && (useResult || confirmSec[SECTION_NAME] || !spellingError.changed)}
            />

            {!!result && !confirmSec[SECTION_NAME] ? 
                <BoxLoiChinhTa
                    text={text}
                    result={result}
                    replaced={replaced}
                    setReplaced={setReplaced}
                    useResult={useResult}
                    setUseResult={setUseResult}
                    setSection={() => setChanDoan(chanDoanKhiRaVien.chanDoan)}
                />
            : null}

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
                    <Button variant="outlined" sx={{ width: 150, mt: 2 }} onClick={handleReset}>Hủy</Button> : null}

                {(spellingError.changed && !confirmSec[SECTION_NAME]) && updating ? 
                    <Button onClick={handleConfirm} sx={{ width: 150, mt: 2 }}>Xác nhận</Button> : null}
            </Box>
        </Box>
    )
}

export default FChanDoanKhiRaVien;
