import React, { useEffect, useState } from "react";
import { Box, Grid, TextField, Typography, Modal, Button, MenuItem } from "@mui/material";
import Swal from "sweetalert2";
import { getEmployeeById, updateEmployee } from "../../../services/users";
import { ClipLoader } from "react-spinners";

const EditUserModal = ({
  open,
  userId,
  refetchUsers,
  onClose,
  initialData,
  onSubmit,
}) => {
  const token = JSON.parse(localStorage.getItem("token"));

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    profilePicture: "",
  });

  const fetchEmployeeData = async () => {
    try {
      const response = await getEmployeeById(userId, token);
      if (response.success) {
        setFormData({
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          profilePicture: response.user.profilePicture,
        });
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  // Cancel Popup
  const handleCancelPopup = () => {
    onClose();
  };

  // Value Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // File Change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  //   Edit User Details
  const handleEditUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateEmployee(userId, formData, token);
      if (response.success) {
        Swal.fire({
          icon: "success",
          text: response.message,
          timer: 1500,
        });
        onClose();
        refetchUsers();
        setLoading(false);
      } else {
        Swal.fire({
          icon: "error",
          text: response.message,
          timer: 800,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        text: "Failed to update user",
        timer: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

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
        <form onSubmit={handleEditUser}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                defaultValue={formData.name}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                defaultValue={formData.email}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Role"
                name="role"
                fullWidth
                disabled={true}
                margin="dense"
                value={formData?.role || ""}
                onChange={handleChange}
              >
                {["admin", "employee"].map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Status"
                name="status"
                fullWidth
                margin="dense"
                value={formData?.status || "active"}
                onChange={handleChange}
              >
                {["active", "resigned"].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="file"
                fullWidth
                label="Profile Picture"
                name="profilePicture"
                onChange={handleFileChange}
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
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : "Edit Profile"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditUserModal;
