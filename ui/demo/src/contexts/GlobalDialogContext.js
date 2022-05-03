import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { createContext, useState } from "react";
import { Button } from "../components/common";

const GlobalDialogContext = createContext({ setDialogProps: () => {} });

const initialDialogProps = {
    open: false,
    title: "", 
    contentText: "",
    cancelText: "",
    handleCancel: () => {},
    okText: "", 
    handleOk: () => {}
}

export const GlobalDialogProvider = ({ children }) => {
    const [dialogProps, setDialogProps] = useState(initialDialogProps);
    const { open, title, contentText, cancelText, handleCancel, okText, handleOk } = dialogProps;

    return (
        <GlobalDialogContext.Provider
            value={{
                setDialogProps,
            }}
        >
            {children}

            <Dialog open={open} disableEnforceFocus>
                <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{contentText}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {!!cancelText ? 
                            <Button 
                                variant="outlined" 
                                sx={{ mr: 1 }} 
                                onClick={() => { 
                                    handleCancel(); 
                                    setDialogProps({ ...dialogProps, open: false });
                                }}
                            >
                                {cancelText}
                            </Button>
                        : null}
                        <Button 
                            onClick={() => {
                                handleOk();
                                setDialogProps({ ...dialogProps, open: false });
                            }}
                        >
                            {okText}
                        </Button>
                    </DialogActions>
            </Dialog>
        </GlobalDialogContext.Provider>
    )
};

GlobalDialogProvider.defaultProps = {
    children: null,
};

export const GlobalDialogConsumer = GlobalDialogContext.Consumer;

export default GlobalDialogContext;