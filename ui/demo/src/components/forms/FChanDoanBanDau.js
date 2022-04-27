import { CancelOutlined } from "@mui/icons-material";
import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import SpellingErrorThunk from "../../redux/thunks/spellingError.thunk";
import "../../styles/index.css";
import { UtilsText } from "../../utils";
import { BoxLoiChinhTa } from "../boxes";
import { Button } from "../common";

const SECTION_NAME = "Chẩn đoán ban đầu";
const SECTION_FIELD = "chanDoanBanDau";

const FChanDoanBanDau = () => {
    const { updating, chanDoanBanDau } = useSelector((state) => state.HSBA);
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const dispatch = useDispatch();

    const [newChanDoanBanDau, setNewChanDoanBanDau] = useState(chanDoanBanDau);
    const [result, setResult] = useState('');
    const [replaced, setReplaced] = useState([]);
    const [useResult, setUseResult] = useState(true);

    useEffect(() => {
        if (updating) {
            if (spellingError.changed) {
                dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: "", text: newChanDoanBanDau }));
            }
            dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: newChanDoanBanDau }));
        }
        // eslint-disable-next-line
    }, [updating]);

    useEffect(() => {
        if (!spellingError.loading) {
            setResult(spellingError);
            const tReplaced = spellingError.correction.map(res => ({ type: "correct", repText: res[1] }));
            setReplaced(tReplaced);
            dispatch(HSBAActions.updateSection({
                section: SECTION_FIELD,
                data: UtilsText.replaceMaskWord(spellingError.detection, tReplaced)
            }));
        }
        // eslint-disable-next-line
    }, [spellingError.loading]);

    const handleReset = () => {
        setNewChanDoanBanDau(chanDoanBanDau);
        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
    }

    return (
        <Box component="form" noValidate>   
            {(updating && !!result) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}    
            <TextField 
                multiline
                fullWidth
                margin={(updating && !!result) ? "dense" : "none"}
                value={newChanDoanBanDau}
                onChange={({ target: { value } }) => {
                    setNewChanDoanBanDau(value);
                    if (!updating) {
                        if (value === chanDoanBanDau) {
                            dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                        } else {
                            if (!spellingError.changed) {
                                dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                            }
                        }
                    } else {
                        dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: value }));
                    }
                }}
                disabled={updating && (useResult || !spellingError.changed)}
            />

            {!!result && !spellingError.loading ? 
                <BoxLoiChinhTa
                    result={result}
                    replaced={replaced}
                    setReplaced={setReplaced}
                    useResult={useResult}
                    handleChangeCheckbox={(checked) => {
                        setUseResult(checked);
                        if (checked) {
                            dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: "" }));
                            dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: "", text: newChanDoanBanDau }));
                        }
                    }}
                    handleUpdateSection={(newReplaced) => {
                        dispatch(HSBAActions.updateSection({
                            section: SECTION_FIELD,
                            data: UtilsText.replaceMaskWord(spellingError.detection, newReplaced)
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

            <Box sx={{ width: '100%', textAlign: 'right' }}>
                {(spellingError.changed && !updating) ?
                    <Button startIcon={<CancelOutlined />} variant="outlined" sx={{ mt: 2 }} onClick={handleReset}>Hủy</Button> 
                : null}
            </Box>
        </Box>
    )
}

export default FChanDoanBanDau;
