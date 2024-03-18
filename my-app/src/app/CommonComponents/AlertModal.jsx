"use client";

import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingSpinner from "./LoadingSpinner";

const AlertModal = ({
  open = false,
  yesbtn = "Yes, I'm sure",
  nobtn = "No, cancel",
  message = "Are you sure you want to sign out ?",
  closeButton = () => {},
  submitButton = () => {},
  loading = false,
  loadingMsg = "",
}) => {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={closeButton}
        aria-describedby="alert-dialog-slide-description"
      >
        {loading ? (
          <DialogContent>
            <LoadingSpinner loadingMsg={loadingMsg} />
          </DialogContent>
        ) : (
          <>
            {" "}
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {message}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" color="error" onClick={closeButton}>
                {nobtn}
              </Button>
              <Button variant="contained" color="error" onClick={submitButton}>
                {yesbtn}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </React.Fragment>
  );
};

export default AlertModal;
