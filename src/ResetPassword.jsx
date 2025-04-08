import React, { useState } from "react";
import { resetPassword } from "../services/authService";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { FaEye } from "react-icons/fa";

const ResetAppPassword = () => {
  // State Variables
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState("");

  // Get Params
  const { token } = useParams();

  // navigate
  const navigate = useNavigate();

  // Verify Email
  const resetPasswordVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { password };
    try {
      const { success, message } = await resetPassword(token, data);
      if (success) {
        Swal.fire({
          title: message,
          timer: 700,
          icon: "success",
        });
        setLoading(false);
        setTimeout(() => {
          navigate("/");
        }, 1200);
      }
    } catch (error) {
      Swal.fire({
        title: "Something went wrong",
        icon: "error",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="verification_email p-10 flex justify-center items-center"
        style={{ backgroundColor: "#070a13", height: "100vh", width: "100vw" }}
      >
        <form
          onSubmit={resetPasswordVerification}
          className="verification_email_form"
          style={{
            minWidth: "600px",
            height: "150px",
            margin: "0 auto",
            padding: "1rem",
            backgroundColor: "#12141d",
          }}
        >
          <label htmlFor="" className="text-[#ccc] text-sm mb-3">
            New Password*
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 mb-4 border-none text-white focus:outline-none rounded-[5px]"
              style={{ backgroundColor: "#232839" }}
            />
            <FaEye
              onClick={() => setShowPassword(!showPassword)}
              className="text-white absolute top-1/2 right-1 -translate-y-full hover:text-[#eee] cursor-pointer -translate-x-1/2"
            />
          </div>
          <Button
            disabled={loading}
            color="secondary"
            variant="contained"
            type="submit"
          >
            {loading ? (
              <ClipLoader color="#fff" size={20} />
            ) : (
              "Reset Your Password"
            )}
          </Button>
        </form>
      </div>
    </>
  );
};

export default ResetAppPassword;
