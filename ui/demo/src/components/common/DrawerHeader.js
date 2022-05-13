import { Box } from "@mui/material";
import { styled } from "@mui/styles";

const DrawerHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default DrawerHeader;