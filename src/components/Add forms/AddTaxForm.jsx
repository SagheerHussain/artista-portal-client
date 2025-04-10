import React, { useState } from "react";
import { TextField, Button, Box, MenuItem, Typography } from "@mui/material";
import { ClipLoader } from "react-spinners";
import { createExpanceCategory } from "../../../services/expense";
import Swal from "sweetalert2";
import { createTax } from "../../../services/tax";

const AddTaxForm = ({ setSelectedPage }) => {
  // Token
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));

  // State Variables
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    percentage: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.percentage || !formData.date) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "All fields are required",
      });
      setLoading(false);
      return;
    }
    try {
      const { success, message } = await createTax(token, formData);
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: message,
          timer: 800,
        });
        setLoading(false);
        setTimeout(() => {
          setSelectedPage("/tax");
        }, 1200);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: message,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message || "Failed to create tax",
      });
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
        Add Tax
      </Typography>

      <div className="mb-4 flex items-center gap-4">
        <TextField
          label="Percentage % e.g 20"
          name="percentage"
          value={formData.percentage}
          onChange={handleChange}
          fullWidth
          required
        />

        <TextField
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          fullWidth
          required
        />
      </div>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setSelectedPage("/tax")}
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
          {loading ? <ClipLoader size={28} color="#fff" /> : "Add Tax"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddTaxForm;
