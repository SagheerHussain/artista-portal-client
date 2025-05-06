import * as React from "react";
import logoSrc from "/Images/logo.png";
import { useEffect, useState } from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import AddSalesForm from "@components/Add forms/AddSalesForm";
import ExpenseForm from "@components/Add forms/ExpenseForm";
import UsersTable from "../../pages/users/UsersTable";
import SalesTable from "../../pages/sales/SalesTable";
import ExpenseTable from "../../pages/expenses/ExpenseTable";
import SalariesTable from "../../pages/salaries/SalariesTable";
import AddSalaryForm from "@components/Add forms/AddSalaryForm";
import currencyRates from "../../hooks/currencyRates";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { MonetizationOn } from "@mui/icons-material";
import MultiBarCharts from "@components/Charts/MultiBarCharts";
import ProfitLossChart from "@components/Charts/ProfitLossChart";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ExpenseCategoryTable from "../../pages/expense category/ExpenseCategoryTable";
import ExpenseCategoryForm from "../../components/Add forms/ExpenseCategoryForm";
import PaymentMethodTable from "../payment methods/PaymentMethodTable";
import AddPaymentMethodForm from "../../components/Add forms/AddPaymentMethodForm";
import AddUser from "../../components/Add forms/AddUser";
import TaxTable from "../tax/TaxTable";
import AddTaxForm from "../../components/Add forms/AddTaxForm";
import { useDispatch, useSelector } from "react-redux";
import CampaignIcon from "@mui/icons-material/Campaign";
import { fetchAnalytics } from "../../store/analyticsSlice";
import AnnouncementTable from "../announcements/AnnouncementTable";
import AddAnnouncementForm from "../../components/Add forms/AddAnnouncementForm";
import { getActiveAnnouncements } from "../../../services/announcement";
import HeaderWithUser from "./HeaderWithUser";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#121212", paper: "#1E1E1E" },
    primary: { main: "#90caf9" },
    secondary: { main: "#f48fb1" },
    text: { primary: "#ffffff", secondary: "#b0bec5" },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    }),
    [pathname]
  );

  return router;
}

const DashboardCard = styled(Card)(({ theme = "dark" }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  transition: "0.3s",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
  },
}));

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [session, setSession] = React.useState({
    user: {
      name: user.name || "User",
      email: user.email || "user@example.com",
      image:
        user.profilePicture ||
        "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
  });

  // Navigate
  const navigate = useNavigate();

  // Profile Menu
  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: user.name,
            email: user.email,
            image: user.image,
          },
        });
      },
      signOut: () => {
        setSession(null);
        Swal.fire({
          title: "Logout",
          text: "You have been logged out.",
          icon: "success",
          confirmButtonText: "OK",
          timer: 1000,
        }).then(() => {
          localStorage.clear();
          navigate("/");
        });
      },
    };
  }, []);

  // Exchange Rates
  const rates = currencyRates();

  const NAVIGATION = [
    { kind: "header", title: "Main" },
    { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },

    // Conditional Users segment
    user?.role === "admin"
      ? { segment: "users", title: "Users", icon: <PeopleAltIcon /> }
      : null,

    user?.role === "admin"
      ? {
          segment: "tax",
          title: "Tax Deduction",
          icon: <AssuredWorkloadIcon />,
        }
      : null,

    user?.role === "admin"
      ? {
          segment: "announcement",
          title: "Announcement",
          icon: <CampaignIcon />,
        }
      : null,

    { kind: "divider" },
    { kind: "header", title: "Analytics" },
    {
      segment: "reports",
      title: "Reports",
      icon: <BarChartIcon />,
      children: [
        { segment: "sales", title: "Sales", icon: <DescriptionIcon /> },
        ...(user?.role === "admin"
          ? [
              {
                segment: "salaries",
                title: "Salaries",
                icon: <LocalAtmIcon />,
              },
              {
                segment: "expenses",
                title: "Expenses",
                icon: <MonetizationOn />,
              },
              {
                segment: "expenseCategory",
                title: "Expense Category",
                icon: <CategoryIcon />,
              },
              {
                segment: "paymentMethods",
                title: "Payment Methods",
                icon: <PointOfSaleIcon />,
              },
            ]
          : []),
      ],
    },
  ].filter(Boolean); // 💥 This line removes null/false items

  // Get Token From Storage
  const token = JSON.parse(localStorage.getItem("token"));

  // dispatch
  const dispatch = useDispatch();

  // Analytics
  const {
    totalRevenue,
    totalRecievedAmount,
    pendingAmount,
    clients,
    tax,
    netProfit,
  } = useSelector((state) => state.analytics);

  const router = useDemoRouter("/dashboard");
  const [selectedPage, setSelectedPage] = React.useState("dashboard");
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    dispatch(fetchAnalytics({ user, token }));
  }, [dispatch, selectedPage]);

  React.useEffect(() => {
    setSelectedPage(router.pathname);
  }, [router.pathname]);

  const totalExpenses =
    netProfit?.data?.totalExpenses?.USD + netProfit?.data?.totalSalaries?.USD;

  // Get Active Announcement
  useEffect(() => {
    async function fetchActiveAnncouncements() {
      try {
        const { announcements, success } = await getActiveAnnouncements(token);
        if (success) {
          setAnnouncements(announcements);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (user?.role === "employee") {
      fetchActiveAnncouncements();
    }
  }, [user]);

  return (
    <ThemeProvider theme={darkTheme}>
      <AppProvider
        branding={{
          logo: <img src={logoSrc} alt="Artista Digitals" />,
          homeUrl: "/",
        }}
        navigation={NAVIGATION}
        session={session}
        authentication={authentication}
        router={{
          ...router,
          navigate: (path) => {
            setSelectedPage(path);
            router.navigate(path);
          },
        }}
      >
        {" "}
        <DashboardLayout>
          <PageContainer sx={{ maxWidth: "1600px !important" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {selectedPage === "/users" ? (
                <UsersTable setSelectedPage={setSelectedPage} />
              ) : selectedPage === "/tax" ? (
                <TaxTable setSelectedPage={setSelectedPage} />
              ) : selectedPage === "/announcement" ? (
                <AnnouncementTable setSelectedPage={setSelectedPage} />
              ) : selectedPage === "/reports/sales" ? (
                <SalesTable setSelectedPage={setSelectedPage} />
              ) : selectedPage === "/reports/expenses" ? (
                <ExpenseTable setSelectedPage={setSelectedPage} />
              ) : selectedPage === "/reports/expenseCategory" ? (
                <ExpenseCategoryTable setSelectedPage={setSelectedPage} />
              ) : selectedPage === "/reports/paymentMethods" ? (
                <PaymentMethodTable setSelectedPage={setSelectedPage} />
              ) : selectedPage === "/addUser" ? (
                <AddUser setSelectedPage={setSelectedPage} />
              ) : selectedPage === "/addSales" ? (
                <AddSalesForm setSelectedPage={setSelectedPage} />
              ) : selectedPage === "/addExpense" ? (
                <ExpenseForm setSelectedPage={setSelectedPage} />
              ) : selectedPage === "/addExpenseCategory" ? (
                <ExpenseCategoryForm setSelectedPage={setSelectedPage} />
              ) : selectedPage === "/addPaymentMethod" ? (
                <AddPaymentMethodForm setSelectedPage={setSelectedPage} />
              ) : selectedPage === "/reports/salaries" ? (
                <SalariesTable setSelectedPage={setSelectedPage} />
              ) : selectedPage === "/addSalary" ? (
                <AddSalaryForm setSelectedPage={setSelectedPage} />
              ) : selectedPage === "/addTax" ? (
                <AddTaxForm setSelectedPage={setSelectedPage} />
              ) : selectedPage === "/addAnnouncement" ? (
                <AddAnnouncementForm setSelectedPage={setSelectedPage} />
              ) : (
                <>
                  {/* Announcements */}
                  <div
                    className={`bg-[#674fb8] flex items-center ${announcements.length > 0 ? "py-1" : "py-0"} [mask-image:linear-gradient(to_right,transparent,black_7%,black_90%,transparent)]`}
                  >
                    <marquee
                      behavior=""
                      direction=""
                      className="text-white flex items-center"
                    >
                      {announcements.length > 0 &&
                        announcements?.reverse().map(({ announcement }) => (
                          <span className="me-20">
                            <CampaignIcon
                              size={20}
                              className="text-white pb-1 pe-2"
                            />
                            {announcement}
                          </span>
                        ))}
                    </marquee>
                  </div>

                  {/* Dashboard Live Currency Exhange Rates Cards */}
                  {user?.role === "admin" && (
                    <Grid container spacing={3}>
                      <Grid item xs={6} sm={6} lg={3}>
                        <DashboardCard
                          sx={{ width: "100%", marginRight: "1.5rem" }}
                        >
                          <IconButton color="secondary">
                            {/* https://nucleoapp.com/svg-flag-icons */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="45"
                              height="45"
                              viewBox="0 0 32 32"
                            >
                              <rect
                                x="1"
                                y="4"
                                width="30"
                                height="24"
                                rx="4"
                                ry="4"
                                fill="#fff"
                              ></rect>
                              <path
                                d="M1.638,5.846H30.362c-.711-1.108-1.947-1.846-3.362-1.846H5c-1.414,0-2.65,.738-3.362,1.846Z"
                                fill="#a62842"
                              ></path>
                              <path
                                d="M2.03,7.692c-.008,.103-.03,.202-.03,.308v1.539H31v-1.539c0-.105-.022-.204-.03-.308H2.03Z"
                                fill="#a62842"
                              ></path>
                              <path
                                fill="#a62842"
                                d="M2 11.385H31V13.231H2z"
                              ></path>
                              <path
                                fill="#a62842"
                                d="M2 15.077H31V16.923000000000002H2z"
                              ></path>
                              <path
                                fill="#a62842"
                                d="M1 18.769H31V20.615H1z"
                              ></path>
                              <path
                                d="M1,24c0,.105,.023,.204,.031,.308H30.969c.008-.103,.031-.202,.031-.308v-1.539H1v1.539Z"
                                fill="#a62842"
                              ></path>
                              <path
                                d="M30.362,26.154H1.638c.711,1.108,1.947,1.846,3.362,1.846H27c1.414,0,2.65-.738,3.362-1.846Z"
                                fill="#a62842"
                              ></path>
                              <path
                                d="M5,4h11v12.923H1V8c0-2.208,1.792-4,4-4Z"
                                fill="#102d5e"
                              ></path>
                              <path
                                d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
                                opacity=".15"
                              ></path>
                              <path
                                d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
                                fill="#fff"
                                opacity=".2"
                              ></path>
                              <path
                                fill="#fff"
                                d="M4.601 7.463L5.193 7.033 4.462 7.033 4.236 6.338 4.01 7.033 3.279 7.033 3.87 7.463 3.644 8.158 4.236 7.729 4.827 8.158 4.601 7.463z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M7.58 7.463L8.172 7.033 7.441 7.033 7.215 6.338 6.989 7.033 6.258 7.033 6.849 7.463 6.623 8.158 7.215 7.729 7.806 8.158 7.58 7.463z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M10.56 7.463L11.151 7.033 10.42 7.033 10.194 6.338 9.968 7.033 9.237 7.033 9.828 7.463 9.603 8.158 10.194 7.729 10.785 8.158 10.56 7.463z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M6.066 9.283L6.658 8.854 5.927 8.854 5.701 8.158 5.475 8.854 4.744 8.854 5.335 9.283 5.109 9.979 5.701 9.549 6.292 9.979 6.066 9.283z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M9.046 9.283L9.637 8.854 8.906 8.854 8.68 8.158 8.454 8.854 7.723 8.854 8.314 9.283 8.089 9.979 8.68 9.549 9.271 9.979 9.046 9.283z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M12.025 9.283L12.616 8.854 11.885 8.854 11.659 8.158 11.433 8.854 10.702 8.854 11.294 9.283 11.068 9.979 11.659 9.549 12.251 9.979 12.025 9.283z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M6.066 12.924L6.658 12.494 5.927 12.494 5.701 11.799 5.475 12.494 4.744 12.494 5.335 12.924 5.109 13.619 5.701 13.19 6.292 13.619 6.066 12.924z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M9.046 12.924L9.637 12.494 8.906 12.494 8.68 11.799 8.454 12.494 7.723 12.494 8.314 12.924 8.089 13.619 8.68 13.19 9.271 13.619 9.046 12.924z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M12.025 12.924L12.616 12.494 11.885 12.494 11.659 11.799 11.433 12.494 10.702 12.494 11.294 12.924 11.068 13.619 11.659 13.19 12.251 13.619 12.025 12.924z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M13.539 7.463L14.13 7.033 13.399 7.033 13.173 6.338 12.947 7.033 12.216 7.033 12.808 7.463 12.582 8.158 13.173 7.729 13.765 8.158 13.539 7.463z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M4.601 11.104L5.193 10.674 4.462 10.674 4.236 9.979 4.01 10.674 3.279 10.674 3.87 11.104 3.644 11.799 4.236 11.369 4.827 11.799 4.601 11.104z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M7.58 11.104L8.172 10.674 7.441 10.674 7.215 9.979 6.989 10.674 6.258 10.674 6.849 11.104 6.623 11.799 7.215 11.369 7.806 11.799 7.58 11.104z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M10.56 11.104L11.151 10.674 10.42 10.674 10.194 9.979 9.968 10.674 9.237 10.674 9.828 11.104 9.603 11.799 10.194 11.369 10.785 11.799 10.56 11.104z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M13.539 11.104L14.13 10.674 13.399 10.674 13.173 9.979 12.947 10.674 12.216 10.674 12.808 11.104 12.582 11.799 13.173 11.369 13.765 11.799 13.539 11.104z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M4.601 14.744L5.193 14.315 4.462 14.315 4.236 13.619 4.01 14.315 3.279 14.315 3.87 14.744 3.644 15.44 4.236 15.01 4.827 15.44 4.601 14.744z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M7.58 14.744L8.172 14.315 7.441 14.315 7.215 13.619 6.989 14.315 6.258 14.315 6.849 14.744 6.623 15.44 7.215 15.01 7.806 15.44 7.58 14.744z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M10.56 14.744L11.151 14.315 10.42 14.315 10.194 13.619 9.968 14.315 9.237 14.315 9.828 14.744 9.603 15.44 10.194 15.01 10.785 15.44 10.56 14.744z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M13.539 14.744L14.13 14.315 13.399 14.315 13.173 13.619 12.947 14.315 12.216 14.315 12.808 14.744 12.582 15.44 13.173 15.01 13.765 15.44 13.539 14.744z"
                              ></path>
                            </svg>
                          </IconButton>
                          <CardContent>
                            <h6 className="2xl:text-base text-[.8rem]">
                              USD to PKR
                            </h6>
                            <h5 className="sm:text-lg text-[.8rem]">
                              {rates.PKR ? ` ${rates.PKR}` : "Loading..."}
                            </h5>
                          </CardContent>
                        </DashboardCard>
                      </Grid>
                      <Grid item xs={6} sm={6} lg={3}>
                        <DashboardCard
                          sx={{ width: "100%", marginRight: "1.5rem" }}
                        >
                          <IconButton color="secondary">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="45"
                              height="45"
                              viewBox="0 0 32 32"
                            >
                              <rect
                                x="1"
                                y="4"
                                width="30"
                                height="24"
                                rx="4"
                                ry="4"
                                fill="#112f95"
                              ></rect>
                              <path
                                d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
                                opacity=".15"
                              ></path>
                              <path
                                fill="#f6cd46"
                                d="M16 8.167L15.745 8.951 14.921 8.951 15.588 9.435 15.333 10.219 16 9.735 16.667 10.219 16.412 9.435 17.079 8.951 16.255 8.951 16 8.167z"
                              ></path>
                              <path
                                fill="#f6cd46"
                                d="M16.255 22.565L16 21.781 15.745 22.565 14.921 22.565 15.588 23.049 15.333 23.833 16 23.349 16.667 23.833 16.412 23.049 17.079 22.565 16.255 22.565z"
                              ></path>
                              <path
                                fill="#f6cd46"
                                d="M9.193 16.542L9.86 17.026 9.605 16.242 10.272 15.758 9.448 15.758 9.193 14.974 8.938 15.758 8.114 15.758 8.781 16.242 8.526 17.026 9.193 16.542z"
                              ></path>
                              <path
                                fill="#f6cd46"
                                d="M12.596 9.079L12.342 9.863 11.517 9.863 12.184 10.347 11.93 11.131 12.596 10.647 13.263 11.131 13.009 10.347 13.675 9.863 12.851 9.863 12.596 9.079z"
                              ></path>
                              <path
                                fill="#f6cd46"
                                d="M10.105 11.57L9.85 12.354 9.026 12.354 9.693 12.839 9.438 13.623 10.105 13.138 10.772 13.623 10.517 12.839 11.184 12.354 10.36 12.354 10.105 11.57z"
                              ></path>
                              <path
                                fill="#f6cd46"
                                d="M10.36 19.161L10.105 18.377 9.85 19.161 9.026 19.161 9.693 19.646 9.438 20.43 10.105 19.945 10.772 20.43 10.517 19.646 11.184 19.161 10.36 19.161z"
                              ></path>
                              <path
                                fill="#f6cd46"
                                d="M12.851 21.653L12.596 20.869 12.342 21.653 11.517 21.653 12.184 22.137 11.93 22.921 12.596 22.437 13.263 22.921 13.009 22.137 13.675 21.653 12.851 21.653z"
                              ></path>
                              <path
                                fill="#f6cd46"
                                d="M23.886 15.758L23.062 15.758 22.807 14.974 22.552 15.758 21.728 15.758 22.395 16.242 22.14 17.026 22.807 16.542 23.474 17.026 23.219 16.242 23.886 15.758z"
                              ></path>
                              <path
                                fill="#f6cd46"
                                d="M19.404 9.079L19.149 9.863 18.325 9.863 18.991 10.347 18.737 11.131 19.404 10.647 20.07 11.131 19.816 10.347 20.483 9.863 19.658 9.863 19.404 9.079z"
                              ></path>
                              <path
                                fill="#f6cd46"
                                d="M21.483 12.839L21.228 13.623 21.895 13.138 22.562 13.623 22.307 12.839 22.974 12.354 22.15 12.354 21.895 11.57 21.64 12.354 20.816 12.354 21.483 12.839z"
                              ></path>
                              <path
                                fill="#f6cd46"
                                d="M22.15 19.161L21.895 18.377 21.64 19.161 20.816 19.161 21.483 19.646 21.228 20.43 21.895 19.945 22.562 20.43 22.307 19.646 22.974 19.161 22.15 19.161z"
                              ></path>
                              <path
                                fill="#f6cd46"
                                d="M19.658 21.653L19.404 20.869 19.149 21.653 18.325 21.653 18.991 22.137 18.737 22.921 19.404 22.437 20.07 22.921 19.816 22.137 20.483 21.653 19.658 21.653z"
                              ></path>
                              <path
                                d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
                                fill="#fff"
                                opacity=".2"
                              ></path>
                            </svg>
                          </IconButton>
                          <CardContent>
                            <h6 className="2xl:text-base text-[.8rem]">
                              EUR to PKR
                            </h6>
                            <h5 className="sm:text-lg text-[.8rem]">
                              {rates.EUR ? ` ${rates.EUR}` : "Loading..."}
                            </h5>
                          </CardContent>
                        </DashboardCard>
                      </Grid>

                      <Grid item xs={6} sm={6} lg={3}>
                        <DashboardCard
                          sx={{ width: "100%", marginRight: "1.5rem" }}
                        >
                          <IconButton color="secondary">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="45"
                              height="45"
                              viewBox="0 0 32 32"
                            >
                              <rect
                                x="1"
                                y="4"
                                width="30"
                                height="24"
                                rx="4"
                                ry="4"
                                fill="#071b65"
                              ></rect>
                              <path
                                d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z"
                                fill="#fff"
                              ></path>
                              <path
                                d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z"
                                fill="#b92932"
                              ></path>
                              <path
                                d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z"
                                fill="#b92932"
                              ></path>
                              <path
                                d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z"
                                fill="#fff"
                              ></path>
                              <rect
                                x="13"
                                y="4"
                                width="6"
                                height="24"
                                fill="#fff"
                              ></rect>
                              <rect
                                x="1"
                                y="13"
                                width="30"
                                height="6"
                                fill="#fff"
                              ></rect>
                              <rect
                                x="14"
                                y="4"
                                width="4"
                                height="24"
                                fill="#b92932"
                              ></rect>
                              <rect
                                x="14"
                                y="1"
                                width="4"
                                height="30"
                                transform="translate(32) rotate(90)"
                                fill="#b92932"
                              ></rect>
                              <path
                                d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z"
                                fill="#b92932"
                              ></path>
                              <path
                                d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z"
                                fill="#b92932"
                              ></path>
                              <path
                                d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
                                opacity=".15"
                              ></path>
                              <path
                                d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
                                fill="#fff"
                                opacity=".2"
                              ></path>
                            </svg>
                          </IconButton>
                          <CardContent>
                            <h6 className="2xl:text-base text-[.8rem]">
                              GBP to PKR
                            </h6>
                            <h5 className="sm:text-lg text-[.8rem]">
                              {rates.GBP ? `${rates.GBP}` : "Loading..."}
                            </h5>
                          </CardContent>
                        </DashboardCard>
                      </Grid>
                      <Grid item xs={6} sm={6} lg={3}>
                        <DashboardCard sx={{ width: "100%" }}>
                          <IconButton color="secondary">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="45"
                              height="45"
                              viewBox="0 0 32 32"
                            >
                              <path
                                d="M5,4h6V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z"
                                fill="#ea3323"
                              ></path>
                              <path d="M10,20v8H27c2.209,0,4-1.791,4-4v-4H10Z"></path>
                              <path fill="#fff" d="M10 11H31V21H10z"></path>
                              <path
                                d="M27,4H10V12H31v-4c0-2.209-1.791-4-4-4Z"
                                fill="#317234"
                              ></path>
                              <path
                                d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
                                opacity=".15"
                              ></path>
                              <path
                                d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
                                fill="#fff"
                                opacity=".2"
                              ></path>
                            </svg>
                          </IconButton>
                          <CardContent>
                            <h6 className="2xl:text-base text-[.8rem]">
                              AED to PKR
                            </h6>
                            <h5 className="sm:text-lg text-[.8rem]">
                              {rates.AED ? ` ${rates.AED}` : "Loading..."}
                            </h5>
                          </CardContent>
                        </DashboardCard>
                      </Grid>
                    </Grid>
                  )}

                  {/* Total Amount Generated */}
                  <Grid container spacing={3}>
                    {user?.role === "admin" && (
                      <Grid item xs={6} sm={6} lg={3}>
                        <DashboardCard>
                          <IconButton sx={{ color: "cyan" }}>
                            <MonetizationOn fontSize="large" />
                          </IconButton>
                          <CardContent>
                            <h6 className="2xl:text-base text-[.8rem]">
                              Expected Amount
                            </h6>
                            <h5 className="text-lg">${totalRevenue}</h5>
                          </CardContent>
                        </DashboardCard>
                      </Grid>
                    )}

                    <Grid
                      item
                      xs={6}
                      sm={6}
                      lg={user?.role === "admin" ? 3 : 4}
                    >
                      <DashboardCard>
                        <IconButton sx={{ color: "yellow" }}>
                          <MonetizationOn fontSize="large" />
                        </IconButton>
                        <CardContent>
                          <h6 className="2xl:text-base text-[.8rem]">
                            Pending Amount
                          </h6>
                          <h5 className="text-lg">${pendingAmount}</h5>
                        </CardContent>
                      </DashboardCard>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      sm={6}
                      lg={user?.role === "admin" ? 3 : 4}
                    >
                      <DashboardCard>
                        <IconButton sx={{ color: "#1de560" }}>
                          <MonetizationOn fontSize="large" />
                        </IconButton>
                        <CardContent>
                          <h6 className="2xl:text-base text-[.8rem]">
                            Revenue / Received
                          </h6>
                          <h5 className="text-lg">${totalRecievedAmount}</h5>
                        </CardContent>
                      </DashboardCard>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sm={6}
                      lg={user?.role === "admin" ? 3 : 4}
                    >
                      <DashboardCard>
                        <IconButton color="secondary">
                          <PeopleAltIcon fontSize="large" />
                        </IconButton>
                        <CardContent>
                          <h6 className="2xl:text-base text-[.8rem]">
                            Total Clients
                          </h6>
                          <h5 className="text-lg">{clients}</h5>
                        </CardContent>
                      </DashboardCard>
                    </Grid>
                    {user?.role === "admin" && (
                      <>
                        <Grid item xs={6} sm={6} lg={3}>
                          <DashboardCard>
                            <IconButton sx={{ color: "#fd7f6f" }}>
                              <AssuredWorkloadIcon fontSize="large" />
                            </IconButton>
                            <CardContent>
                              <h6 className="2xl:text-base text-[.8rem]">
                                Tax Deduction
                              </h6>
                              <h5 className="text-lg">
                                {tax?.data?.overall?.averageTax || 0}
                              </h5>
                            </CardContent>
                          </DashboardCard>
                        </Grid>

                        <Grid item xs={6} sm={6} lg={3}>
                          <DashboardCard>
                            <IconButton sx={{ color: "red" }}>
                              <MonetizationOn fontSize="large" />
                            </IconButton>
                            <CardContent>
                              <h6 className="2xl:text-base text-[.8rem]">
                                Expenses
                              </h6>
                              <h5 className="text-lg">${totalExpenses || 0}</h5>
                            </CardContent>
                          </DashboardCard>
                        </Grid>

                        <Grid item xs={6} sm={6} lg={3}>
                          <DashboardCard>
                            <IconButton sx={{ color: "#108900" }}>
                              <MonetizationOn fontSize="large" />
                            </IconButton>
                            <CardContent>
                              <h6 className="2xl:text-base text-[.8rem]">
                                Net Profit
                              </h6>
                              <h5 className="text-lg">
                                ${netProfit?.data?.netProfitUSD.toFixed(2) || 0}
                              </h5>
                            </CardContent>
                          </DashboardCard>
                        </Grid>
                      </>
                    )}
                  </Grid>

                  {/* Charts */}
                  {user?.role === "admin" && (
                    <div className="w-full">
                      <Typography variant="h5" className="block font-bold">
                        Analytics Overview
                      </Typography>
                      <div className="flex flex-wrap">
                        <div className="flex-[0_0_100%] px-2">
                          {/* Multiple chart */}
                          <MultiBarCharts totalRevenue={totalRevenue} />
                        </div>
                      </div>
                      <div className="flex flex-wrap mt-4">
                        <div className="flex-[0_0_100%] px-2">
                          {/* Profit & Loss */}
                          <ProfitLossChart totalRevenue={totalRevenue} />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Box>
          </PageContainer>
        </DashboardLayout>
      </AppProvider>
    </ThemeProvider>
  );
}
