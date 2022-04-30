import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Button from "./Button";

const DialogConfirm = ({ open, title, contentText, cancelText, handleCancel, okText, handleOk }) => {
    return (
        <Dialog open={open} disableEnforceFocus>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{contentText}</DialogContentText>
            </DialogContent>
            <DialogActions>
                {!!cancelText ? 
                    <Button variant="outlined" sx={{ mr: 1 }} onClick={handleCancel}>
                        {cancelText}
                    </Button>
                : null}
                <Button onClick={handleOk}>
                    {okText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

DialogConfirm.defaultProps = {
    cancelText: "",
    handleCancel: () => {}
}

export default DialogConfirm;