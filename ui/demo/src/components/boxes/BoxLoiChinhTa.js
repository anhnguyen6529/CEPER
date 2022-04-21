import React, { useState } from "react";
import { Box, Typography, Grid, Checkbox, Button as ButtonWord, Card } from "@mui/material";
import "../../styles/index.css";
import { TablePagination } from "../common";

const BoxLoiChinhTa = ({ text, result, replaced, setReplaced, useResult, handleChangeCheckbox }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [hoverDetection, setHoverDetection] = useState(new Array(result.correction.length).fill(false));
    const [hoverCorrection, setHoverCorrection] = useState(new Array(result.correction.length).fill(false));

    const markDetection = () => {
        const detected = result.detection.split(' ');
        let lst = [], count = 0, maskType = "";
        detected.forEach((word) => {
            if (word.includes("<mask>") || word.includes("<mask1>")) {
                maskType = word.includes("<mask>") ? "<mask>" : "<mask1>"
                lst.push({ id: count, replace: true, string: word.replace(maskType, replaced[count].repText)});
                count++;
            } else {
                lst.push({ replace: false, string: word });
            }
        })
        return lst;
    }

    return (
        <Box sx={{ mt: 1 }}>
            <Typography fontWeight="bold" fontStyle="italic">
                Văn bản kết quả
                <Checkbox 
                    sx={{ py: 0 }} 
                    checked={useResult} 
                    onChange={({ target: { checked } }) => handleChangeCheckbox(checked)}
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
                                if (mark.id < page * rowsPerPage || mark.id >= page * rowsPerPage + rowsPerPage) {
                                    setPage(Math.trunc(mark.id / rowsPerPage * 1.0));
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
            <Typography fontWeight="bold" fontStyle="italic" sx={{ mt: 1.5, mb: 0.5 }}>Nhận diện và sửa lỗi</Typography>
            {(rowsPerPage > 0
                ? result.correction.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : result.correction
            ).map((correction, id) => (
                <Card key={id} variant="outlined" sx={{ p: 1, mt: 1, borderColor: hoverCorrection[page * rowsPerPage + id] ? "#09425A" : "rgba(0, 0, 0, 0.12)" }}>
                    <Grid container>
                        <Grid item xs={3}>
                            <Box className="df aic">
                                <Typography sx={{ mr: 1 }}>{page * rowsPerPage + (id + 1)}) Từ gốc:</Typography>
                                <ButtonWord 
                                    variant={text[page * rowsPerPage + id] === replaced[page * rowsPerPage + id].repText 
                                        && replaced[page * rowsPerPage + id].type === "text" ? "contained" : "outlined"} 
                                    color="warning"
                                    onClick={() => {
                                        const tReplaced = [...replaced];
                                        tReplaced[page * rowsPerPage + id] = { type: "text", repText: text[page * rowsPerPage + id] };
                                        setReplaced(tReplaced);
                                    }}
                                    sx={{ cursor: text[page * rowsPerPage + id] === replaced[page * rowsPerPage + id].repText 
                                        && replaced[page * rowsPerPage + id].type === "text" ? "help" : "pointer" }}
                                    onMouseEnter={() => {
                                        const tHoverDetection = [...hoverDetection];
                                        tHoverDetection[page * rowsPerPage + id] = true;
                                        setHoverDetection(tHoverDetection);
                                    }}
                                    onMouseLeave={() => {
                                        const tHoverDetection = [...hoverDetection];
                                        tHoverDetection[page * rowsPerPage + id] = false;
                                        setHoverDetection(tHoverDetection);
                                    }}
                                >
                                    {text[page * rowsPerPage + id]}
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
                                        variant={correct === replaced[page * rowsPerPage + id].repText 
                                            && replaced[page * rowsPerPage + id].type === "correct" ? "contained" : "outlined"}
                                        sx={{ 
                                            mr: 1, 
                                            cursor: correct === replaced[page * rowsPerPage + id].repText 
                                                && replaced[page * rowsPerPage + id].type === "correct" ? "help" : "pointer"
                                        }}
                                        onClick={() => {
                                            const tReplaced = [...replaced];
                                            tReplaced[page * rowsPerPage + id] = { type: "correct", repText: correct };
                                            setReplaced(tReplaced);
                                        }}
                                        onMouseEnter={() => {
                                            const tHoverDetection = [...hoverDetection];
                                            tHoverDetection[page * rowsPerPage + id] = true;
                                            setHoverDetection(tHoverDetection);
                                        }}
                                        onMouseLeave={() => {
                                            const tHoverDetection = [...hoverDetection];
                                            tHoverDetection[page * rowsPerPage + id] = false;
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
            
            {result.correction.length > 5 ?
                <TablePagination 
                    length={result.correction.length}
                    rowsPerPageOptions={[5, 10, 15]}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    page={page}
                    setPage={setPage}
                />
            : null}
        </Box>
    )
}

export default BoxLoiChinhTa;