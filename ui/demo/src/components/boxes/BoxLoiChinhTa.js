import React, { useState } from "react";
import { Box, Typography, Grid, Checkbox, Button as ButtonWord, Pagination, Card } from "@mui/material";
import "../../styles/index.css";

const ROWS_PER_PAGE = 5;

const BoxLoiChinhTa = ({ text, result, replaced, setReplaced, useResult, setUseResult, setSection }) => {
    const pages = Math.ceil(result.correction.length / ROWS_PER_PAGE * 1.0);
    const [page, setPage] = useState(1);
    const [hoverDetection, setHoverDetection] = useState(new Array(result.correction.length).fill(false));
    const [hoverCorrection, setHoverCorrection] = useState(new Array(result.correction.length).fill(false));

    const markDetection = () => {
        const detected = result.detection.split(' ');
        let lst = [], count = 0;
        detected.forEach((word) => {
            if (word.includes("<mask>")) {
                lst.push({ id: count, replace: true, string: word.replace("<mask>", replaced[count].repText)});
                count++;
            } else {
                lst.push({ replace: false, string: word });
            }
        })
        return lst;
    }

    return (
        <Box sx={{ mt: 1 }}>
            <Typography fontWeight="bold">
                Văn bản kết quả
                <Checkbox 
                    sx={{ py: 0 }} 
                    checked={useResult} 
                    onChange={({ target: { checked } }) => {
                        if (checked) {
                            setSection();
                        }
                        setUseResult(checked);
                    }}
                />
            </Typography>
            <Typography sx={{ mt: 0.5 }}>{markDetection().map((mark, id) => mark.replace
                ? (
                    <Typography key={id} component="span">
                        <Typography 
                            component="span"
                            color="primary"
                            sx={{ cursor: "pointer" }}
                            fontWeight={hoverDetection[mark.id] ? "bold" : "regular"}
                            onClick={() => {
                                if (mark.id < (page - 1) * ROWS_PER_PAGE || mark.id >= (page - 1) * ROWS_PER_PAGE + ROWS_PER_PAGE) {
                                    setPage(Math.trunc(mark.id / ROWS_PER_PAGE * 1.0) + 1);
                                }
                            }}
                            onMouseEnter={() => {
                                const tHoverDetection = [...hoverDetection], tHoverCorrection = [...hoverCorrection];
                                tHoverDetection[mark.id] = true; tHoverCorrection[mark.id] = true;
                                setHoverDetection(tHoverDetection); setHoverCorrection(tHoverCorrection);
                            }}
                            onMouseLeave={() => {
                                const tHoverDetection = [...hoverDetection], tHoverCorrection = [...hoverCorrection];
                                tHoverDetection[mark.id] = false; tHoverCorrection[mark.id] = false;
                                setHoverDetection(tHoverDetection); setHoverCorrection(tHoverCorrection);
                            }}
                        >
                            {mark.string}<sup>{mark.id + 1}</sup>
                        </Typography>
                        {" "}
                    </Typography>
                ) : mark.string.concat(" "))}
            </Typography>

            <Grid container sx={{ pt: 1.5, pb: 0.5 }}>
                <Grid item xs={6}>
                    <Typography fontWeight="bold">Nhận diện và sửa lỗi</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Box className="df jcfe">
                        {pages > 1 ?
                            <Pagination shape="rounded" count={pages} page={page} onChange={(_, value) => setPage(value)} size="small"/>
                        : null}
                    </Box>
                </Grid>
            </Grid>
            {result.correction.slice((page - 1) * ROWS_PER_PAGE, (page - 1) * ROWS_PER_PAGE + ROWS_PER_PAGE).map((correction, id) => (
                <Card key={id} variant="outlined" sx={{ p: 1, mt: 1, borderColor: hoverCorrection[(page - 1) * ROWS_PER_PAGE + id] ? "#09425A" : "rgba(0, 0, 0, 0.12)" }}>
                    <Grid container>
                        <Grid item xs={3}>
                            <Box className="df aic">
                                <Typography sx={{ mr: 1 }}>{(page - 1) * ROWS_PER_PAGE + (id + 1)}) Từ gốc:</Typography>
                                <ButtonWord 
                                    variant={text[(page - 1) * ROWS_PER_PAGE + id] === replaced[(page - 1) * ROWS_PER_PAGE + id].repText 
                                        && replaced[(page - 1) * ROWS_PER_PAGE + id].type === "text" ? "contained" : "outlined"} 
                                    color="warning"
                                    onClick={() => {
                                        const tReplaced = [...replaced];
                                        tReplaced[(page - 1) * ROWS_PER_PAGE + id] = { type: "text", repText: text[(page - 1) * ROWS_PER_PAGE + id] };
                                        setReplaced(tReplaced);
                                    }}
                                    sx={{ cursor: text[(page - 1) * ROWS_PER_PAGE + id] === replaced[(page - 1) * ROWS_PER_PAGE + id].repText 
                                        && replaced[(page - 1) * ROWS_PER_PAGE + id].type === "text" ? "help" : "pointer" }}
                                    onMouseEnter={() => {
                                        const tHoverDetection = [...hoverDetection];
                                        tHoverDetection[(page - 1) * ROWS_PER_PAGE + id] = true;
                                        setHoverDetection(tHoverDetection);
                                    }}
                                    onMouseLeave={() => {
                                        const tHoverDetection = [...hoverDetection];
                                        tHoverDetection[(page - 1) * ROWS_PER_PAGE + id] = false;
                                        setHoverDetection(tHoverDetection);
                                    }}
                                >
                                    {text[(page - 1) * ROWS_PER_PAGE + id]}
                                </ButtonWord>
                            </Box>
                        </Grid>

                        <Grid item xs={9}>
                            <Box className="df aic">
                                <Typography sx={{ mr: 1 }}>Từ gợi ý:</Typography>
                                {correction.map((correct, idx) => (
                                    <ButtonWord
                                        key={idx}
                                        color="success"
                                        variant={correct === replaced[(page - 1) * ROWS_PER_PAGE + id].repText 
                                            && replaced[(page - 1) * ROWS_PER_PAGE + id].type === "correct" ? "contained" : "outlined"}
                                        sx={{ 
                                            mr: 1, 
                                            cursor: correct === replaced[(page - 1) * ROWS_PER_PAGE + id].repText 
                                                && replaced[(page - 1) * ROWS_PER_PAGE + id].type === "correct" ? "help" : "pointer"
                                        }}
                                        onClick={() => {
                                            const tReplaced = [...replaced];
                                            tReplaced[(page - 1) * ROWS_PER_PAGE + id] = { type: "correct", repText: correct };
                                            setReplaced(tReplaced);
                                        }}
                                        onMouseEnter={() => {
                                            const tHoverDetection = [...hoverDetection];
                                            tHoverDetection[(page - 1) * ROWS_PER_PAGE + id] = true;
                                            setHoverDetection(tHoverDetection);
                                        }}
                                        onMouseLeave={() => {
                                            const tHoverDetection = [...hoverDetection];
                                            tHoverDetection[(page - 1) * ROWS_PER_PAGE + id] = false;
                                            setHoverDetection(tHoverDetection);
                                        }}
                                    >
                                        {correct}
                                    </ButtonWord>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </Card>
            ))}
        </Box>
    )
}

export default BoxLoiChinhTa;