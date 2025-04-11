import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { getExpanceCategories, updateExpense } from "../../../services/expense";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";

const EditExpenseModal = ({ open, onClose, initialData, refetchSales }) => {

  // Token & User
  const token = JSON.parse(localStorage.getItem("token"));

  // State Variables
  const [loading, setLoading] = useState(false);
  const [expenseData, setExpenseData] = useState(initialData || {});
  const [expenseCategories, setExpenseCategories] = useState([]);

  // Expense Categories Fetching
  const fetchExpenseCategories = async () => {
    try {
      const { expanceCategories, success } = await getExpanceCategories(token);
      if (success) {
        setExpenseCategories(expanceCategories);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchExpenseCategories();
  }, []);

  // Update state when initialData changes
  useEffect(() => {
    setExpenseData(initialData || {});
  }, [initialData]);

  const handleChange = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = {
        title: expenseData.title,
        amount: expenseData.amount,
        category: expenseData.category._id,
        date: expenseData.date,
      };
      const { success, message } = await updateExpense(expenseData._id, formData, token);
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Expense updated successfully",
          timer: 800,
        });
        onClose();
        refetchSales();
        setLoading(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to update expense",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Expense</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          name="title"
          fullWidth
          margin="dense"
          value={expenseData.title || ""}
          onChange={handleChange}
        />
        <TextField
          label="Amount In Rs"
          name="amount"
          type="number"
          fullWidth
          margin="dense"
          value={expenseData.amount || ""}
          onChange={handleChange}
        />
        <TextField
          select
          label="Category"
          name="category"
          fullWidth
          margin="dense"
          value={expenseData.category._id || ""}
          onChange={handleChange}
        >
          {expenseCategories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Date"
          name="date"
          type="date"
          fullWidth
          margin="dense"
          value={expenseData.date.split("T")[0] || ""}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
          {loading ? <ClipLoader size={20} color="#fff" /> : "Edit Expense"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditExpenseModal;
