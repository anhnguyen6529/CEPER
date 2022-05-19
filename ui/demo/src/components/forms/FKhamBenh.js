import { Box, Typography, TextField, Grid, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/index.css";
import { SpellingErrorActions } from "../../redux/slices/spellingError.slice";
import SpellingErrorThunk from "../../redux/thunks/spellingError.thunk";
import { BoxLoiChinhTa } from "../boxes";
import { Button } from "../common";
import mdSections from "../../constants/md_sections.json";
import { CancelOutlined } from "@mui/icons-material";
import { HSBAActions } from "../../redux/slices/HSBA.slice";
import { UtilsText } from "../../utils";

const SECTION_NAME = "Khám bệnh";
const SECTION_FIELD = "khamBenh";
const CLINICAL_SUBSECTION = mdSections[SECTION_NAME];
const SUBSECTION_FIELD = ["khamToanThan", "tuanHoan", "hoHap", "tieuHoa", "than", "thanKinh", "coXuongKhop", "taiMuiHong", "rangHamMat", "mat", "noiTiet"];

const FKhamBenh = () => {
    const { updating, khamBenh } = useSelector((state) => state.HSBA);
    const { loadingError } = useSelector((state) => state.spellingError);
    const spellingError = useSelector((state) => state.spellingError[SECTION_NAME]);
    const spellingErrorKhamToanThan = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[0]]);
    const spellingErrorTuanHoan = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[1]]);
    const spellingErrorHoHap = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[2]]);
    const spellingErrorTieuHoa = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[3]]);
    const spellingErrorThan = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[4]]);
    const spellingErrorThanKinh = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[5]]);
    const spellingErrorCoXuongKhop = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[6]]);
    const spellingErrorTaiMuiHong = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[7]]);
    const spellingErrorRangHamMat = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[8]]);
    const spellingErrorMat = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[9]]);
    const spellingErrorNoiTiet = useSelector((state) => state.spellingError[SECTION_NAME][CLINICAL_SUBSECTION[10]]);
    const { accentColor } = useSelector((state) => state.auth.settings.appearance);
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
    const [useResult, setUseResult] = useState(new Array(CLINICAL_SUBSECTION.length).fill(true));

    useEffect(() => {
        if (updating) {
            if (!loadingError) {
                if (spellingError[CLINICAL_SUBSECTION[0]].changed) dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0], text: khamToanThan }));
                if (spellingError[CLINICAL_SUBSECTION[1]].changed) dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1], text: tuanHoan }));
                if (spellingError[CLINICAL_SUBSECTION[2]].changed) dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[2], text: hoHap }));
                if (spellingError[CLINICAL_SUBSECTION[3]].changed) dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[3], text: tieuHoa }));
                if (spellingError[CLINICAL_SUBSECTION[4]].changed) dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[4], text: than }));
                if (spellingError[CLINICAL_SUBSECTION[5]].changed) dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[5], text: thanKinh }));
                if (spellingError[CLINICAL_SUBSECTION[6]].changed) dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[6], text: coXuongKhop }));
                if (spellingError[CLINICAL_SUBSECTION[7]].changed) dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[7], text: taiMuiHong }));
                if (spellingError[CLINICAL_SUBSECTION[8]].changed) dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[8], text: rangHamMat }));
                if (spellingError[CLINICAL_SUBSECTION[9]].changed) dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[9], text: mat }));
                if (spellingError[CLINICAL_SUBSECTION[10]].changed) dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[10], text: noiTiet }));
            }
            dispatch(HSBAActions.updateSection({
                section: SECTION_FIELD,
                data: { ...khamBenh, khamToanThan, tuanHoan, hoHap, tieuHoa, than, thanKinh, coXuongKhop, taiMuiHong, rangHamMat, mat, noiTiet }
            }));
        }
        // eslint-disable-next-line
    }, [updating, loadingError]);

    useEffect(() => {
        const tResult = [...result], tReplaced = [...replaced];
        CLINICAL_SUBSECTION.forEach((subSection, id) => {
            if (!spellingError[subSection].loading && !spellingError[subSection].error) {
                tResult[id] = spellingError[subSection]; setResult(tResult);
                tReplaced[id] = spellingError[subSection].correction.map(res => ({ type: "correct", repText: res[1] })); setReplaced(tReplaced);
                dispatch(HSBAActions.updateSection({
                    section: SECTION_FIELD,
                    data: { ...khamBenh, [SUBSECTION_FIELD[id]]: UtilsText.replaceMaskWord(spellingError[subSection].detection, tReplaced[id]) }
                }));
            } else if (spellingError[subSection].loading) {
                tResult[id] = ''; setResult(tResult);
                tReplaced[id] = []; setReplaced(tReplaced);
            }
        });
        // eslint-disable-next-line
    }, [spellingErrorKhamToanThan.loading, spellingErrorTuanHoan.loading, spellingErrorHoHap.loading, spellingErrorTieuHoa.loading,
        spellingErrorThan.loading, spellingErrorThanKinh.loading, spellingErrorCoXuongKhop.loading, spellingErrorTaiMuiHong.loading,
        spellingErrorRangHamMat.loading, spellingErrorMat.loading, spellingErrorNoiTiet.loading]);

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
        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
        CLINICAL_SUBSECTION.forEach(subSection => dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection, changed: false })));
    }

    return (
        <Box component="form" noValidate>
            <Grid container>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Khám toàn thân</Typography>
                </Grid>
                <Grid item xs={10}>
                    {(updating && !!result[0] && result[0].correction.length > 0) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
                    <TextField 
                        multiline
                        fullWidth
                        margin={(updating && !!result[0] && result[0].correction.length > 0) ? "dense" : "none"}
                        value={khamToanThan}
                        onChange={({ target: { value } }) => {
                            setKhamToanThan(value);
                            if (!updating) {
                                if (value === khamBenh.khamToanThan) {
                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0], changed: false }));
                                    if (tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa && than === khamBenh.than
                                        && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop && taiMuiHong === khamBenh.taiMuiHong
                                        && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                            dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[0]].changed) {
                                        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0], changed: true }));
                                    }
                                    if (!spellingError.changed) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                    }
                                }
                            } else {
                                dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: { ...khamBenh, khamToanThan: value } }));
                            }
                        }}
                        disabled={updating && (useResult[0] || !spellingError[CLINICAL_SUBSECTION[0]].changed)}
                    />

                    {!!result[0] && !spellingError[CLINICAL_SUBSECTION[0]].loading ? 
                        result[0].correction.length > 0 ?
                            <BoxLoiChinhTa
                                result={result[0]}
                                replaced={replaced[0]}
                                setReplaced={(newReplaced) => {
                                    const tReplaced = [...replaced];
                                    tReplaced[0] = newReplaced;
                                    setReplaced(tReplaced);
                                }}
                                useResult={useResult[0]}
                                handleChangeCheckbox={(checked) => {
                                    const tUseResult = [...useResult];
                                    tUseResult[0] = checked;
                                    setUseResult(tUseResult);
                                    if (checked) {
                                        dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0] }));
                                        dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[0], text: khamToanThan }));
                                    } else {
                                        dispatch(HSBAActions.updateSection({
                                            section: SECTION_FIELD,
                                            data: { ...khamBenh, khamToanThan }
                                        }));
                                    }
                                }}
                                handleUpdateSection={(newReplaced) => {
                                    dispatch(HSBAActions.updateSection({
                                        section: SECTION_FIELD,
                                        data: { ...khamBenh, khamToanThan: UtilsText.replaceMaskWord(spellingError[CLINICAL_SUBSECTION[0]].detection, newReplaced) }
                                    }));
                                }}
                            />
                        : null
                    : ( 
                        updating && spellingError[CLINICAL_SUBSECTION[0]].changed ? 
                            <div className="df fdc aic jcc">
                                <CircularProgress size={20} sx={{ mt: 2, mb: 1, color: (theme) => theme.palette[accentColor].main }} />
                                <Typography color={`${accentColor}.main`}>Đang xử lý...</Typography>
                            </div> 
                        : null
                    )}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Tuần hoàn</Typography>
                </Grid>
                <Grid item xs={10}>
                    {(updating && !!result[1] && result[1].correction.length > 0) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
                    <TextField 
                        multiline
                        fullWidth
                        margin={(updating && !!result[1] && result[1].correction.length > 0) ? "dense" : "none"}
                        value={tuanHoan}
                        onChange={({ target: { value } }) => {
                            setTuanHoan(value);
                            if (!updating) {
                                if (value === khamBenh.tuanHoan) {
                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa && than === khamBenh.than
                                        && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop && taiMuiHong === khamBenh.taiMuiHong
                                        && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[1]].changed) {
                                        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1], changed: true }));
                                    }
                                    if (!spellingError.changed) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                    }
                                }
                            } else {
                                dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: { ...khamBenh, tuanHoan: value } }));
                            }
                        }}
                        disabled={updating && (useResult[1] || !spellingError[CLINICAL_SUBSECTION[1]].changed)}
                    />

                    {!!result[1] && !spellingError[CLINICAL_SUBSECTION[1]].loading ? 
                        result[1].correction.length > 0 ?
                            <BoxLoiChinhTa
                                result={result[1]}
                                replaced={replaced[1]}
                                setReplaced={(newReplaced) => {
                                    const tReplaced = [...replaced];
                                    tReplaced[1] = newReplaced;
                                    setReplaced(tReplaced);
                                }}
                                useResult={useResult[1]}
                                handleChangeCheckbox={(checked) => {
                                    const tUseResult = [...useResult];
                                    tUseResult[1] = checked;
                                    setUseResult(tUseResult);
                                    if (checked) {
                                        dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1] }));
                                        dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[1], text: tuanHoan }));
                                    } else {
                                        dispatch(HSBAActions.updateSection({
                                            section: SECTION_FIELD,
                                            data: { ...khamBenh, tuanHoan }
                                        }));
                                    }
                                }}
                                handleUpdateSection={(newReplaced) => {
                                    dispatch(HSBAActions.updateSection({
                                        section: SECTION_FIELD,
                                        data: { ...khamBenh, tuanHoan: UtilsText.replaceMaskWord(spellingError[CLINICAL_SUBSECTION[1]].detection, newReplaced) }
                                    }));
                                }}
                            />
                        : null
                    :  ( 
                        updating && spellingError[CLINICAL_SUBSECTION[1]].changed ? 
                            <div className="df fdc aic jcc">
                                <CircularProgress size={20} sx={{ mt: 2, mb: 1, color: (theme) => theme.palette[accentColor].main }} />
                                <Typography color={`${accentColor}.main`}>Đang xử lý...</Typography>
                            </div> 
                        : null
                    )}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Hô hấp</Typography>
                </Grid>
                <Grid item xs={10}>
                    {(updating && !!result[2] && result[2].correction.length > 0) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
                    <TextField 
                        multiline
                        fullWidth
                        margin={(updating && !!result[2] && result[2].correction.length > 0) ? "dense" : "none"}
                        value={hoHap}
                        onChange={({ target: { value } }) => {
                            setHoHap(value);
                            if (!updating) {
                                if (value === khamBenh.hoHap) {
                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[2], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && tieuHoa === khamBenh.tieuHoa && than === khamBenh.than
                                        && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop && taiMuiHong === khamBenh.taiMuiHong
                                        && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[2]].changed) {
                                        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[2], changed: true }));
                                    }
                                    if (!spellingError.changed) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                    }
                                }
                            } else {
                                dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: { ...khamBenh, hoHap: value } }));
                            }
                        }}
                        disabled={updating && (useResult[2] || !spellingError[CLINICAL_SUBSECTION[2]].changed)}
                    />

                    {!!result[2] && !spellingError[CLINICAL_SUBSECTION[2]].loading ? 
                        result[2].correction.length > 0 ?
                            <BoxLoiChinhTa
                                result={result[2]}
                                replaced={replaced[2]}
                                setReplaced={(newReplaced) => {
                                    const tReplaced = [...replaced];
                                    tReplaced[2] = newReplaced;
                                    setReplaced(tReplaced);
                                }}
                                useResult={useResult[2]}
                                handleChangeCheckbox={(checked) => {
                                    const tUseResult = [...useResult];
                                    tUseResult[2] = checked;
                                    setUseResult(tUseResult);
                                    if (checked) {
                                        dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[2] }));
                                        dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[2], text: hoHap }));
                                    } else {
                                        dispatch(HSBAActions.updateSection({
                                            section: SECTION_FIELD,
                                            data: { ...khamBenh, hoHap }
                                        }));
                                    }
                                }}
                                handleUpdateSection={(newReplaced) => {
                                    dispatch(HSBAActions.updateSection({
                                        section: SECTION_FIELD,
                                        data: { ...khamBenh, hoHap: UtilsText.replaceMaskWord(spellingError[CLINICAL_SUBSECTION[2]].detection, newReplaced) }
                                    }));
                                }}
                            />
                        : null
                    : ( 
                        updating && spellingError[CLINICAL_SUBSECTION[2]].changed ? 
                            <div className="df fdc aic jcc">
                                <CircularProgress size={20} sx={{ mt: 2, mb: 1, color: (theme) => theme.palette[accentColor].main }} />
                                <Typography color={`${accentColor}.main`}>Đang xử lý...</Typography>
                            </div> 
                        : null
                    )}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Tiêu hóa</Typography>
                </Grid>
                <Grid item xs={10}>
                    {(updating && !!result[3] && result[3].correction.length > 0) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
                    <TextField 
                        multiline
                        fullWidth
                        value={tieuHoa}
                        margin={(updating && !!result[3] && result[3].correction.length > 0) ? "dense" : "none"}
                        onChange={({ target: { value } }) => {
                            setTieuHoa(value);
                            if (!updating) {
                                if (value === khamBenh.tieuHoa) {
                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[3], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && than === khamBenh.than
                                        && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop && taiMuiHong === khamBenh.taiMuiHong
                                        && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[3]].changed) {
                                        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[3], changed: true }));
                                    }
                                    if (!spellingError.changed) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                    }
                                }
                            } else {
                                dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: { ...khamBenh, tieuHoa: value } }));
                            }
                        }}
                        disabled={updating && (useResult[3] || !spellingError[CLINICAL_SUBSECTION[3]].changed)}
                    />

                    {!!result[3] && !spellingError[CLINICAL_SUBSECTION[3]].loading ? 
                        result[3].correction.length > 0 ?
                            <BoxLoiChinhTa
                                result={result[3]}
                                replaced={replaced[3]}
                                setReplaced={(newReplaced) => {
                                    const tReplaced = [...replaced];
                                    tReplaced[3] = newReplaced;
                                    setReplaced(tReplaced);
                                }}
                                useResult={useResult[3]}
                                handleChangeCheckbox={(checked) => {
                                    const tUseResult = [...useResult];
                                    tUseResult[3] = checked;
                                    setUseResult(tUseResult);
                                    if (checked) {
                                        dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[3] }));
                                        dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[3], text: tieuHoa }));
                                    } else {
                                        dispatch(HSBAActions.updateSection({
                                            section: SECTION_FIELD,
                                            data: { ...khamBenh, tieuHoa }
                                        }));
                                    }
                                }}
                                handleUpdateSection={(newReplaced) => {
                                    dispatch(HSBAActions.updateSection({
                                        section: SECTION_FIELD,
                                        data: { ...khamBenh, tieuHoa: UtilsText.replaceMaskWord(spellingError[CLINICAL_SUBSECTION[3]].detection, newReplaced) }
                                    }));
                                }}
                            />
                        : null
                    : ( 
                        updating && spellingError[CLINICAL_SUBSECTION[3]].changed ? 
                            <div className="df fdc aic jcc">
                                <CircularProgress size={20} sx={{ mt: 2, mb: 1, color: (theme) => theme.palette[accentColor].main }} />
                                <Typography color={`${accentColor}.main`}>Đang xử lý...</Typography>
                            </div> 
                        : null
                    )}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Thận - Tiết niệu - Sinh dục</Typography>
                </Grid>
                <Grid item xs={10}>
                    {(updating && !!result[4] && result[4].correction.length > 0) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
                    <TextField 
                        multiline
                        fullWidth
                        margin={(updating && !!result[4] && result[4].correction.length > 0) ? "dense" : "none"}
                        value={than}
                        onChange={({ target: { value } }) => {
                            setThan(value);
                            if (!updating) {
                                if (value === khamBenh.than) {
                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[4], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa
                                        && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop && taiMuiHong === khamBenh.taiMuiHong
                                        && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[4]].changed) {
                                        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[4], changed: true }));
                                    }
                                    if (!spellingError.changed) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                    }
                                }
                            } else {
                                dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: { ...khamBenh, than: value } }));
                            }
                        }}
                        disabled={updating && (useResult[4] || !spellingError[CLINICAL_SUBSECTION[4]].changed)}
                    />

                    {!!result[4] && !spellingError[CLINICAL_SUBSECTION[4]].loading ? 
                        result[4].correction.length > 0 ?
                            <BoxLoiChinhTa
                                result={result[4]}
                                replaced={replaced[4]}
                                setReplaced={(newReplaced) => {
                                    const tReplaced = [...replaced];
                                    tReplaced[4] = newReplaced;
                                    setReplaced(tReplaced);
                                }}
                                useResult={useResult[4]}
                                handleChangeCheckbox={(checked) => {
                                    const tUseResult = [...useResult];
                                    tUseResult[4] = checked;
                                    setUseResult(tUseResult);
                                    if (checked) {
                                        dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[4] }));
                                        dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[4], text: than }));
                                    } else {
                                        dispatch(HSBAActions.updateSection({
                                            section: SECTION_FIELD,
                                            data: { ...khamBenh, than }
                                        }));
                                    }
                                }}
                                handleUpdateSection={(newReplaced) => {
                                    dispatch(HSBAActions.updateSection({
                                        section: SECTION_FIELD,
                                        data: { ...khamBenh, than: UtilsText.replaceMaskWord(spellingError[CLINICAL_SUBSECTION[4]].detection, newReplaced) }
                                    }));
                                }}
                            />
                        : null
                    : ( 
                        updating && spellingError[CLINICAL_SUBSECTION[4]].changed ? 
                            <div className="df fdc aic jcc">
                                <CircularProgress size={20} sx={{ mt: 2, mb: 1, color: (theme) => theme.palette[accentColor].main }} />
                                <Typography color={`${accentColor}.main`}>Đang xử lý...</Typography>
                            </div> 
                        : null
                    )}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Thần kinh</Typography>
                </Grid>
                <Grid item xs={10}>
                    {(updating && !!result[5] && result[5].correction.length > 0) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
                    <TextField 
                        multiline
                        fullWidth
                        margin={(updating && !!result[5] && result[5].correction.length > 0) ? "dense" : "none"}
                        value={thanKinh}
                        onChange={({ target: { value } }) => {
                            setThanKinh(value);
                            if (!updating) {
                                if (value === khamBenh.thanKinh) {
                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[5], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa 
                                        && than === khamBenh.than && coXuongKhop === khamBenh.coXuongKhop && taiMuiHong === khamBenh.taiMuiHong
                                        && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[5]].changed) {
                                        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[5], changed: true }));
                                    }
                                    if (!spellingError.changed) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                    }
                                }
                            } else {
                                dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: { ...khamBenh, thanKinh: value } }));
                            }
                        }}
                        disabled={updating && (useResult[5] || !spellingError[CLINICAL_SUBSECTION[5]].changed)}
                    />
                    
                    {!!result[5] && !spellingError[CLINICAL_SUBSECTION[5]].loading ? 
                        result[5].correction.length > 0 ?
                            <BoxLoiChinhTa
                                result={result[5]}
                                replaced={replaced[5]}
                                setReplaced={(newReplaced) => {
                                    const tReplaced = [...replaced];
                                    tReplaced[5] = newReplaced;
                                    setReplaced(tReplaced);
                                }}
                                useResult={useResult[5]}
                                handleChangeCheckbox={(checked) => {
                                    const tUseResult = [...useResult];
                                    tUseResult[5] = checked;
                                    setUseResult(tUseResult);
                                    if (checked) {
                                        dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[5] }));
                                        dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[5], text: thanKinh }));
                                    } else {
                                        dispatch(HSBAActions.updateSection({
                                            section: SECTION_FIELD,
                                            data: { ...khamBenh, thanKinh }
                                        }));
                                    }
                                }}
                                handleUpdateSection={(newReplaced) => {
                                    dispatch(HSBAActions.updateSection({
                                        section: SECTION_FIELD,
                                        data: { ...khamBenh, thanKinh: UtilsText.replaceMaskWord(spellingError[CLINICAL_SUBSECTION[5]].detection, newReplaced) }
                                    }));
                                }}
                            />
                        : null
                    : ( 
                        updating && spellingError[CLINICAL_SUBSECTION[5]].changed ? 
                            <div className="df fdc aic jcc">
                                <CircularProgress size={20} sx={{ mt: 2, mb: 1, color: (theme) => theme.palette[accentColor].main }} />
                                <Typography color={`${accentColor}.main`}>Đang xử lý...</Typography>
                            </div> 
                        : null
                    )}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Cơ - Xương - Khớp</Typography>
                </Grid>
                <Grid item xs={10}>
                    {(updating[6] && !!result[6] && result[6].correction.length > 0) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
                    <TextField 
                        multiline
                        fullWidth
                        margin={(updating && !!result[6] && result[6].correction.length > 0) ? "dense" : "none"}
                        value={coXuongKhop}
                        onChange={({ target: { value } }) => {
                            setCoXuongKhop(value);
                            if (!updating) {
                                if (value === khamBenh.coXuongKhop) {
                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[6], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa 
                                        && than === khamBenh.than && thanKinh === khamBenh.thanKinh && taiMuiHong === khamBenh.taiMuiHong
                                        && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[6]].changed) {
                                        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[6], changed: true }));
                                    }
                                    if (!spellingError.changed) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                    }
                                }
                            } else {
                                dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: { ...khamBenh, coXuongKhop: value } }));
                            }
                        }}
                        disabled={updating && (useResult[6] || !spellingError[CLINICAL_SUBSECTION[6]].changed)}
                    />

                    {!!result[6] && !spellingError[CLINICAL_SUBSECTION[6]].loading ? 
                        result[6].correction.length > 0 ?
                            <BoxLoiChinhTa
                                result={result[6]}
                                replaced={replaced[6]}
                                setReplaced={(newReplaced) => {
                                    const tReplaced = [...replaced];
                                    tReplaced[6] = newReplaced;
                                    setReplaced(tReplaced);
                                }}
                                useResult={useResult[6]}
                                handleChangeCheckbox={(checked) => {
                                    const tUseResult = [...useResult];
                                    tUseResult[6] = checked;
                                    setUseResult(tUseResult);
                                    if (checked) {
                                        dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[6] }));
                                        dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[6], text: coXuongKhop }));
                                    } else {
                                        dispatch(HSBAActions.updateSection({
                                            section: SECTION_FIELD,
                                            data: { ...khamBenh, coXuongKhop }
                                        }));
                                    }
                                }}
                                handleUpdateSection={(newReplaced) => {
                                    dispatch(HSBAActions.updateSection({
                                        section: SECTION_FIELD,
                                        data: { ...khamBenh, thanKinh: UtilsText.replaceMaskWord(spellingError[CLINICAL_SUBSECTION[6]].detection, newReplaced) }
                                    }));
                                }}
                            />
                        : null
                    : ( 
                        updating && spellingError[CLINICAL_SUBSECTION[6]].changed ? 
                            <div className="df fdc aic jcc">
                                <CircularProgress size={20} sx={{ mt: 2, mb: 1, color: (theme) => theme.palette[accentColor].main }} />
                                <Typography color={`${accentColor}.main`}>Đang xử lý...</Typography>
                            </div> 
                        : null
                    )}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Tai - Mũi - Họng</Typography>
                </Grid>
                <Grid item xs={10}>
                    {(updating && !!result[7] && result[7].correction.length > 0) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
                    <TextField 
                        multiline
                        fullWidth
                        margin={(updating && !!result[7] && result[7].correction.length > 0) ? "dense" : "none"}
                        value={taiMuiHong}
                        onChange={({ target: { value } }) => {
                            setTaiMuiHong(value);
                            if (!updating) {
                                if (value === khamBenh.taiMuiHong) {
                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[7], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa 
                                        && than === khamBenh.than && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop
                                        && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[7]].changed) {
                                        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[7], changed: true }));
                                    }
                                    if (!spellingError.changed) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                    }
                                }
                            } else {
                                dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: { ...khamBenh, taiMuiHong: value } }));
                            }
                        }}
                        disabled={updating && (useResult[7] || !spellingError[CLINICAL_SUBSECTION[7]].changed)}
                    />

                    {!!result[7] && !spellingError[CLINICAL_SUBSECTION[7]].loading ? 
                        result[7].correction.length > 0 ?
                            <BoxLoiChinhTa
                                result={result[7]}
                                replaced={replaced[7]}
                                setReplaced={(newReplaced) => {
                                    const tReplaced = [...replaced];
                                    tReplaced[7] = newReplaced;
                                    setReplaced(tReplaced);
                                }}
                                useResult={useResult[7]}
                                handleChangeCheckbox={(checked) => {
                                    const tUseResult = [...useResult];
                                    tUseResult[7] = checked;
                                    setUseResult(tUseResult);
                                    if (checked) {
                                        dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[7] }));
                                        dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[7], text: taiMuiHong }));
                                    } else {
                                        dispatch(HSBAActions.updateSection({
                                            section: SECTION_FIELD,
                                            data: { ...khamBenh, taiMuiHong }
                                        }));
                                    }
                                }}
                                handleUpdateSection={(newReplaced) => {
                                    dispatch(HSBAActions.updateSection({
                                        section: SECTION_FIELD,
                                        data: { ...khamBenh, taiMuiHong: UtilsText.replaceMaskWord(spellingError[CLINICAL_SUBSECTION[7]].detection, newReplaced) }
                                    }));
                                }}
                            />
                        : null
                    : ( 
                        updating && spellingError[CLINICAL_SUBSECTION[7]].changed ? 
                            <div className="df fdc aic jcc">
                                <CircularProgress size={20} sx={{ mt: 2, mb: 1, color: (theme) => theme.palette[accentColor].main }} />
                                <Typography color={`${accentColor}.main`}>Đang xử lý...</Typography>
                            </div> 
                        : null
                    )}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Răng - Hàm - Mặt</Typography>
                </Grid>
                <Grid item xs={10}>
                    {(updating && !!result[8] && result[8].correction.length > 0) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
                    <TextField 
                        multiline
                        fullWidth
                        margin={(updating && !!result[8] && result[8].correction.length > 0) ? "dense" : "none"}
                        value={rangHamMat}
                        onChange={({ target: { value } }) => {
                            setRangHamMat(value);
                            if (!updating) {
                                if (value === khamBenh.rangHamMat) {
                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[8], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa 
                                        && than === khamBenh.than && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop 
                                        && taiMuiHong === khamBenh.taiMuiHong && mat === khamBenh.mat && noiTiet === khamBenh.noiTiet) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[8]].changed) {
                                        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[8], changed: true }));
                                    }
                                    if (!spellingError.changed) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                    }
                                }
                            } else {
                                dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: { ...khamBenh, rangHamMat: value } }));
                            }
                        }}
                        disabled={updating && (useResult[8] || !spellingError[CLINICAL_SUBSECTION[8]].changed)}
                    />

                    {!!result[8] && !spellingError[CLINICAL_SUBSECTION[8]].loading ? 
                        result[8].correction.length > 0 ?
                            <BoxLoiChinhTa
                                result={result[8]}
                                replaced={replaced[8]}
                                setReplaced={(newReplaced) => {
                                    const tReplaced = [...replaced];
                                    tReplaced[8] = newReplaced;
                                    setReplaced(tReplaced);
                                }}
                                useResult={useResult[8]}
                                handleChangeCheckbox={(checked) => {
                                    const tUseResult = [...useResult];
                                    tUseResult[8] = checked;
                                    setUseResult(tUseResult);
                                    if (checked) {
                                        dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[8] }));
                                        dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[8], text: rangHamMat }));
                                    } else {
                                        dispatch(HSBAActions.updateSection({
                                            section: SECTION_FIELD,
                                            data: { ...khamBenh, rangHamMat }
                                        }));
                                    }
                                }}
                                handleUpdateSection={(newReplaced) => {
                                    dispatch(HSBAActions.updateSection({
                                        section: SECTION_FIELD,
                                        data: { ...khamBenh, rangHamMat: UtilsText.replaceMaskWord(spellingError[CLINICAL_SUBSECTION[8]].detection, newReplaced) }
                                    }));
                                }}
                            />
                        : null
                    : ( 
                        updating && spellingError[CLINICAL_SUBSECTION[8]].changed ? 
                            <div className="df fdc aic jcc">
                                <CircularProgress size={20} sx={{ mt: 2, mb: 1, color: (theme) => theme.palette[accentColor].main }} />
                                <Typography color={`${accentColor}.main`}>Đang xử lý...</Typography>
                            </div> 
                        : null
                    )}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Mắt</Typography>
                </Grid>
                <Grid item xs={10}>
                    {(updating && !!result[9] && result[9].correction.length > 0) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
                    <TextField 
                        multiline
                        fullWidth
                        margin={(updating && !!result[9] && result[9].correction.length > 0) ? "dense" : "none"}
                        value={mat}
                        onChange={({ target: { value } }) => {
                            setMat(value);
                            if (!updating) {
                                if (value === khamBenh.mat) {
                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[9], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa 
                                        && than === khamBenh.than && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop 
                                        && taiMuiHong === khamBenh.taiMuiHong && rangHamMat === khamBenh.rangHamMat && noiTiet === khamBenh.noiTiet) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[9]].changed) {
                                        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[9], changed: true }));
                                    }
                                    if (!spellingError.changed) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                    }
                                }
                            } else {
                                dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: { ...khamBenh, mat: value } }));
                            }
                        }}
                        disabled={updating && (useResult[9] || !spellingError[CLINICAL_SUBSECTION[9]].changed)}
                    />

                    {!!result[9] && !spellingError[CLINICAL_SUBSECTION[9]].loading ? 
                        result[9].correction.length > 0 ?
                            <BoxLoiChinhTa
                                result={result[9]}
                                replaced={replaced[9]}
                                setReplaced={(newReplaced) => {
                                    const tReplaced = [...replaced];
                                    tReplaced[9] = newReplaced;
                                    setReplaced(tReplaced);
                                }}
                                useResult={useResult[9]}
                                handleChangeCheckbox={(checked) => {
                                    const tUseResult = [...useResult];
                                    tUseResult[9] = checked;
                                    setUseResult(tUseResult);
                                    if (checked) {
                                        dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[9] }));
                                        dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[9], text: mat }));
                                    } else {
                                        dispatch(HSBAActions.updateSection({
                                            section: SECTION_FIELD,
                                            data: { ...khamBenh, mat }
                                        }));
                                    }
                                }}
                                handleUpdateSection={(newReplaced) => {
                                    dispatch(HSBAActions.updateSection({
                                        section: SECTION_FIELD,
                                        data: { ...khamBenh, mat: UtilsText.replaceMaskWord(spellingError[CLINICAL_SUBSECTION[9]].detection, newReplaced) }
                                    }));
                                }}
                            />
                        : null
                    : ( 
                        updating && spellingError[CLINICAL_SUBSECTION[9]].changed ? 
                            <div className="df fdc aic jcc">
                                <CircularProgress size={20} sx={{ mt: 2, mb: 1, color: (theme) => theme.palette[accentColor].main }} />
                                <Typography color={`${accentColor}.main`}>Đang xử lý...</Typography>
                            </div> 
                        : null
                    )}
                </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
                <Grid item xs={2}>
                    <Typography fontWeight="bold">Nội tiết, dinh dưỡng và các bệnh lý khác</Typography>
                </Grid>
                <Grid item xs={10}>
                    {(updating && !!result[10] && result[10].correction.length > 0) ? <Typography fontWeight="bold" fontStyle="italic">Văn bản gốc</Typography> : null}
                    <TextField 
                        multiline
                        fullWidth
                        margin={(updating && !!result[10] && result[10].correction.length > 0) ? "dense" : "none"}
                        value={noiTiet}
                        onChange={({ target: { value } }) => {
                            setNoiTiet(value);
                            if (!updating) {
                                if (value === khamBenh.noiTiet) {
                                    dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[10], changed: false }));
                                    if (khamToanThan === khamBenh.khamToanThan && tuanHoan === khamBenh.tuanHoan && hoHap === khamBenh.hoHap && tieuHoa === khamBenh.tieuHoa 
                                        && than === khamBenh.than && thanKinh === khamBenh.thanKinh && coXuongKhop === khamBenh.coXuongKhop 
                                        && taiMuiHong === khamBenh.taiMuiHong && rangHamMat === khamBenh.rangHamMat && mat === khamBenh.mat) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: false }));
                                    }
                                } else {
                                    if (!spellingError[CLINICAL_SUBSECTION[10]].changed) {
                                        dispatch(SpellingErrorActions.updateSubSectionChanged({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[10], changed: true }));
                                    }
                                    if (!spellingError.changed) {
                                        dispatch(SpellingErrorActions.updateSectionChanged({ section: SECTION_NAME, changed: true }));
                                    }
                                }
                            } else {
                                dispatch(HSBAActions.updateSection({ section: SECTION_FIELD, data: { ...khamBenh, noiTiet: value } }));
                            }
                        }}
                        disabled={updating && (useResult[10] || !spellingError[CLINICAL_SUBSECTION[10]].changed)}
                    />

                    {!!result[10] && !spellingError[CLINICAL_SUBSECTION[10]].loading ? 
                        result[10].correction.length > 0 ?
                            <BoxLoiChinhTa
                                result={result[10]}
                                replaced={replaced[10]}
                                setReplaced={(newReplaced) => {
                                    const tReplaced = [...replaced];
                                    tReplaced[10] = newReplaced;
                                    setReplaced(tReplaced);
                                }}
                                useResult={useResult[10]}
                                handleChangeCheckbox={(checked) => {
                                    const tUseResult = [...useResult];
                                    tUseResult[10] = checked;
                                    setUseResult(tUseResult);
                                    if (checked) {
                                        dispatch(SpellingErrorActions.resetLoading({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[10] }));
                                        dispatch(SpellingErrorThunk.getProcessResult({ section: SECTION_NAME, subSection: CLINICAL_SUBSECTION[10], text: noiTiet }));
                                    } else {
                                        dispatch(HSBAActions.updateSection({
                                            section: SECTION_FIELD,
                                            data: { ...khamBenh, noiTiet }
                                        }));
                                    }
                                }}
                                handleUpdateSection={(newReplaced) => {
                                    dispatch(HSBAActions.updateSection({
                                        section: SECTION_FIELD,
                                        data: { ...khamBenh, noiTiet: UtilsText.replaceMaskWord(spellingError[CLINICAL_SUBSECTION[10]].detection, newReplaced) }
                                    }));
                                }}
                            />
                        : null
                    : ( 
                        updating && spellingError[CLINICAL_SUBSECTION[10]].changed ? 
                            <div className="df fdc aic jcc">
                                <CircularProgress size={20} sx={{ mt: 2, mb: 1, color: (theme) => theme.palette[accentColor].main }} />
                                <Typography color={`${accentColor}.main`}>Đang xử lý...</Typography>
                            </div> 
                        : null
                    )}
                </Grid>
            </Grid>

            <Box sx={{ width: '100%', textAlign: 'right' }}>
                {(spellingError.changed && !updating) ?
                    <Button startIcon={<CancelOutlined />} variant="outlined" sx={{ mt: 2 }} onClick={handleReset}>Hủy</Button> 
                : null}
            </Box>
        </Box>
    )
}

export default FKhamBenh;
