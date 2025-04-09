import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  FormControl,
  Select,
  Box,
  InputLabel,
} from "@mui/material";
import { getEmployees } from "../../../services/users";
import { createSalary } from "../../../services/salary";
import Swal from "sweetalert2";
import { getEmployeeCurrentSalesAmount } from "../../../services/sales";
import currencyRates from "../../hooks/currencyRates";
import { ClipLoader } from "react-spinners";

const AddSalaryForm = ({ setSelectedPage }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    employee: "",
    amount: 0, // Commission %
    bonus: 0,
    status: "",
    paidDate: "",
  });

  // Exchange Rates
  const rates = currencyRates();

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [totalMonthlySales, setTotalMonthlySales] = useState(0);
  const [textDeduction, setTextDeduction] = useState(0);

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const employees = await getEmployees(token);
      const filteredEmployees = employees.users.filter(
        (user) => user.role === "employee"
      );
      setEmployees(filteredEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle Employee Change
  const handleChangeEmployee = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    getCurrentSalesAmount(value);
  };

  // Calculate Commission & Total Salary
  const calculateTotalSalary = () => {
    const commissionPercent = Number(formData.amount) || 0;
    const bonus = Number(formData.bonus) || 0;
    const deductionPercent = Number(textDeduction) || 0;

    const commissionInDollar = (totalMonthlySales * commissionPercent) / 100;
    const commissionInPKR = commissionInDollar * (rates.PKR || 280);

    const deductionAmount = (commissionInPKR * deductionPercent) / 100;
    const finalCommission = commissionInPKR - deductionAmount;
    const totalSalary = finalCommission + bonus;

    return {
      commission: finalCommission.toFixed(0),
      totalSalary: totalSalary.toFixed(0),
    };
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { commission, totalSalary } = calculateTotalSalary();

      const data = {
        ...formData,
        totalAmount: totalSalary, // Deducted total salary
        amount: commission, // Deducted commission
        admin: user._id,
      };

      const { success, message } = await createSalary(token, data);
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: message,
          timer: 800,
        });
        setTimeout(() => {
          setSelectedPage("/reports/salaries");
        }, 1200);
        setLoading(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: message,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating salary:", error);
    }
  };

  // Get Current Sales Amount
  const getCurrentSalesAmount = async (value) => {
    const { totalMonthlySales } = await getEmployeeCurrentSalesAmount(
      value,
      token
    );
    setTotalMonthlySales(totalMonthlySales);
  };

  return (
    <Box sx={{ backgroundColor: "#121212", p: 3, borderRadius: 2 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl className="w-full">
              <InputLabel>Employee</InputLabel>
              <Select
                name="employee"
                onChange={handleChangeEmployee}
                label="Employee"
              >
                {employees?.map((employee) => (
                  <MenuItem key={employee._id} value={employee._id}>
                    {employee.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {totalMonthlySales >= 0 && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Monthly Sales in $"
                type="number"
                value={totalMonthlySales}
                disabled
                sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
              />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Commission in % e.g. 20%"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tax Deduction in % e.g. 10%"
              type="number"
              name="textDeduction"
              value={textDeduction}
              onChange={(e) => setTextDeduction(e.target.value)}
              required
              sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Current Dollar Rate"
              name="dollarRate"
              type="number"
              value={rates.PKR || 280}
              disabled
              sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Bonus in PKR (optional)"
              name="bonus"
              type="number"
              value={formData.bonus}
              onChange={handleChange}
              sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Total Amount in PKR"
              name="totalAmount"
              type="number"
              value={calculateTotalSalary().totalSalary.toLocaleString()}
              disabled
              sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
            >
              {["Paid", "Pending"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Paid Date"
              name="paidDate"
              type="date"
              value={formData.paidDate}
              onChange={handleChange}
              required
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
            variant="outlined"
            color="secondary"
            onClick={() => setSelectedPage("/reports/salaries")}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Add Salary"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddSalaryForm;
