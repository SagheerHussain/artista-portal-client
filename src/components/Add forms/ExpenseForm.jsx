import React, { useEffect, useState } from "react";
import { TextField, Button, Box, MenuItem, Typography } from "@mui/material";
import { createExpense, getExpanceCategories } from "../../../services/expense";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";

const ExpenseForm = ({ onSubmit, setSelectedPage }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    date: "",
    category: "",
    year: "2025",
    admin: user?._id,
  });
  const [expenseCategories, setExpenseCategories] = useState([]);

  const fetchExpenseCategories = async () => {
    try {
      const { expanceCategories, success } = await getExpanceCategories(token);
      console.log("expenses", expanceCategories);
      if (success) {
        setExpenseCategories(expanceCategories);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchExpenseCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { success } = await createExpense(formData, token);
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Expense created successfully",
          timer: 700,
        });
        setLoading(false);
        setTimeout(() => {
          setSelectedPage("/reports/expenses");
        }, 1200);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to create expense",
      });
      console.log("error", error);
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", width: "100%" }}
    >
      <Typography variant="h6" gutterBottom>
        Add Expense
      </Typography>

      <div className="sm:flex gap-4">
        <div className="mb-4 w-full">
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />
        </div>
        <div className="mb-4 w-full">
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            required
          />
        </div>
      </div>

      <div className="sm:flex sm:gap-4">
        <div className="mb-4 w-full">
          <TextField
            label="Amount In Rs"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
            required
          />
        </div>
        <div className="mb-4 w-full">
          <TextField
            select
            fullWidth
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
          >
            {expenseCategories?.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </div>
      <div className="sm:flex sm:gap-4">
        <div className="sm:w-1/2 w-full mb-4">
          <TextField
            label="Date"
            name="date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.date}
            onChange={handleChange}
            fullWidth
            required
          />
        </div>
        <div className="sm:w-1/2 w-full mb-4">
          <TextField
            label="Year"
            name="year"
            type="number"
            defaultValue={2025}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            fullWidth
            required
          />
        </div>
      </div>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setSelectedPage("/reports/expenses")}
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          color="primary"
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="#fff" /> : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};

export default ExpenseForm;
