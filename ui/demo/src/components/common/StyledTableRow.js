import { TableRow } from "@mui/material";
import { styled } from "@mui/styles";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
}));

export default StyledTableRow;