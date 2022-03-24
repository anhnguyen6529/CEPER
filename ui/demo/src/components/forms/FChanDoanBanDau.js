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

const SECTION_NAME = "Chẩn đoán ban đầu";

const FChanDoanBanDau = () => {
    const { updating, chanDoanBanDau } = useSelector((state) => state.HSBA);
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const { confirmSec, setConfirmSec } = useContext(UserContext);
    const dispatch = useDispatch();

    const [newChanDoanBanDau, setNewChanDoanBanDau] = useState(chanDoanBanDau);
    const [result, setResult] = useState('');
    const [replaced, setReplaced] = useState([]);
    const [text, setText] = useState([]);
    const [useResult, setUseResult] = useState(false);

    useEffect(() => {
        if (updating && spellingError.changed) {
            dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: "", text: newChanDoanBanDau }));
        }
        // eslint-disable-next-line
    }, [updating]);

    useEffect(() => {
        if (!spellingError.loading) {
            setResult(spellingError);
            setUseResult(true);
            setReplaced(spellingError.correction.map(res => ({ type: "correct", repText: res[0] })));
            setText(UtilsText.getOriginalWordList(newChanDoanBanDau, spellingError.detection));
        }
        // eslint-disable-next-line
    }, [spellingError.loading]);

    const handleReset = () => {
        setNewChanDoanBanDau(chanDoanBanDau);
        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
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
            setNewChanDoanBanDau(confirmed.join(" "));
        }
    }

    return (
        <Box component="form" noValidate>       
            <TextField 
                multiline
                fullWidth
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
                    setSection={() => setNewChanDoanBanDau(chanDoanBanDau)}
                />
            : null}

            <Box sx={{ width: '100%', textAlign: 'right' }}>
                {(spellingError.changed && !updating) ?
                    <Button variant="outlined" sx={{ mt: 2 }} onClick={handleReset}>Hủy</Button> : null}

                {(spellingError.changed && !confirmSec[SECTION_NAME]) && updating ? 
                    <Button onClick={handleConfirm} sx={{ mt: 2 }}>Xác nhận</Button> : null}
            </Box>
        </Box>
    )
}

export default FChanDoanBanDau;
