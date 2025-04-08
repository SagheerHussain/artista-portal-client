import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Box,
  Paper,
  Input,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonAdd as RegisterIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { registerAccount } from "../../../services/authService";
import Swal from "sweetalert2";
import { HashLoader } from "react-spinners";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // navigate
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await registerAccount(formData);

      if (
        formData.name === "" ||
        formData.email === "" ||
        formData.password === ""
      ) {
        Swal.fire({
          icon: "error",
          text: "All Fields are required",
          timer: 1500,
        });
        setLoading(false);
        return;
      }

      if (response.success) {
        setLoading(false);
        Swal.fire({
          icon: "success",
          text: "Successfully Register Account",
          timer: 1500,
        });
        setTimeout(() => {
          navigate("/");
        }, 2500);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Failed to Register Account",
        timer: 1500,
      });
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          backgroundColor: "#1E1E1E",
          color: "white",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ mb: 3, color: "#90caf9" }}
        >
          Create an account
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            required
            InputProps={{
              sx: { color: "white" },
            }}
            sx={{
              "& label": { color: "#90caf9" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#90caf9" },
                "&:hover fieldset": { borderColor: "#64b5f6" },
                "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                "& input": { color: "white" },
              },
            }}
          />
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            required
            InputProps={{
              sx: { color: "white" },
            }}
            sx={{
              "& label": { color: "#90caf9" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#90caf9" },
                "&:hover fieldset": { borderColor: "#64b5f6" },
                "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                "& input": { color: "white" },
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            required
            InputProps={{
              sx: { color: "white" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ color: "#90caf9" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& label": { color: "#90caf9" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#90caf9" },
                "&:hover fieldset": { borderColor: "#64b5f6" },
                "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                "& input": { color: "white" },
              },
            }}
          />

          <TextField
            fullWidth
            type="file"
            variant="outlined"
            margin="normal"
            name="profilePicture"
            onChange={handleFileChange}
            InputProps={{
              sx: { color: "white" },
            }}
            sx={{
              "& label": { color: "#90caf9" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#90caf9" },
                "&:hover fieldset": { borderColor: "#64b5f6" },
                "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                "& input": { color: "white" },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            startIcon={!loading && <RegisterIcon />}
            sx={{
              mt: 2,
              p: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
            disabled={loading}
          >
            {loading ? <HashLoader color="#fff" size={22} /> : "Register"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2, color: "#90caf9" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#64b5f6" }}>
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
