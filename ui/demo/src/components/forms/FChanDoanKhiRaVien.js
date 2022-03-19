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

const FChanDoanKhiRaVien = () => {
    const { chanDoanKhiRaVien, updating } = useSelector((state) => state.HSBA);
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const { confirmSec, setConfirmSec, hasChanged, setHasChanged } = useContext(UserContext);
    const dispatch = useDispatch();

    const [chanDoan, setChanDoan] = useState(chanDoanKhiRaVien.chanDoan);
    const [ngayRaVien, setNgayRaVien] = useState(chanDoanKhiRaVien.ngayRaVien);
    const [result, setResult] = useState('');
    const [replaced, setReplaced] = useState([]);
    const [text, setText] = useState([]);
    const [useResult, setUseResult] = useState(false);

    useEffect(() => {
        if (updating && chanDoan !== chanDoanKhiRaVien.chanDoan) {
            dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, text: chanDoan }));
        }
        // eslint-disable-next-line
    }, [updating]);

    useEffect(() => {
        if (!spellingError.loading) {
            setResult(spellingError);
            setUseResult(true);
            setReplaced(spellingError.correction.map(res => {
                return { type: "correct", repText: res[0] }
            }));
            setText(UtilsText.getOriginalWordList(chanDoan, spellingError.detection));
        }
        // eslint-disable-next-line
    }, [spellingError.loading]);

    const handleReset = () => {
        setChanDoan(chanDoanKhiRaVien.chanDoan);
        setNgayRaVien(chanDoanKhiRaVien.ngayRaVien);
        dispatch(SpellingErrorActions.updateChanged({ section: SECTION_NAME, changed: false }));
        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
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
        <Box component="form" noValidate id={SECTION_NAME}>
            <TextField 
                multiline
                fullWidth
                value={chanDoan}
                onChange={({ target: { value } }) => {
                    setChanDoan(value);
                    if (!updating) {
                        if (value === chanDoanKhiRaVien.chanDoan) {
                            dispatch(SpellingErrorActions.updateChanged({ section: SECTION_NAME, changed: false }));
                            if (ngayRaVien === chanDoanKhiRaVien.ngayRaVien) {
                                setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
                            }
                        } else {
                            if (!spellingError.changed) {
                                dispatch(SpellingErrorActions.updateChanged({ section: SECTION_NAME, changed: true }));
                            }
                            if (!hasChanged[SECTION_NAME]) {
                                setHasChanged({ ...hasChanged, [SECTION_NAME]: true });
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
                                if (!hasChanged[SECTION_NAME]) {
                                    setHasChanged({ ...hasChanged, [SECTION_NAME]: true });
                                }
                            } else {
                                if (chanDoan === chanDoanKhiRaVien.chanDoan) {
                                    setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
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
                {hasChanged[SECTION_NAME] && !updating ?
                    <Button variant="outlined" sx={{ width: 150, mt: 2 }} onClick={handleReset}>Hủy</Button> : null}

                {!confirmSec[SECTION_NAME] && updating ? 
                    <Button onClick={handleConfirm} sx={{ width: 150, mt: 2 }}>Xác nhận</Button> : null}
            </Box>
        </Box>
    )
}

export default FChanDoanKhiRaVien;
