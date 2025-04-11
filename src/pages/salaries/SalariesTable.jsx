import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditSalaryModal from "./EditSalaryModal";
import GridTable from "../../components/GridTable";
import { deleteSalary, filterSalaries, getSalaries } from "../../../services/salary";
import { getEmployees } from "../../../services/users";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

const SalariesTable = ({ setSelectedPage }) => {
  const token = JSON.parse(localStorage.getItem("token"));

  // State Variables
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [month, setMonth] = useState("");
  const [employee, setEmployee] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("");

  // Fetch Employees Data
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

  // Fetch Salaries Data
  const fetchSalaries = async () => {
    try {
      const { success, salaries, message } = await getSalaries(token);
      if (success) {
        setSalaries(salaries);
      }
    } catch (error) {
      console.error("Error fetching salaries:", error);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  // Map Sales Columns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedRows = salaries.reverse().map((item, index) => ({
          id: item._id,
          employeeId: item.employee._id,
          No: index + 1,
          employee: item.employee.name,
          amount: item.amount,
          status: item.status,
          paidDate: item.paidDate,
          month: item.month,
          year: item.year,
          bonus: item.bonus,
          totalAmount: item.totalAmount,
        }));
        setRows(formattedRows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [salaries]);

  // Define Table Rows And Columns
  const columns = [
    { field: "No", headerName: "Index", flex: 1, minWidth: 150 },
    {
      field: "employee",
      headerName: "Employee",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      minWidth: 150,
      editable: true,
      renderCell: (params) => (
        <span className="text-white">Rs.{params.row.amount}</span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 150,
      editable: true,
      renderCell: (params) => (
        <span
          className={`px-4 py-2 font-semibold rounded-[25px] ${params.row.status === "Paid" ? "text-[#24a24f] bg-[#0d2a1f]" : "text-[#79a7bc] bg-[#152432]"}`}
        >
          {params.row.status}
        </span>
      ),
    },
    {
      field: "paidDate",
      headerName: "Paid Date",
      flex: 1,
      minWidth: 150,
      editable: true,
      renderCell: (params) => (
        <span className="text-white">{params.row.paidDate.split("T")[0]}</span>
      ),
    },
    {
      field: "bonus",
      headerName: "Bonus",
      flex: 1,
      minWidth: 150,
      editable: true,
      renderCell: (params) => (
        <span className="text-white">Rs.{params.row.bonus}</span>
      ),
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      minWidth: 150,
      editable: true,
      renderCell: (params) => (
        <span className="text-white">Rs.{params.row.totalAmount}</span>
      ),
    },
    {
      field: "month",
      headerName: "Month",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "year",
      headerName: "Year",
      flex: 1,
      minWidth: 150,
      editable: true,
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() =>
              handleEditSalary(params.row.id, params.row.employeeId)
            }
          >
            <FaPencilAlt size={20} className="text-white" />
          </IconButton>

          <IconButton onClick={() => handleDelete(params.row.id)}>
            <MdDelete size={18} className="text-[#bc134f]" />
          </IconButton>
        </>
      ),
    },
  ];

  // Edit Salary
  const handleEditSalary = (salary, employeeId) => {
    setSelectedSalary(salary);
    setSelectedEmployee(employeeId);
    setEditModalOpen(true);
  };

  // Delete Salary
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this sale? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const { success, message } = await deleteSalary(token, id);
        if (success) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: message,
            timer: 800,
          });
          setRows(rows.filter((row) => row.id !== id));
        }
      } catch (error) {
        console.error("Error deleting sale:", error);
      }
    }
  };

  // Handle Modal Close
  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedSalary(null);
  };

  // Filter Records
  const handleFilter = async () => {
    try {
      const { salaries } = await filterSalaries(
        token,
        month,
        year,
        status,
        employee
      );
      setSalaries(salaries);
    } catch (error) {
      console.error("Error fetching filtered salaries:", error);
    }
  };

  useEffect(() => {
    handleFilter();
  }, [month, year, status, employee]);

  return (
    <Box sx={{ padding: 3, backgroundColor: "#121212", borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          marginBottom: "20px",
        }}
        className="gap-4"
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setSelectedPage("/addSalary")}
        >
          Add Salary
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setMonth("");
            setYear("");
            setEmployee("");
            setStatus("");
            fetchSalaries(); // fetch original data
          }}
        >
          Reset Salaries
        </Button>
      </Box>

      <div className="search_records grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormControl className="w-full">
          <InputLabel id="demo-simple-select-label">Employee</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={employee}
            label="Employee"
            onChange={(e) => setEmployee(e.target.value)}
          >
            {employees?.map((employee) => (
              <MenuItem key={employee._id} value={employee._id}>
                {employee.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Month</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Month"
            onChange={(e) => setMonth(e.target.value)}
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
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Year</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Year"
            onChange={(e) => setYear(e.target.value)}
          >
            {[
              2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015,
            ].map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            {["Paid", "Pending"].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <GridTable
        selectedRows={selectedRows}
        rows={rows}
        columns={columns}
        setSelectedRows={setSelectedRows}
      />

      {/* Edit Salary Modal */}
      <EditSalaryModal
        open={editModalOpen}
        onClose={handleModalClose}
        selectedSalary={selectedSalary}
        refetchSalaries={fetchSalaries}
        selectedEmployee={selectedEmployee}
      />
    </Box>
  );
};

export default SalariesTable;
