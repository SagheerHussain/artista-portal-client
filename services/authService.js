import axios from "axios";

export const registerAccount = async (formData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/register`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error adding user:", error);
  }
};

// Login Account
export const loginAccount = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

export const resendEmail = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/forget-password`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error resending verification email:", error);
    alert("Failed to resend verification email");
  }
};

export const resetPassword = async (token, data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/reset-password/${token}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    alert("Failed to reset password");
  }
};