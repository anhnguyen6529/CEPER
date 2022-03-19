import { Box, TextField } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserContext from "../../contexts/UserContext";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import SpellingErrorThunk from "../../redux/thunks/spellingError.thunk";
import "../../styles/index.css";
import { UtilsText } from "../../utils";
import { BoxLoiChinhTa } from "../boxes";
import { Button } from "../common";

const SECTION_NAME = "Tình trạng người bệnh ra viện";

const FTinhTrangRaVien = () => {
    const { updating, tinhTrangRaVien } = useSelector((state) => state.HSBA);
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const { confirmSec, setConfirmSec, hasChanged, setHasChanged } = useContext(UserContext);
    const dispatch = useDispatch();

    const [newTinhTrangRaVien, setNewTinhTrangRaVien] = useState(tinhTrangRaVien);
    const [result, setResult] = useState('');
    const [replaced, setReplaced] = useState([]);
    const [text, setText] = useState([]);
    const [useResult, setUseResult] = useState(false);

    useEffect(() => {
        if (updating && newTinhTrangRaVien !== tinhTrangRaVien) {
            dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, text: newTinhTrangRaVien }));
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
            setText(UtilsText.getOriginalWordList(newTinhTrangRaVien, spellingError.detection));
        }
        // eslint-disable-next-line
    }, [spellingError.loading]);

    const handleReset = () => {
        setNewTinhTrangRaVien(tinhTrangRaVien);
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
            setNewTinhTrangRaVien(confirmed.join(" "));
        }
    }

    return (
        <Box component="form" noValidate id={SECTION_NAME}>
            <TextField 
                multiline
                fullWidth
                value={tinhTrangRaVien}
                onChange={({ target: { value } }) => {
                    setNewTinhTrangRaVien(value);
                    if (!updating) {
                        if (value === tinhTrangRaVien) {
                            dispatch(SpellingErrorActions.updateChanged({ section: SECTION_NAME, changed: false }));
                            setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
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
                    setSection={() => setNewTinhTrangRaVien(tinhTrangRaVien)}
                />
            : null}

            <Box sx={{ width: '100%', textAlign: 'right' }}>
                {hasChanged[SECTION_NAME] && !updating ?
                    <Button variant="outlined" sx={{ width: 150, mt: 2 }} onClick={handleReset}>Hủy</Button> : null}

                {(spellingError.changed && !confirmSec[SECTION_NAME]) && updating ? 
                    <Button onClick={handleConfirm} sx={{ width: 150, mt: 2 }}>Xác nhận</Button> : null}
            </Box>
        </Box>
    )
}

export default FTinhTrangRaVien;
