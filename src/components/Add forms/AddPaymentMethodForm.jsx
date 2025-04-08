import React, { useState } from "react";
import { TextField, Button, Box, MenuItem, Typography } from "@mui/material";
import { ClipLoader } from "react-spinners";
import { createPaymentMethod } from "../../../services/paymentMethod";
import Swal from "sweetalert2";

const AddPaymentMethodForm = ({ setSelectedPage }) => {
  // Token
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));

  // State Variables
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    method: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.method) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Payment Method is required",
      });
      setLoading(false);
      return;
    }
    try {
      const { success, message } = await createPaymentMethod(formData, token);
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: message,
          timer: 1500,
        });
        setLoading(false);
        setTimeout(() => {
          setSelectedPage("/reports/paymentMethods");
        }, 2000);
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
          error.response?.data?.message || "Failed to create payment method",
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
        Add Payment Method
      </Typography>

      <div className="mb-4 w-full">
        <TextField
          label="Payment Method Name"
          name="method"
          value={formData.method}
          onChange={handleChange}
          fullWidth
          required
        />
      </div>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setSelectedPage("/reports/paymentMethods")}
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
          {loading ? <ClipLoader size={28} color="#fff" /> : "Add Category"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddPaymentMethodForm;
