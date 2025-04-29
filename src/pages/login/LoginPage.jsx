import { useState } from "react";
import { Link } from "react-router-dom";
import { loginAccount } from "../../../services/authService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import logoSrc from "/Images/logo.png";
import authImage from "/Images/auth-illustration.jpg";
import { ClipLoader } from "react-spinners";
import { FaEye } from "react-icons/fa";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // navigate
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    console.log("form data", formData);
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.email === "" || formData.password === "") {
        Swal.fire({
          icon: "error",
          text: "All Fields are required",
          timer: 1500,
        });
        setLoading(false);
        return;
      }
      const user = await loginAccount(formData);
      console.log("user", user);
      if (user.success === true) {
        setLoading(false);
        Swal.fire({
          icon: "success",
          text: user.message,
          timer: 800,
        });
        // Stored token in localStorage
        localStorage.setItem("token", JSON.stringify(user.token));
        localStorage.setItem("user", JSON.stringify(user.user));
        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      } else throw new Error(user.message);
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        text: error.message,
        timer: 1500,
      });
    }
  };

  return (
    <div
      className="auth_layout flex justify-between items-center"
      style={{ backgroundColor: "#AB7CFE", minHeight: "100vh" }}
    >
      {/* Left: Auth Form */}
      <div className="auth_children p-8 lg:w-[65vw]  xl:w-1/2 flex justify-center">
        <div
          className="auth_form p-10 flex flex-col items-center rounded-2xl justify-center min-h-full lg:w-3/4"
          style={{ backgroundColor: "#fff" }}
        >
          {/* <div className="mb-6">
            <img
              src={logoSrc}
              alt="Artista Digitals"
              className="max-w-[200px]"
            />
          </div> */}
          <form onSubmit={handleLogin} className="auth_user_form w-full">
            <label htmlFor="" className="text-[#061C34] text-sm pb-3">
              Email*
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="sagheer@artistadigitals.com"
              className="w-full px-4 py-2 mb-4 border-none text-[#AC7CFE] focus:outline-none rouned-[25x]"
              style={{ backgroundColor: "#fff", borderRadius: "3px" }}
            />

            <div className="password w-full">
              <label htmlFor="" className="text-[#061C34] text-sm mb-3">
                Password*
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full px-4 py-2 mb-4 border-none text-[#AC7CFE] focus:outline-none rouned-[15px]"
                  style={{ backgroundColor: "#fff", borderRadius: "3px" }}
                />
                <FaEye
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#AC7CFE] absolute top-1/2 right-1 -translate-y-full hover:text-[#eee] cursor-pointer -translate-x-1/2"
                />
              </div>
            </div>

            <button className="bg-[#AB7CFE] hover:bg-[#061C34] text-white px-8 py-1 text-lg rounded-2xl hover:text-white rouned-[15px] w-full">
              {loading ? (
                <ClipLoader color="#fff" size={22} />
              ) : (
                "Login Account"
              )}
            </button>

            {/* <p className="mt-4 text-white">
              Dont have an account{" "}
              <Link
                to={`/register`}
                style={{ paddingRight: "5px" }}
                className="text-[#878aff] underline inline-block"
              >
                Register
              </Link>
              here
            </p> */}

            <div className="mt-4">
              <Link
                to={`/resend-email`}
                className="text-[#061C34] hover:text-zinc-400 underline"
              >
                Forget Password?
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right: Image Section */}
      <div className="auth_image fixed top-0 right-0 lg:w-[35vw] xl:w-1/2 h-screen relative">
        {/* Background Image */}
        <img
          src={authImage}
          alt="Auth Illustration"
          className="w-full h-full object-cover"
        />
        <a
          href="https://www.artistadigitals.com"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-16 right-10 bg-[#AB7CFE] hover:bg-[#061C34] text-white px-6 py-2 text-lg rounded-2xl shadow-md"
        >
          Visit Website
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
