import { Box, Typography, TextField, Grid } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import UserContext from "../../contexts/UserContext";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import SpellingErrorThunk from "../../redux/thunks/spellingError.thunk";
import { UtilsText } from "../../utils";
import { BoxLoiChinhTa } from "../boxes";
import { Button } from "../common";

const SECTION_NAME = "Khám bệnh";
const CLINICAL_SUBSECTION = ["Khám toàn thân", "Tuần hoàn", "Hô hấp", "Tiêu hóa", "Thận - Tiết niệu - Sinh dục", "Thần kinh", 
    "Cơ - Xương - Khớp", "Tai - Mũi - Họng", "Răng - Hàm - Mặt", "Mắt", "Nội tiết, dinh dưỡng và các bệnh lý khác"];

const FKhamBenh = () => {
    const { updating, khamBenh } = useSelector((state) => state.HSBA);
    const spellingError = useSelector((state) => state.spellingError);
    const spellingErrorLoading = useSelector((state) => CLINICAL_SUBSECTION.map(subSection => state.spellingError[subSection].loading));
    const { confirmSec, setConfirmSec, hasChanged, setHasChanged } = useContext(UserContext);
    const dispatch = useDispatch();

    const [khamToanThan, setKhamToanThan] = useState(khamBenh.khamToanThan);
    const [tuanHoan, setTuanHoan] = useState(khamBenh.tuanHoan);
    const [hoHap, setHoHap] = useState(khamBenh.hoHap);
    const [tieuHoa, setTieuHoa] = useState(khamBenh.tieuHoa);
    const [than, setThan] = useState(khamBenh.than);
    const [thanKinh, setThanKinh] = useState(khamBenh.thanKinh);
    const [coXuongKhop, setCoXuongKhop] = useState(khamBenh.coXuongKhop);
    const [taiMuiHong, setTaiMuiHong] = useState(khamBenh.taiMuiHong);
    const [rangHamMat, setRangHamMat] = useState(khamBenh.rangHamMat);
    const [mat, setMat] = useState(khamBenh.mat);
    const [noiTiet, setNoiTiet] = useState(khamBenh.noiTiet);

    const [result, setResult] = useState(new Array(CLINICAL_SUBSECTION.length).fill(""));
    const [replaced, setReplaced] = useState(new Array(CLINICAL_SUBSECTION.length).fill([]));
    const [text, setText] = useState(new Array(CLINICAL_SUBSECTION.length).fill([]));
    const [useResult, setUseResult] = useState(new Array(CLINICAL_SUBSECTION.length).fill(false));

    useEffect(() => {
        if (updating) {
            if (khamToanThan !== khamBenh.khamToanThan) dispatch(SpellingErrorThunk.getProcessResult({ section: CLINICAL_SUBSECTION[0], text: khamToanThan }));
            if (tuanHoan !== khamBenh.tuanHoan) dispatch(SpellingErrorThunk.getProcessResult({ section: CLINICAL_SUBSECTION[1], text: tuanHoan }));
            if (hoHap !== khamBenh.hoHap) dispatch(SpellingErrorThunk.getProcessResult({ section: CLINICAL_SUBSECTION[2], text: hoHap }));
            if (tieuHoa !== khamBenh.tieuHoa) dispatch(SpellingErrorThunk.getProcessResult({ section: CLINICAL_SUBSECTION[3], text: tieuHoa }));
            if (than !== khamBenh.than) dispatch(SpellingErrorThunk.getProcessResult({ section: CLINICAL_SUBSECTION[4], text: than }));
            if (thanKinh !== khamBenh.thanKinh) dispatch(SpellingErrorThunk.getProcessResult({ section: CLINICAL_SUBSECTION[5], text: thanKinh }));
            if (coXuongKhop !== khamBenh.coXuongKhop) dispatch(SpellingErrorThunk.getProcessResult({ section: CLINICAL_SUBSECTION[6], text: coXuongKhop }));
            if (taiMuiHong !== khamBenh.taiMuiHong) dispatch(SpellingErrorThunk.getProcessResult({ section: CLINICAL_SUBSECTION[7], text: taiMuiHong }));
            if (rangHamMat !== khamBenh.rangHamMat) dispatch(SpellingErrorThunk.getProcessResult({ section: CLINICAL_SUBSECTION[8], text: rangHamMat }));
            if (mat !== khamBenh.mat) dispatch(SpellingErrorThunk.getProcessResult({ section: CLINICAL_SUBSECTION[9], text: mat }));
            if (noiTiet !== khamBenh.noiTiet) dispatch(SpellingErrorThunk.getProcessResult({ section: CLINICAL_SUBSECTION[10], text: noiTiet }));
        }
        // eslint-disable-next-line
    }, [updating]);

    useEffect(() => {
        const tResult = [...result], tUseResult = [...useResult], tReplaced = [...replaced], tText = [...text];
        CLINICAL_SUBSECTION.forEach((subSection, id) => {
            if (!spellingError[subSection].loading) {
                tResult[id] = spellingError[subSection]; setResult(tResult);
                tUseResult[id] = true; setUseResult(tUseResult);
                tReplaced[id] = spellingError[subSection].correction.map(res => { return { type: "correct", repText: res[0] } }); setReplaced(tReplaced);
                if (subSection === "Khám toàn thân") tText[id] = UtilsText.getOriginalWordList(khamToanThan, spellingError[subSection].detection);
                else if (subSection === "Tuần hoàn") tText[id] = UtilsText.getOriginalWordList(tuanHoan, spellingError[subSection].detection);
                else if (subSection === "Hô hấp") tText[id] = UtilsText.getOriginalWordList(hoHap, spellingError[subSection].detection);
                else if (subSection === "Tiêu hóa") tText[id] = UtilsText.getOriginalWordList(tieuHoa, spellingError[subSection].detection);
                else if (subSection === "Thận") tText[id] = UtilsText.getOriginalWordList(than, spellingError[subSection].detection);
                else if (subSection === "Thần kinh") tText[id] = UtilsText.getOriginalWordList(thanKinh, spellingError[subSection].detection);
                else if (subSection === "Cơ - Xương - Khớp") tText[id] = UtilsText.getOriginalWordList(coXuongKhop, spellingError[subSection].detection);
                else if (subSection === "Tai - Mũi - Họng") tText[id] = UtilsText.getOriginalWordList(taiMuiHong, spellingError[subSection].detection);
                else if (subSection === "Răng - Hàm - Mặt") tText[id] = UtilsText.getOriginalWordList(rangHamMat, spellingError[subSection].detection);
                else if (subSection === "Mắt") tText[id] = UtilsText.getOriginalWordList(mat, spellingError[subSection].detection);
                else if (subSection === "Nội tiết") tText[id] = UtilsText.getOriginalWordList(noiTiet, spellingError[subSection].detection);
                setText(tText);
            }
        });
        // eslint-disable-next-line
    }, [spellingErrorLoading]);

    const handleReset = () => {
        setKhamToanThan(khamBenh.khamToanThan);
        setTuanHoan(khamBenh.tuanHoan);
        setHoHap(khamBenh.hoHap);
        setTieuHoa(khamBenh.tieuHoa);
        setThan(khamBenh.than);
        setThanKinh(khamBenh.thanKinh);
        setCoXuongKhop(khamBenh.coXuongKhop);
        setTaiMuiHong(khamBenh.taiMuiHong);
        setRangHamMat(khamBenh.rangHamMat);
        setMat(khamBenh.mat);
        setNoiTiet(khamBenh.noiTiet);
        CLINICAL_SUBSECTION.forEach(subSection => dispatch(SpellingErrorActions.updateChanged({ section: subSection, changed: false })));
        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
    }

    const handleConfirm = () => {
        CLINICAL_SUBSECTION.forEach((subSection, index) => {
            setConfirmSec({ ...confirmSec, [subSection]: true });
            if (useResult[index]) {
                let confirmed = result[index].detection.split(" "), count = 0;
                confirmed.forEach((word, id) => {
                    if (word.includes("<mask>")) {
                        confirmed[id] = word.replace("<mask>", replaced[index][count].repText);
                        count++;
                    }
                });
                if (subSection === "Khám toàn thân") setKhamToanThan(confirmed.join(" "));
                else if (subSection === "Tuần hoàn") setTuanHoan(confirmed.join(" "));
                else if (subSection === "Hô hấp") setHoHap(confirmed.join(" "));
                else if (subSection === "Tiêu hóa") setTieuHoa(confirmed.join(" "));
                else if (subSection === "Thận") setThan(confirmed.join(" "));
                else if (subSection === "Thần kinh") setThanKinh(confirmed.join(" "));
                else if (subSection === "Cơ - Xương - Khớp") setCoXuongKhop(confirmed.join(" "));
                else if (subSection === "Tai - Mũi - Họng") setTaiMuiHong(confirmed.join(" "));
                else if (subSection === "Răng - Hàm - Mặt") setRangHamMat(confirmed.join(" "));
                else if (subSection === "Mắt") setMat(confirmed.join(" "));
                else if (subSection === "Nội tiết") setNoiTiet(confirmed.join(" "));
            }
        });
    }

    return (
        <Box component="form" noValidate sx={{ '.MuiGrid-container': { alignItems: 'center' } }}>
            <Grid container id={CLINICAL_SUBSECTION[0]}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Khám toàn thân</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={khamToanThan}
                        onChange={({ target: { value } }) => {
                            setKhamToanThan(value);
                            if (!updating) {
                                if (value === khamBenh.khamToanThan) {
                                    dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[0], changed: false }));
                                    if (tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa && than === khamBenh.than
                                        && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop && taiMuiHong === khamBenh.taiMuiHong
                                        && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[0]].changed) {
                                        dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[0], changed: true }));
                                    }
                                    if (!hasChanged[SECTION_NAME]) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: true });
                                    }
                                }
                            }
                        }}
                        disabled={updating && (useResult[0] || confirmSec[CLINICAL_SUBSECTION[0]] || !spellingError[CLINICAL_SUBSECTION[0]].changed)}
                    />

                    {!!result[0] && !confirmSec[CLINICAL_SUBSECTION[0]] ? 
                        <BoxLoiChinhTa
                            text={text[0]}
                            result={result[0]}
                            replaced={replaced[0]}
                            setReplaced={(newReplaced) => {
                                const tReplaced = [...replaced];
                                tReplaced[0] = newReplaced;
                                setReplaced(tReplaced);
                            }}
                            useResult={useResult[0]}
                            setUseResult={(newUseResult) => {
                                const tUseResult = [...useResult];
                                tUseResult[0] = newUseResult;
                                setUseResult(tUseResult);
                            }}
                            setSection={() => setKhamToanThan(khamBenh.khamToanThan)}
                        />
                    : null}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }} id={CLINICAL_SUBSECTION[1]}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Tuần hoàn</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={tuanHoan}
                        onChange={({ target: { value } }) => {
                            setTuanHoan(value);
                            if (!updating) {
                                if (value === khamBenh.tuanHoan) {
                                    dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[1], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa && than === khamBenh.than
                                        && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop && taiMuiHong === khamBenh.taiMuiHong
                                        && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[1]].changed) {
                                        dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[1], changed: true }));
                                    }
                                    if (!hasChanged[SECTION_NAME]) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: true });
                                    }
                                }
                            }
                        }}
                        disabled={updating && (useResult[1] || confirmSec[CLINICAL_SUBSECTION[1]] || !spellingError[CLINICAL_SUBSECTION[1]].changed)}
                    />

                    {!!result[1] && !confirmSec[CLINICAL_SUBSECTION[1]] ? 
                        <BoxLoiChinhTa
                            text={text[1]}
                            result={result[1]}
                            replaced={replaced[1]}
                            setReplaced={(newReplaced) => {
                                const tReplaced = [...replaced];
                                tReplaced[1] = newReplaced;
                                setReplaced(tReplaced);
                            }}
                            useResult={useResult[1]}
                            setUseResult={(newUseResult) => {
                                const tUseResult = [...useResult];
                                tUseResult[1] = newUseResult;
                                setUseResult(tUseResult);
                            }}
                            setSection={() => setTuanHoan(khamBenh.tuanHoan)}
                        />
                    : null}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }} id={CLINICAL_SUBSECTION[2]}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Hô hấp</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={hoHap}
                        onChange={({ target: { value } }) => {
                            setHoHap(value);
                            if (!updating) {
                                if (value === khamBenh.hoHap) {
                                    dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[2], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && tieuHoa === khamBenh.tieuHoa && than === khamBenh.than
                                        && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop && taiMuiHong === khamBenh.taiMuiHong
                                        && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[2]].changed) {
                                        dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[2], changed: true }));
                                    }
                                    if (!hasChanged[SECTION_NAME]) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: true });
                                    }
                                }
                            }
                        }}
                        disabled={updating && (useResult[2] || confirmSec[CLINICAL_SUBSECTION[2]] || !spellingError[CLINICAL_SUBSECTION[2]].changed)}
                    />

                    {!!result[2] && !confirmSec[CLINICAL_SUBSECTION[2]] ? 
                        <BoxLoiChinhTa
                            text={text[2]}
                            result={result[2]}
                            replaced={replaced[2]}
                            setReplaced={(newReplaced) => {
                                const tReplaced = [...replaced];
                                tReplaced[2] = newReplaced;
                                setReplaced(tReplaced);
                            }}
                            useResult={useResult[2]}
                            setUseResult={(newUseResult) => {
                                const tUseResult = [...useResult];
                                tUseResult[2] = newUseResult;
                                setUseResult(tUseResult);
                            }}
                            setSection={() => setHoHap(khamBenh.hoHap)}
                        />
                    : null}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }} id={CLINICAL_SUBSECTION[3]}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Tiêu hóa</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={tieuHoa}
                        onChange={({ target: { value } }) => {
                            setTieuHoa(value);
                            if (!updating) {
                                if (value === khamBenh.tieuHoa) {
                                    dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[3], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && than === khamBenh.than
                                        && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop && taiMuiHong === khamBenh.taiMuiHong
                                        && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[3]].changed) {
                                        dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[3], changed: true }));
                                    }
                                    if (!hasChanged[SECTION_NAME]) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: true });
                                    }
                                }
                            }
                        }}
                        disabled={updating && (useResult[3] || confirmSec[CLINICAL_SUBSECTION[3]] || !spellingError[CLINICAL_SUBSECTION[3]].changed)}
                    />

                    {!!result[3] && !confirmSec[CLINICAL_SUBSECTION[3]] ? 
                        <BoxLoiChinhTa
                            text={text[3]}
                            result={result[3]}
                            replaced={replaced[3]}
                            setReplaced={(newReplaced) => {
                                const tReplaced = [...replaced];
                                tReplaced[3] = newReplaced;
                                setReplaced(tReplaced);
                            }}
                            useResult={useResult[3]}
                            setUseResult={(newUseResult) => {
                                const tUseResult = [...useResult];
                                tUseResult[3] = newUseResult;
                                setUseResult(tUseResult);
                            }}
                            setSection={() => setTieuHoa(khamBenh.tieuHoa)}
                        />
                    : null}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }} id={CLINICAL_SUBSECTION[4]}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Thận - Tiết niệu - Sinh dục</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={than}
                        onChange={({ target: { value } }) => {
                            setThan(value);
                            if (!updating) {
                                if (value === khamBenh.than) {
                                    dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[4], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa
                                        && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop && taiMuiHong === khamBenh.taiMuiHong
                                        && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[4]].changed) {
                                        dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[4], changed: true }));
                                    }
                                    if (!hasChanged[SECTION_NAME]) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: true });
                                    }
                                }
                            }
                        }}
                        disabled={updating && (useResult[4] || confirmSec[CLINICAL_SUBSECTION[4]] || !spellingError[CLINICAL_SUBSECTION[4]].changed)}
                    />

                    {!!result[4] && !confirmSec[CLINICAL_SUBSECTION[4]] ? 
                        <BoxLoiChinhTa
                            text={text[4]}
                            result={result[4]}
                            replaced={replaced[4]}
                            setReplaced={(newReplaced) => {
                                const tReplaced = [...replaced];
                                tReplaced[4] = newReplaced;
                                setReplaced(tReplaced);
                            }}
                            useResult={useResult[4]}
                            setUseResult={(newUseResult) => {
                                const tUseResult = [...useResult];
                                tUseResult[4] = newUseResult;
                                setUseResult(tUseResult);
                            }}
                            setSection={() => setThan(khamBenh.than)}
                        />
                    : null}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }} id={CLINICAL_SUBSECTION[5]}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Thần kinh</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={thanKinh}
                        onChange={({ target: { value } }) => {
                            setThanKinh(value);
                            if (!updating) {
                                if (value === khamBenh.thanKinh) {
                                    dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[5], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa 
                                        && than === khamBenh.than && coXuongKhop === khamBenh.coXuongKhop && taiMuiHong === khamBenh.taiMuiHong
                                        && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[5]].changed) {
                                        dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[5], changed: true }));
                                    }
                                    if (!hasChanged[SECTION_NAME]) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: true });
                                    }
                                }
                            }
                        }}
                        disabled={updating && (useResult[5] || confirmSec[CLINICAL_SUBSECTION[5]] || !spellingError[CLINICAL_SUBSECTION[5]].changed)}
                    />
                    
                    {!!result[5] && !confirmSec[CLINICAL_SUBSECTION[5]] ? 
                        <BoxLoiChinhTa
                            text={text[5]}
                            result={result[5]}
                            replaced={replaced[5]}
                            setReplaced={(newReplaced) => {
                                const tReplaced = [...replaced];
                                tReplaced[5] = newReplaced;
                                setReplaced(tReplaced);
                            }}
                            useResult={useResult[5]}
                            setUseResult={(newUseResult) => {
                                const tUseResult = [...useResult];
                                tUseResult[5] = newUseResult;
                                setUseResult(tUseResult);
                            }}
                            setSection={() => setThanKinh(khamBenh.thanKinh)}
                        />
                    : null}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }} id={CLINICAL_SUBSECTION[6]}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Cơ - Xương - Khớp</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={coXuongKhop}
                        onChange={({ target: { value } }) => {
                            setCoXuongKhop(value);
                            if (!updating) {
                                if (value === khamBenh.coXuongKhop) {
                                    dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[6], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa 
                                        && than === khamBenh.than && thanKinh === khamBenh.thanKinh && taiMuiHong === khamBenh.taiMuiHong
                                        && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[6]].changed) {
                                        dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[6], changed: true }));
                                    }
                                    if (!hasChanged[SECTION_NAME]) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: true });
                                    }
                                }
                            }
                        }}
                        disabled={updating && (useResult[6] || confirmSec[CLINICAL_SUBSECTION[6]] || !spellingError[CLINICAL_SUBSECTION[6]].changed)}
                    />

                    {!!result[6] && !confirmSec[CLINICAL_SUBSECTION[6]] ? 
                        <BoxLoiChinhTa
                            text={text[6]}
                            result={result[6]}
                            replaced={replaced[6]}
                            setReplaced={(newReplaced) => {
                                const tReplaced = [...replaced];
                                tReplaced[6] = newReplaced;
                                setReplaced(tReplaced);
                            }}
                            useResult={useResult[6]}
                            setUseResult={(newUseResult) => {
                                const tUseResult = [...useResult];
                                tUseResult[6] = newUseResult;
                                setUseResult(tUseResult);
                            }}
                            setSection={() => setCoXuongKhop(khamBenh.coXuongKhop)}
                        />
                    : null}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }} id={CLINICAL_SUBSECTION[7]}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Tai - Mũi - Họng</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={taiMuiHong}
                        onChange={({ target: { value } }) => {
                            setTaiMuiHong(value);
                            if (!updating) {
                                if (value === khamBenh.taiMuiHong) {
                                    dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[7], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa 
                                        && than === khamBenh.than && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop
                                        && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[7]].changed) {
                                        dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[7], changed: true }));
                                    }
                                    if (!hasChanged[SECTION_NAME]) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: true });
                                    }
                                }
                            }
                        }}
                        disabled={updating && (useResult[7] || confirmSec[CLINICAL_SUBSECTION[7]] || !spellingError[CLINICAL_SUBSECTION[7]].changed)}
                    />

                    {!!result[7] && !confirmSec[CLINICAL_SUBSECTION[7]] ? 
                        <BoxLoiChinhTa
                            text={text[7]}
                            result={result[7]}
                            replaced={replaced[7]}
                            setReplaced={(newReplaced) => {
                                const tReplaced = [...replaced];
                                tReplaced[7] = newReplaced;
                                setReplaced(tReplaced);
                            }}
                            useResult={useResult[7]}
                            setUseResult={(newUseResult) => {
                                const tUseResult = [...useResult];
                                tUseResult[7] = newUseResult;
                                setUseResult(tUseResult);
                            }}
                            setSection={() => setTaiMuiHong(khamBenh.taiMuiHong)}
                        />
                    : null}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }} id={CLINICAL_SUBSECTION[8]}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Răng - Hàm - Mặt</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={rangHamMat}
                        onChange={({ target: { value } }) => {
                            setRangHamMat(value);
                            if (!updating) {
                                if (value === khamBenh.rangHamMat) {
                                    dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[8], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa 
                                        && than === khamBenh.than && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop 
                                        && taiMuiHong === khamBenh.taiMuiHong && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[8]].changed) {
                                        dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[8], changed: true }));
                                    }
                                    if (!hasChanged[SECTION_NAME]) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: true });
                                    }
                                }
                            }
                        }}
                        disabled={updating && (useResult[8] || confirmSec[CLINICAL_SUBSECTION[8]] || !spellingError[CLINICAL_SUBSECTION[8]].changed)}
                    />

                    {!!result[8] && !confirmSec[CLINICAL_SUBSECTION[8]] ? 
                        <BoxLoiChinhTa
                            text={text[8]}
                            result={result[8]}
                            replaced={replaced[8]}
                            setReplaced={(newReplaced) => {
                                const tReplaced = [...replaced];
                                tReplaced[8] = newReplaced;
                                setReplaced(tReplaced);
                            }}
                            useResult={useResult[8]}
                            setUseResult={(newUseResult) => {
                                const tUseResult = [...useResult];
                                tUseResult[8] = newUseResult;
                                setUseResult(tUseResult);
                            }}
                            setSection={() => setRangHamMat(khamBenh.rangHamMat)}
                        />
                    : null}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }} id={CLINICAL_SUBSECTION[9]}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Mắt</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={mat}
                        onChange={({ target: { value } }) => {
                            setMat(value);
                            if (!updating) {
                                if (value === khamBenh.mat) {
                                    dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[9], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa 
                                        && than === khamBenh.than && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop 
                                        && taiMuiHong === khamBenh.taiMuiHong && rangHamMat === khamBenh.rangHamMat && noiTiet === khamBenh.noiTiet) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[9]].changed) {
                                        dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[9], changed: true }));
                                    }
                                    if (!hasChanged[SECTION_NAME]) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: true });
                                    }
                                }
                            }
                        }}
                        disabled={updating && (useResult[9] || confirmSec[CLINICAL_SUBSECTION[9]] || !spellingError[CLINICAL_SUBSECTION[9]].changed)}
                    />

                    {!!result[9] && !confirmSec[CLINICAL_SUBSECTION[9]] ? 
                        <BoxLoiChinhTa
                            text={text[9]}
                            result={result[9]}
                            replaced={replaced[9]}
                            setReplaced={(newReplaced) => {
                                const tReplaced = [...replaced];
                                tReplaced[9] = newReplaced;
                                setReplaced(tReplaced);
                            }}
                            useResult={useResult[9]}
                            setUseResult={(newUseResult) => {
                                const tUseResult = [...useResult];
                                tUseResult[9] = newUseResult;
                                setUseResult(tUseResult);
                            }}
                            setSection={() => setMat(khamBenh.mat)}
                        />
                    : null}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }} id={CLINICAL_SUBSECTION[10]}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Nội tiết, dinh dưỡng và các bệnh lý khác</Typography>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        multiline
                        fullWidth
                        value={noiTiet}
                        onChange={({ target: { value } }) => {
                            setNoiTiet(value);
                            if (!updating) {
                                if (value === khamBenh.noiTiet) {
                                    dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[10], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa 
                                        && than === khamBenh.than && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop 
                                        && taiMuiHong === khamBenh.taiMuiHong && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: false });
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[10]].changed) {
                                        dispatch(SpellingErrorActions.updateChanged({ section: CLINICAL_SUBSECTION[10], changed: true }));
                                    }
                                    if (!hasChanged[SECTION_NAME]) {
                                        setHasChanged({ ...hasChanged, [SECTION_NAME]: true });
                                    }
                                }
                            }
                        }}
                        disabled={updating && (useResult[10] || confirmSec[CLINICAL_SUBSECTION[10]] || !spellingError[CLINICAL_SUBSECTION[10]].changed)}
                    />

                    {!!result[10] && !confirmSec[CLINICAL_SUBSECTION[10]] ? 
                        <BoxLoiChinhTa
                            text={text[10]}
                            result={result[10]}
                            replaced={replaced[10]}
                            setReplaced={(newReplaced) => {
                                const tReplaced = [...replaced];
                                tReplaced[10] = newReplaced;
                                setReplaced(tReplaced);
                            }}
                            useResult={useResult[10]}
                            setUseResult={(newUseResult) => {
                                const tUseResult = [...useResult];
                                tUseResult[10] = newUseResult;
                                setUseResult(tUseResult);
                            }}
                            setSection={() => setNoiTiet(khamBenh.noiTiet)}
                        />
                    : null}
                </Grid>
            </Grid>

            <Box sx={{ width: '100%', textAlign: 'right' }}>
                {hasChanged[SECTION_NAME] && !updating ?
                    <Button variant="outlined" sx={{ width: 150, mt: 2 }} onClick={handleReset}>Hủy</Button> : null}

                {((spellingError[CLINICAL_SUBSECTION[0]].changed && !confirmSec[CLINICAL_SUBSECTION[0]]) || (spellingError[CLINICAL_SUBSECTION[1]].changed && !confirmSec[CLINICAL_SUBSECTION[1]])
                    || (spellingError[CLINICAL_SUBSECTION[2]].changed && !confirmSec[CLINICAL_SUBSECTION[2]]) || (spellingError[CLINICAL_SUBSECTION[3]].changed && !confirmSec[CLINICAL_SUBSECTION[3]])
                    || (spellingError[CLINICAL_SUBSECTION[4]].changed && !confirmSec[CLINICAL_SUBSECTION[4]]) || (spellingError[CLINICAL_SUBSECTION[5]].changed && !confirmSec[CLINICAL_SUBSECTION[5]])
                    || (spellingError[CLINICAL_SUBSECTION[6]].changed && !confirmSec[CLINICAL_SUBSECTION[6]]) || (spellingError[CLINICAL_SUBSECTION[7]].changed && !confirmSec[CLINICAL_SUBSECTION[7]])
                    || (spellingError[CLINICAL_SUBSECTION[8]].changed && !confirmSec[CLINICAL_SUBSECTION[8]]) || (spellingError[CLINICAL_SUBSECTION[9]].changed && !confirmSec[CLINICAL_SUBSECTION[9]])
                    || (spellingError[CLINICAL_SUBSECTION[10]].changed && !confirmSec[CLINICAL_SUBSECTION[10]])) && updating ? 
                    <Button onClick={handleConfirm} sx={{ width: 150, mt: 2 }}>Xác nhận</Button> : null}
            </Box>
        </Box>
    )
}

export default FKhamBenh;
