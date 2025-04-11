import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import { createAnnouncement } from "../../../services/announcement";

const AddAnnouncementForm = ({ setSelectedPage }) => {
  // Token
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));

  // State Variables
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    announcement: "",
    admin: user?._id,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.announcement || !formData.admin) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "All fields are required",
      });
      setLoading(false);
      return;
    }
    try {
      const { success, message } = await createAnnouncement(token, formData);
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: message,
          timer: 800,
        });
        setLoading(false);
        setTimeout(() => {
          setSelectedPage("/announcement");
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
        Add Announcement
      </Typography>

      <div className="mb-4 flex items-center gap-4">
        <TextField
          label="Announcement"
          name="announcement"
          value={formData.announcement}
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
          {loading ? <ClipLoader size={28} color="#fff" /> : "Add Announcement"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddAnnouncementForm;
