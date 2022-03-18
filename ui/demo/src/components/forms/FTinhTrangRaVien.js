import { Box, CircularProgress, TextField } from "@mui/material";
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
    const { confirmSec, setConfirmSec } = useContext(UserContext);
    const dispatch = useDispatch();

    const [newTinhTrangRaVien, setNewTinhTrangRaVien] = useState(tinhTrangRaVien);
    const [result, setResult] = useState('');
    const [replaced, setReplaced] = useState([]);
    const [text, setText] = useState([]);
    const [useResult, setUseResult] = useState(false);

    useEffect(() => {
        if (updating) {
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

    if (spellingError.loading && updating) {
        return (
            <Box className="df jcc">
                <CircularProgress size={20} sx={{ mt: 2, color: "#999" }} />
            </Box>
        )
    }

    const handleReset = () => {
        setNewTinhTrangRaVien(tinhTrangRaVien);
        dispatch(SpellingErrorActions.updateChanged({ section: SECTION_NAME, changed: "" }));
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
                    dispatch(SpellingErrorActions.updateChanged({ section: SECTION_NAME, changed: new Date().toISOString() }));
                }}
                disabled={useResult || confirmSec[SECTION_NAME]}
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
                {newTinhTrangRaVien !== tinhTrangRaVien && !updating ?
                    <Button variant="outlined" sx={{ width: 150, mt: 2 }} onClick={handleReset}>Hủy</Button> : null}

                {!confirmSec[SECTION_NAME] && updating ? 
                    <Button onClick={handleConfirm} sx={{ width: 150, mt: 2 }}>Xác nhận</Button> : null}
            </Box>
        </Box>
    )
}

export default FTinhTrangRaVien;
