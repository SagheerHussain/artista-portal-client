import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  Box,
  Typography,
  Modal,
} from "@mui/material";
import {
  getPaymentMethods,
  getSaleById,
  updateSale,
} from "../../../services/sales";
import Swal from "sweetalert2";

const EditSalesModal = ({
  open,
  saleId,
  onClose,
  initialData,
  onSubmit,
  refetchSales,
}) => {
  const token = JSON.parse(localStorage.getItem("token"));

  const [formData, setFormData] = useState({
    clientName: "",
    projectTitle: "",
    summary: "",
    totalAmount: "",
    upfrontAmount: "",
    receivedAmount: "",
    remainingAmount: "",
    paymentMethod: "",
    status: "",
    month: "",
    year: "",
    leadDate: "",
  });
  const [recievedAmount, setRecievedAmount] = useState("");

  const [paymentTypes, setPaymentTypes] = useState([]);

  // Fetch Payment Methods
  const fetchPaymentMethods = async () => {
    try {
      const { paymentMethods } = await getPaymentMethods(token);
      setPaymentTypes(paymentMethods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  // Fetch Existing Sale Data
  const fetchSaleData = async () => {
    if (!saleId) return;
    try {
      const { sale } = await getSaleById(saleId, token);

      setFormData({
        clientName: sale.clientName || "",
        projectTitle: sale.projectTitle || "",
        summary: sale.summary || "",
        totalAmount: sale.totalAmount || 0,
        upfrontAmount: sale.upfrontAmount || 0,
        receivedAmount: sale.receivedAmount || 0,
        remainingAmount: sale.remainingAmount || 0,
        paymentMethod: sale.paymentMethod?._id || "",
        status: sale.status || "",
        month: sale.month || "",
        year: sale.year || "",
        startDate: sale.startDate || "",
        endDate: sale.endDate || "",
        deadline: sale.deadline || "",
        leadDate: sale.leadDate || "",
        user: sale.user || "",
      });
    } catch (error) {
      console.error("Error fetching sale data:", error);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    if (saleId) {
      fetchSaleData();
    }
  }, [saleId]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "receivedAmount") {
      setRecievedAmount(Number(value));

      // Also update in formData to keep in sync
      // setFormData((prevData) => ({
      //   ...prevData,
      //   receivedAmount: Number(value),
      // }));
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Cancel Popup
  const handleCancelPopup = () => {
    onClose();
    setRecievedAmount(0);
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        Number(formData.receivedAmount) + Number(formData.upfrontAmount) >
        Number(formData.totalAmount)
      ) {
        onClose();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Received amount cannot exceed total amount",
        });
        setRecievedAmount(0);
        return;
      }

      const { success, message } = await updateSale(saleId, formData, token);
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: message,
          timer: 1500,
        });
        onClose();
        refetchSales();
        setRecievedAmount(0);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: message,
        });
      }
    } catch (error) {
      console.error("Error updating sale:", error);
    }
  };

  // Calcualte Total Amount
  const totalRecievedAmount =
    Number(formData.upfrontAmount) +
    Number(formData.receivedAmount) +
    recievedAmount;
  const remainingAmount = Number(formData.totalAmount) - totalRecievedAmount;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          backgroundColor: "#121212",
          p: 3,
          borderRadius: 2,
          maxWidth: 800,
          margin: "auto",
          marginTop: "5%",
        }}
      >
        <Typography variant="h6" color="white" gutterBottom>
          Edit Sales
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Upfront Amount $"
                name="upfrontAmount"
                type="number"
                value={formData.upfrontAmount}
                disabled
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Received Amount $"
                name="receivedAmount"
                type="number"
                value={recievedAmount}
                onChange={handleChange}
                disabled={formData.remainingAmount === 0 ? true : false}
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Received Amount $"
                type="number"
                value={totalRecievedAmount}
                disabled
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Remaining Amount $"
                type="number"
                value={remainingAmount}
                disabled
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Amount $"
                name="totalAmount"
                type="number"
                value={formData.totalAmount}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
              >
                {["Pending", "Partially Paid", "Fully Paid"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Month"
                name="month"
                value={formData.month}
                disabled
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Year"
                name="year"
                value={formData.year}
                disabled
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Lead Date"
                name="leadDate"
                type="date"
                value={formData.leadDate?.split("T")[0]}
                fullWidth
                disabled
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
              />
            </Grid>
          </Grid>

          <Box
            mt={2}
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={handleCancelPopup}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Save Changes
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditSalesModal;
