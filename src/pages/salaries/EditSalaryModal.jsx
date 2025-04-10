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
import { ClipLoader } from "react-spinners";

const EditSalaryModal = ({
  open,
  onClose,
  selectedSalary,
  refetchSalaries,
  selectedEmployee,
}) => {
  const token = JSON.parse(localStorage.getItem("token"));

  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);
  const [salaryData, setSalaryData] = useState({});
  const [commission, setCommission] = useState("");
  const [totalMonthlySales, setTotalMonthlySales] = useState(0);

  // Load data only when modal is open
  useEffect(() => {
    if (open && selectedSalary && selectedEmployee) {
      loadData();
    }
  }, [open, selectedSalary, selectedEmployee]);

  // Load both salary and sales data
  const loadData = async () => {
    setModalLoading(true);

    try {
      const salesRes = await getEmployeeCurrentSalesAmount(
        selectedEmployee,
        token
      );
      const salaryRes = await getSalaryById(selectedSalary, token);

      if (salesRes?.totalMonthlySales && salaryRes?.salary) {
        const sales = salesRes.totalMonthlySales;
        const salary = salaryRes.salary;

        setTotalMonthlySales(sales);

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

        const commissionPercentage = (
          (salary.amount / (sales * 280)) *
          100
        ).toFixed(2);

        setCommission(commissionPercentage);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }

    setModalLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalaryData({ ...salaryData, [name]: value });

    if (name === "bonus" || name === "commission") {
      // trigger total recalc
      setCommission((prev) => prev); // trigger re-render
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const totalAmount = calculateTotalSalary();
    const amount = calculateCommissionInPKR();

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
          timer: 800,
        });
        setLoading(false);
        refetchSalaries();
        onClose();
      }
    } catch (error) {
      console.error("Error updating salary:", error);
      setLoading(false);
    }
  };

  const calculateCommissionInPKR = () => {
    const commissionPercent = Number(commission) || 0;
    const commissionDollar = (totalMonthlySales * commissionPercent) / 100;
    const commissionPKR = commissionDollar * 280;
    return commissionPKR.toFixed(0);
  };

  const calculateTotalSalary = () => {
    const bonus = Number(salaryData.bonus) || 0;
    const commissionPKR = parseFloat(calculateCommissionInPKR()) || 0;
    return (commissionPKR + bonus).toFixed(0);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>Edit Salary</DialogTitle>

      <DialogContent>
        <TextField
          label="Employee"
          name="employee"
          fullWidth
          margin="dense"
          value={salaryData?.employee?.name || ""}
          disabled
        />
        <TextField
          label="Commission (%)"
          name="commission"
          type="number"
          fullWidth
          margin="dense"
          value={commission || ""}
          onChange={(e) => setCommission(e.target.value)}
        />
        <TextField
          label="Bonus (optional)"
          name="bonus"
          type="number"
          fullWidth
          margin="dense"
          value={salaryData.bonus || ""}
          onChange={handleChange}
        />
        <TextField
          label="Amount"
          name="amount"
          type="number"
          fullWidth
          margin="dense"
          value={calculateCommissionInPKR() || ""}
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

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {loading ? <ClipLoader size={20} color="#fff" /> : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSalaryModal;
