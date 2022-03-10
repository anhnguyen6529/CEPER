import { TableRow } from "@mui/material";
import { styled } from "@mui/styles";

const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(odd)': {
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
    },
    '&:nth-of-type(even)': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
}));

export default StyledTableRow;