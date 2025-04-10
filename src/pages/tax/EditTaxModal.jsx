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
import { updateTax } from "../../../services/tax";

const EditTaxModal = ({
  open,
  onClose,
  initialData,
  refetchTaxes,
}) => {
  // Get User & Token
  const token = JSON.parse(localStorage.getItem("token"));

  // State Variables
  const [loading, setLoading] = useState(false);
  const [taxData, setTaxData] = useState(initialData || {});

  // Update state when initialData changes
  useEffect(() => {
    setTaxData(initialData || {});
  }, [initialData]);

  const handleChange = (e) => {
    setTaxData({ ...taxData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { success, message } = await updateTax(
        token,
        taxData._id,
        taxData
      );
      if (success) {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: message,
          timer: 800,
        });
        refetchTaxes();
        onClose();
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating expense:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Tax</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} className="py-4">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Percentage % e.g 20"
              name="percentage"
              defaultValue={taxData.percentage || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              name="date"
              defaultValue={taxData.date.split("T")[0] || ""}
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

export default EditTaxModal;
