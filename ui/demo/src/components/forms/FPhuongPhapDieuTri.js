import { Box, CircularProgress, TextField } from "@mui/material";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserContext from "../../contexts/UserContext";
import SpellingErrorThunk from "../../redux/thunks/spellingError.thunk";
import "../../styles/index.css";
import { BoxLoiChinhTa } from "../boxes";
import { Button } from "../common";

const SECTION_NAME = "Phương pháp điều trị";

const FPhuongPhapDieuTri = () => {
    const { updating, phuongPhapDieuTri } = useSelector((state) => state.HSBA);
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const { refSec, setRefSec, changeSec, setChangeSec, confirmSec, setConfirmSec } = useContext(UserContext);
    const dispatch = useDispatch();

    const [newPhuongPhapDieuTri, setNewPhuongPhapDieuTri] = useState(phuongPhapDieuTri);
    const [result, setResult] = useState('');
    const [replaced, setReplaced] = useState([]);
    const [text, setText] = useState([]);
    const ref = useRef(null);
    const [useResult, setUseResult] = useState(false);

    useEffect(() => {
        setRefSec({ ...refSec, [SECTION_NAME]: ref });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (updating) {
            dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, text: newPhuongPhapDieuTri }));
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
            const original = newPhuongPhapDieuTri.split(' '), detected = spellingError.detection.split(' '), txt = [];
            detected.forEach((word, id) => {
                if (word.includes("<mask>")) {
                    var start = 0, endWord = word.length, endOriginal = original[id].length;
                    while (word[start] === original[id][start]) start++;
                    while (word[endWord - 1] === original[id][endOriginal - 1]) {
                        endWord--;
                        endOriginal--;
                    }
                    txt.push(original[id].slice(start, endOriginal));
                }
            })
            setText(txt);
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
        setNewPhuongPhapDieuTri(phuongPhapDieuTri);
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
            setNewPhuongPhapDieuTri(confirmed.join(" "));
        }
    }

    return (
        <Box component="form" noValidate ref={ref}>       
            <TextField 
                multiline
                fullWidth
                value={newPhuongPhapDieuTri}
                onChange={({ target: { value } }) => {
                    setNewPhuongPhapDieuTri(value);
                    setChangeSec({ ...changeSec, [SECTION_NAME]: new Date() });
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
                    setSection={() => setNewPhuongPhapDieuTri(phuongPhapDieuTri)}
                />
            : null}

            <Box sx={{ width: '100%', textAlign: 'right' }}>
                {newPhuongPhapDieuTri !== phuongPhapDieuTri && !updating ?
                    <Button variant="outlined" sx={{ width: 150, mt: 2 }} onClick={handleReset}>Hủy</Button> : null}

                {!confirmSec[SECTION_NAME] && updating ? 
                    <Button onClick={handleConfirm} sx={{ width: 150, mt: 2 }}>Xác nhận</Button> : null}
            </Box>
        </Box>
    )
}

export default FPhuongPhapDieuTri;
