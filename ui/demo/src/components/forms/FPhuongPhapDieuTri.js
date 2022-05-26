import { CancelOutlined } from "@mui/icons-material";
import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import HSBAContext from "../../contexts/HSBAContext";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import SpellingErrorThunk from "../../redux/thunks/spellingError.thunk";
import "../../styles/index.css";
import { UtilsText } from "../../utils";
import { BoxLoiChinhTa } from "../boxes";
import { Button } from "../common";

const SECTION_NAME = "Phương pháp điều trị";
const SECTION_FIELD = "phuongPhapDieuTri";

const FPhuongPhapDieuTri = () => {
    const { errors, setErrors, hasClickedUpdate, tongKetBAChanged } = useContext(HSBAContext);
    const { updating, phuongPhapDieuTri } = useSelector((state) => state.HSBA);
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const { loadingError } = useSelector((state) => state.spellingError);
    const dispatch = useDispatch();

    const [newPhuongPhapDieuTri, setNewPhuongPhapDieuTri] = useState(phuongPhapDieuTri);
    const [result, setResult] = useState('');
    const [replaced, setReplaced] = useState([]);
    const [useResult, setUseResult] = useState(true);

    useEffect(() => {
        if (updating) {
            if (spellingError.changed && !loadingError) {
                dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: "", text: newPhuongPhapDieuTri }));
            }
            dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: newPhuongPhapDieuTri }));
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
        } else if (spellingError.loading) {
            setResult('');
            setReplaced([]);
        }
        // eslint-disable-next-line
    }, [spellingError.loading]);

    const handleReset = () => {
        setNewPhuongPhapDieuTri(phuongPhapDieuTri);
        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
    }

    return (
        <Box component="form" noValidate>       
            {(updating && !!result && result.correction.length > 0) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
            <TextField 
                multiline
                fullWidth
                margin={(updating && !!result && result.correction.length > 0) ? "dense" : "none"}
                value={newPhuongPhapDieuTri}
                onChange={({ target: { value } }) => {
                    setNewPhuongPhapDieuTri(value);
                    if (!updating) {
                        if (value === phuongPhapDieuTri) {
                            dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                            setErrors({ ...errors, [SECTION_NAME]: true });
                        } else {
                            if (!spellingError.changed) {
                                dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                            }
                            setErrors({ ...errors, [SECTION_NAME]: false });
                        }
                    } else {
                        dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: value }));
                    }
                }}
                disabled={updating && (useResult || !spellingError.changed)}
                inputProps={{ 'aria-label': 'phuong phap dieu tri' }}
                error={hasClickedUpdate && tongKetBAChanged && errors[SECTION_NAME]}
            />

            {(!!result && !spellingError.loading) ? 
                result.correction.length > 0 ?
                    <BoxLoiChinhTa
                        result={result}
                        replaced={replaced}
                        setReplaced={setReplaced}
                        useResult={useResult}
                        handleChangeCheckbox={(checked) => {
                            setUseResult(checked);
                            if (checked) {
                                dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: "" }));
                                dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: "", text: newPhuongPhapDieuTri }));
                            } else {
                                dispatch(HSBAActions.updateSection({
                                    section: SECTION_FIELD,
                                    data: newPhuongPhapDieuTri
                                }));
                            }
                        }}
                        handleUpdateSection={(newReplaced) => {
                            dispatch(HSBAActions.updateSection({
                                section: SECTION_FIELD,
                                data: UtilsText.replaceMaskWord(spellingError.detection, newReplaced)
                            }));
                        }}
                    />
                : null
            : ( 
                updating && spellingError.changed ? 
                    <div className="df fdc aic jcc">
                        <CircularProgress size={20} sx={{ mt: 2, mb: 1, color: (theme) => theme.palette.primary.main }} />
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

export default FPhuongPhapDieuTri;
