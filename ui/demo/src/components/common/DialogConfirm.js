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
                <Button variant="outlined" sx={{ mr: 1 }} onClick={handleCancel}>
                    {cancelText}
                </Button>
                <Button onClick={handleOk}>
                    {okText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogConfirm;