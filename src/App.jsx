import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/Register";
import DashboardPage from "./pages/Dashboard/Dashboard";
import { ProtectedRoute } from "./components";
import ResendEmail from "./ResendEmail";
import ResetAppPassword from "./ResetPassword";
import { useEffect } from "react";

function App() {
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("toolpad-mode", "dark");
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      {/* <Route path="/register" element={<RegisterPage />} /> */}
      <Route path="/resend-email" element={<ResendEmail />} />
      <Route path="/reset-password/:token" element={<ResetAppPassword />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
