import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Typography,
  Modal,
  Grid,
  Button,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import { updatePaymentMethod } from "../../../services/paymentMethod";

const EditPaymentMethodModal = ({
  open,
  onClose,
  initialData,
  refetchSales,
}) => {
  // Get User & Token
  const token = JSON.parse(localStorage.getItem("token"));

  // State Variables
  const [loading, setLoading] = useState(false);
  const [paymentMethodData, setPaymentMethodData] = useState(initialData || {});

  // Update state when initialData changes
  useEffect(() => {
    setPaymentMethodData(initialData || {});
  }, [initialData]);

  const handleChange = (e) => {
    setPaymentMethodData({
      ...paymentMethodData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { success, message } = await updatePaymentMethod(
        paymentMethodData._id,
        paymentMethodData,
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
      <DialogTitle>Edit Payment Method</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} className="py-4">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Payment Method Name"
              name="method"
              defaultValue={paymentMethodData.method}
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

export default EditPaymentMethodModal;
