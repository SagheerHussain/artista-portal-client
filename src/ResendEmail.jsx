import React, { useState } from "react";
import Swal from "sweetalert2";
import { resendEmail } from "../services/authService";
import { ClipLoader } from "react-spinners";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const ResendEmail = () => {
  // State Variables
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  // Verify Email
  const resendEmailVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { email };
      const { success, message } = await resendEmail(data);
      if (success) {
        Swal.fire({
          title: message,
          timer: 2000,
          icon: "success",
        });
        setLoading(false);
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
          onSubmit={resendEmailVerification}
          className="verification_email_form"
          style={{
            minWidth: "600px",
            height: "150px",
            margin: "0 auto",
            padding: "1rem",
            backgroundColor: "#12141d",
          }}
        >
          <label htmlFor="" className="text-[#ccc] text-sm pb-3">
            Email*
          </label>
          <input
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 mb-4 border-none text-white focus:outline-none rounded-[5px]"
            style={{ backgroundColor: "#232839" }}
          />
          <Link to={"/"} className="me-3">
            <Button
              type="submit"
              color="primary"
              variant="contained"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            color="secondary"
            variant="contained"
          >
            {loading ? (
              <ClipLoader color="#fff" size={20} />
            ) : (
              "Send Verification Email"
            )}
          </Button>
        </form>
      </div>
    </>
  );
};

export default ResendEmail;
