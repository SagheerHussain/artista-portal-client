import { useState } from "react";
import { Link } from "react-router-dom";
import { registerAccount } from "../../../services/authService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import logoSrc from "/Images/logo.png";
import authImage from "/Images/auth-illustration.png";
import { ClipLoader } from "react-spinners";
import { FaEye } from "react-icons/fa";

const Register = () => {
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

  const handleRegister = async (e) => {
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
    <div
      className="auth_layout flex justify-between items-center"
      style={{ backgroundColor: "#070a13", minHeight: "100vh" }}
    >
      {/* Left: Auth Form */}
      <div className="auth_children p-8 lg:w-[65vw]  xl:w-1/2 flex justify-center">
        <div
          className="auth_form p-10 flex flex-col items-center justify-center min-h-full lg:w-3/4"
          style={{ backgroundColor: "#12141d" }}
        >
          <div className="mb-6">
            <img
              src={logoSrc}
              alt="Artista Digitals"
              className="max-w-[200px]"
            />
          </div>
          <form onSubmit={handleRegister} className="auth_user_form w-full">
            <label htmlFor="" className="text-white text-sm mb-3">
              Profile Picture (Optional)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              name="profilePicture"
              placeholder="Profile Picture"
              className="w-full px-4 py-2 mb-4 border-none text-white focus:outline-none"
              style={{ backgroundColor: "#232839", borderRadius: "3px" }}
            />

            <label htmlFor="" className="text-white text-sm pb-3">
              Full Name*
            </label>
            <input
              type="name"
              name="name"
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-2 mb-4 border-none text-white focus:outline-none rouned-[25x]"
              style={{ backgroundColor: "#232839", borderRadius: "3px" }}
            />

            <label htmlFor="" className="text-white text-sm pb-3">
              Email*
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 mb-4 border-none text-white focus:outline-none rouned-[25x]"
              style={{ backgroundColor: "#232839", borderRadius: "3px" }}
            />

            <div className="password w-full">
              <label htmlFor="" className="text-white text-sm mb-3">
                Password*
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-4 py-2 mb-4 border-none text-white focus:outline-none rouned-[15px]"
                  style={{ backgroundColor: "#232839", borderRadius: "3px" }}
                />
                <FaEye
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white absolute top-1/2 right-1 -translate-y-full hover:text-[#eee] cursor-pointer -translate-x-1/2"
                />
              </div>
            </div>

            <button className="bg-[#878aff] hover:bg-[#767bfc] text-white px-8 py-1 text-lg rounded hover:text-white rouned-[15px] w-full font-semibold">
              {loading ? (
                <ClipLoader color="#fff" size={22} />
              ) : (
                "Register Account"
              )}
            </button>

            <p className="mt-4 text-white">
              Dont have an account{" "}
              <Link
                to={`/`}
                style={{ paddingRight: "5px" }}
                className="text-[#878aff] underline inline-block"
              >
                Login
              </Link>
              here
            </p>

            {/* <div className="mt-4">
              <Link to={`/resend-email`} className="text-zinc-400 ">
                Forget Password?
              </Link>
            </div> */}
          </form>
        </div>
      </div>

      {/* Right: Image Section */}
      <div className="auth_image fixed top-0 right-0 lg:w-[35vw] xl:w-1/2 h-screen">
        <img
          src={authImage}
          alt="Auth Illustration"
          className="w-full"
          style={{ height: "100vh" }}
        />
      </div>
    </div>
  );
};

export default Register;
