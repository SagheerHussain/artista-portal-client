import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
} from "@mui/material";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import { updateTax } from "../../../services/tax";
import { useDispatch } from "react-redux";
import { fetchAnalytics } from "../../store/analyticsSlice";
import { updateAnnouncement } from "../../../services/announcement";

const EditAnnouncementModal = ({
  open,
  onClose,
  initialData,
  refetchTaxes,
}) => {
  // Get User & Token
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));

  const dispatch = useDispatch();

  // State Variables
  const [loading, setLoading] = useState(false);
  const [announcementData, setAnnouncementData] = useState(initialData || {});

  // Update state when initialData changes
  useEffect(() => {
    setAnnouncementData(initialData || {});
  }, [initialData]);

  const handleChange = (e) => {
    setAnnouncementData({ ...announcementData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { success, message } = await updateAnnouncement(
        token,
        announcementData._id,
        announcementData
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
        dispatch(fetchAnalytics({ user, token }));
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating expense:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Announcement</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} className="py-4">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Announcement"
              name="announcement"
              defaultValue={announcementData.announcement || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Status"
              name="status"
              fullWidth
              margin="dense"
              value={announcementData?.status || ""}
              onChange={handleChange}
            >
              {["active", "inactive"].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
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

export default EditAnnouncementModal;
