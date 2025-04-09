import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { createSale, getPaymentMethods } from "../../../services/sales";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";

const AddSalesForm = ({ setSelectedPage }) => {
  // Get User & Token
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));

  // State Variable
  const [formData, setFormData] = useState({
    clientName: "",
    projectTitle: "",
    summary: "",
    upfrontAmount: "",
    totalAmount: "",
    paymentMethod: "",
    status: "",
    user: user?._id || "",
  });
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Payment Methods
  const fetchPaymentMethods = async () => {
    try {
      const { paymentMethods } = await getPaymentMethods(token);
      console.log(paymentMethods);
      setPaymentTypes(paymentMethods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  // Fetch Payment Methods
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.clientName ||
      !formData.projectTitle ||
      !formData.summary ||
      !formData.upfrontAmount ||
      !formData.totalAmount ||
      !formData.paymentMethod ||
      !formData.status
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "All fields are required",
      });
      setLoading(false);
      return;
    }

    try {
      const { message, success } = await createSale(formData, token);
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: message,
          timer: 1500,
        });
        setLoading(false);
        setTimeout(() => {
          setSelectedPage("/reports/sales");
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
      setLoading(false);
      console.error("Error creating sale:", error);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#121212", p: 3, borderRadius: 2 }}>
      <Typography variant="h6" color="white" gutterBottom>
        Add Sales
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Client Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Project Title"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              required
              sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              label="Summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Upfront Amount"
              name="upfrontAmount"
              type="number"
              value={formData.upfrontAmount}
              onChange={handleChange}
              required
              sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Total Amount"
              name="totalAmount"
              type="number"
              value={formData.totalAmount}
              onChange={handleChange}
              required
              sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Payment Method"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
              sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
            >
              {paymentTypes?.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.method}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
            >
              {["Pending", "Partially Paid", "Fully Paid"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Box
          mt={2}
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setSelectedPage("/reports/sales")}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? <ClipLoader size={28} color="#fff" /> : "Add Sale"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddSalesForm;
