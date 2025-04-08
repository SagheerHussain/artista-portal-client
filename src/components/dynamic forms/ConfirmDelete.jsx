import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";

const ConfirmDelete = ({ open, onClose, onDelete, itemName }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <b>{itemName}</b>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDelete;
