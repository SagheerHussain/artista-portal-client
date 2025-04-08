import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  Box,
  Typography,
  Modal,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
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

  const [paymentTypes, setPaymentTypes] = useState([]);
  const [previousReceived, setPreviousReceived] = useState(0);

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
        receivedAmount: 0, // Fresh input ke liye empty
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

      setPreviousReceived(Number(sale.receivedAmount || 0)); // Save previous received
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
      const newInput = Number(value);
      const totalReceivedCheck =
        Number(formData.upfrontAmount) + previousReceived + newInput;

      if (totalReceivedCheck > Number(formData.totalAmount)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Received amount cannot exceed total amount",
        });
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        [name]: newInput,
      }));
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Cancel Popup
  const handleCancelPopup = () => {
    onClose();
  };

  // Calculations
  const totalRecievedAmount =
    Number(formData.upfrontAmount) +
    previousReceived +
    Number(formData.receivedAmount);

  const remainingAmount = Math.max(
    Number(formData.totalAmount) - totalRecievedAmount,
    0
  );

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      remainingAmount: remainingAmount,
    }));
  }, [formData.receivedAmount, formData.totalAmount, formData.upfrontAmount]);

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalReceivedAmount =
      previousReceived + Number(formData.receivedAmount);

    if (
      Number(formData.upfrontAmount) + finalReceivedAmount >
      Number(formData.totalAmount)
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Received amount cannot exceed total amount",
      });
      return;
    }

    const updatedForm = {
      ...formData,
      receivedAmount: finalReceivedAmount,
      remainingAmount:
        Number(formData.totalAmount) -
        (Number(formData.upfrontAmount) + finalReceivedAmount),
    };

    try {
      const { success, message } = await updateSale(saleId, updatedForm, token);
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: message,
          timer: 1500,
        });
        onClose();
        refetchSales();
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

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>Edit Sales</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} className="py-4">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Client Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ borderRadius: 1 }}
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
              sx={{ borderRadius: 1 }}
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
              sx={{ borderRadius: 1 }}
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
              sx={{ borderRadius: 1 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Received Amount $"
              name="receivedAmount"
              type="number"
              value={formData.receivedAmount}
              onChange={handleChange}
              disabled={remainingAmount === 0 ? true : false}
              InputLabelProps={{ shrink: true }}
              sx={{ borderRadius: 1 }}
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
              sx={{ borderRadius: 1 }}
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
              sx={{ borderRadius: 1 }}
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
              sx={{ borderRadius: 1 }}
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
              sx={{ borderRadius: 1 }}
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
              sx={{ borderRadius: 1 }}
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
              sx={{ borderRadius: 1 }}
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
              sx={{ borderRadius: 1 }}
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
              sx={{ borderRadius: 1 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSalesModal;
