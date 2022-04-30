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

const SECTION_NAME = "Tóm tắt bệnh án";
const SECTION_FIELD = "tomTatBenhAn";

const FTomTatBenhAn = () => {
    const { updating, tomTatBenhAn } = useSelector((state) => state.HSBA);
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const { loadingError } = useSelector((state) => state.spellingError);
    const dispatch = useDispatch();

    const [newTomTatBenhAn, setNewTomTatBenhAn] = useState(tomTatBenhAn);
    const [result, setResult] = useState('');
    const [replaced, setReplaced] = useState([]);
    const [useResult, setUseResult] = useState(true);

    useEffect(() => {
        if (updating) {
            if (spellingError.changed && !loadingError) {
                dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: "", text: newTomTatBenhAn }));
            }
            dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: newTomTatBenhAn }));
        }
        // eslint-disable-next-line
    }, [updating, loadingError]);

    useEffect(() => {
        if (!spellingError.loading && !spellingError.error) {
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
        setNewTomTatBenhAn(tomTatBenhAn);
        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
    }

    return (
        <Box component="form" noValidate>     
            {(updating && !!result) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}  
            <TextField 
                multiline
                fullWidth
                margin={(updating && !!result) ? "dense" : "none"}
                value={newTomTatBenhAn}
                onChange={({ target: { value } }) => {
                    setNewTomTatBenhAn(value);
                    if (!updating) {
                        if (value === tomTatBenhAn) {
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
                            dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: "", text: newTomTatBenhAn }));
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

export default FTomTatBenhAn;
