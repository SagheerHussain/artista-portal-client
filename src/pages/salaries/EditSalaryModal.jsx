import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { getSalaryById, updateSalary } from "../../../services/salary";
import Swal from "sweetalert2";
import { getEmployeeCurrentSalesAmount } from "../../../services/sales";

const EditSalaryModal = ({
  open,
  onClose,
  selectedSalary,
  refetchSalaries,
  selectedEmployee
}) => {
  // Token
  const token = JSON.parse(localStorage.getItem("token"));

  // State Variables
  const [salaryData, setSalaryData] = useState({});
  const [commission, setCommission] = useState("");
  const [totalMonthlySales, setTotalMonthlySales] = useState(0);

  // Get Current Sales
  const getCurrentSalesAmount = async () => {
    try {
      const { totalMonthlySales } = await getEmployeeCurrentSalesAmount(
        selectedEmployee,
        token
      );
      setTotalMonthlySales(totalMonthlySales);
    } catch (error) {
      console.error("Error fetching current sales amount:", error);
    }
  };

  // Get Salary Data and Calculate Commission
  const fetchSalaryRecord = async () => {
    try {
      const { success, salary } = await getSalaryById(selectedSalary, token);
      if (success) {
        setSalaryData({
          employee: salary.employee,
          bonus: salary.bonus,
          amount: salary.amount,
          totalAmount: salary.totalAmount,
          paidDate: salary.paidDate,
          month: salary.month,
          year: salary.year,
          status: salary.status,
        });

        // Calculate commission
        const percentage = (salary.amount / (totalMonthlySales * 280)) * 100;
        setCommission(percentage);
      }
    } catch (error) {
      console.error("Error fetching salary by id:", error);
    }
  };

  // Fetch data when modal opens
  useEffect(() => {
    fetchSalaryRecord();
    getCurrentSalesAmount();
  }, [selectedSalary]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalaryData({ ...salaryData, [name]: value });

    // If amount changes, re-calculate commission
    if (name === "amount") {
      const percentage = (value / totalSalesPKR) * 100;
      setCommission(percentage.toFixed(2));
    }
  };

  const handleSubmit = async () => {
    // You can customize this
    const totalAmount = calculateTotalSalary();
    const amount = calculateCommisioninPKR();

    // Updated Data
    const updatedData = {
      ...salaryData,
      employee: salaryData.employee._id,
      totalAmount,
      amount,
    };

    try {
      const { success, message } = await updateSalary(
        token,
        selectedSalary,
        updatedData
      );
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Salary Updated",
          text: message,
          timer: 1500,
        });
        refetchSalaries();
        onClose();
      }
    } catch (error) {
      console.error("Error updating salary:", error);
    }
  };

  // Commision in PKR
  const calculateCommisioninPKR = () => {
    const commissionPercent = Number(commission) || 0;
    const commissionInDollar = (totalMonthlySales * commissionPercent) / 100;
    const commissionInPKR = commissionInDollar * 280;
    return commissionInPKR.toFixed(0);
  };

  // Calculate Total Salary
  const calculateTotalSalary = () => {
    const commissionPercent = Number(commission) || 0;
    const bonus = Number(salaryData.bonus) || 0;

    const commissionInDollar = (totalMonthlySales * commissionPercent) / 100;
    const commissionInPKR = commissionInDollar * 280;
    const totalSalary = commissionInPKR + bonus;

    return totalSalary.toFixed(0); // No decimal points
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>Edit Salary</DialogTitle>
      {salaryData && (
        <DialogContent>
          <TextField
            label="Employee"
            name="employee"
            fullWidth
            margin="dense"
            value={salaryData?.employee?.name || ""}
          />
          <TextField
            label="Commission (%)"
            name="commission"
            type="number"
            fullWidth
            margin="dense"
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
          />
          <TextField
            label="Bonus (optional)"
            name="bonus"
            type="number"
            fullWidth
            margin="dense"
            value={salaryData.bonus || 0}
            onChange={handleChange}
          />
          <TextField
            label="Amount"
            name="amount"
            type="number"
            fullWidth
            margin="dense"
            value={calculateCommisioninPKR() || ""}
            disabled
          />
          <TextField
            label="Dollar Rate"
            name="dollarRate"
            type="number"
            fullWidth
            margin="dense"
            value={280}
            disabled
          />
          <TextField
            label="Total Amount"
            name="totalAmount"
            type="number"
            fullWidth
            margin="dense"
            value={calculateTotalSalary() || ""}
            disabled
          />
          <TextField
            label="Paid Date"
            name="paidDate"
            type="date"
            fullWidth
            margin="dense"
            value={salaryData.paidDate?.split("T")[0] || ""}
            onChange={handleChange}
          />

          <TextField
            select
            fullWidth
            label="Month"
            margin="dense"
            name="month"
            value={salaryData?.month || ""}
            onChange={handleChange}
          >
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Year"
            name="year"
            type="number"
            margin="dense"
            value={salaryData.year || ""}
            onChange={handleChange}
            required
          />

          <TextField
            select
            label="Status"
            name="status"
            fullWidth
            margin="dense"
            value={salaryData?.status || ""}
            onChange={handleChange}
          >
            {["Paid", "Pending"].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSalaryModal;
