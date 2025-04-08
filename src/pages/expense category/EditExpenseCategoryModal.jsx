import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Typography,
  Modal,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import { updateExpanceCategory } from "../../../services/expense";

const EditExpenseCategoryModal = ({
  open,
  onClose,
  initialData,
  refetchSales,
}) => {
  // Get User & Token
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));

  // State Variables
  const [loading, setLoading] = useState(false);
  const [expenseData, setExpenseData] = useState(initialData || {});

  // Update state when initialData changes
  useEffect(() => {
    setExpenseData(initialData || {});
  }, [initialData]);

  const handleChange = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { success, message } = await updateExpanceCategory(
        expenseData._id,
        expenseData,
        token
      );
      if (success) {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: message,
          timer: 1500,
        });
        refetchSales();
        onClose();
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating expense:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Expense</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} className="py-4">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Expense Category Name"
              name="name"
              defaultValue={expenseData.name}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ borderRadius: 1 }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? <ClipLoader size={28} color="#fff" /> : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditExpenseCategoryModal;
