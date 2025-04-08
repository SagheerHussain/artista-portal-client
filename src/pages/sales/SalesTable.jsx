import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import { BsThreeDotsVertical } from "react-icons/bs";

import EditSalesModal from "./EditSalesModal";
import GridTable from "../../components/GridTable";
import {
  deleteSale,
  getEmployeeFilteredRecord,
  getFilteredRecord,
  getSales,
  getSalesByEmployee,
} from "../../../services/sales";
import { getEmployees } from "../../../services/users";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const SalesTable = ({ setSelectedPage }) => {
  // Get User & Token
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));

  // State Variables
  const [saleId, setSaleId] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sales, setSales] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Filter States
  const [filters, setFilters] = useState({
    month: "",
    year: "",
    employeeId: "",
    status: "",
    search: "",
  });

  // Fetch Employees Data
  const fetchEmployees = async () => {
    try {
      const employeesData = await getEmployees(token);
      const filteredEmployees = employeesData.users.filter(
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

  // Fetch All Sales Initially
  const fetchAllSales = async () => {
    try {
      const { sales } =
        user?.role === "employee"
          ? await getSalesByEmployee(token, user._id)
          : await getSales(token);
      setSales(sales);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllSales();
  }, []);

  // Fetch Filtered Sales (whenever filter changes)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchFilteredSales = async () => {
        if (
          filters.employeeId ||
          filters.month ||
          filters.year ||
          filters.status ||
          filters.search
        ) {
          try {
            const { success, sales } =
              user?.role === "employee"
                ? await getEmployeeFilteredRecord(
                    token,
                    filters.month,
                    filters.year,
                    filters.search,
                    filters.status,
                    user._id
                  )
                : await getFilteredRecord(
                    token,
                    filters.month,
                    filters.year,
                    filters.search,
                    filters.status,
                    filters.employeeId
                  );
            if (success) {
              setSales(sales);
            }
          } catch (error) {
            console.error(error);
          }
        }
      };

      fetchFilteredSales();
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [filters]);

  // Format Sales Data
  useEffect(() => {
    const formattedRows = sales.reverse().map((item, index) => ({
      id: item._id,
      No: index + 1,
      employeeName: item.user.name,
      clientName: item.clientName,
      projectTitle: item.projectTitle,
      summary: item.summary,
      upfrontAmount: item.upfrontAmount,
      receivedAmount: item.receivedAmount,
      totalAmount: item.totalAmount,
      remainingAmount: item.remainingAmount,
      paymentMethod: item.paymentMethod?.method,
      status: item.status,
      month: item.month,
      year: item.year,
      leadDate: item.leadDate?.split("T")[0],
    }));
    setRows(formattedRows);
  }, [sales]);

  // Handle Dropdowns & Inputs
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Edit Sale Modal
  const handleEditSale = (id) => {
    setSaleId(id);
    const sale = sales.find((s) => id === s._id);
    setSelectedSale(sale);
    setEditModalOpen(true);
  };

  // Delete Sale
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
        const { success, message } = await deleteSale(id, token);
        if (success) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: message,
            timer: 1500,
          });
          setRows(rows.filter((row) => row.id !== id));
        }
      } catch (error) {
        console.error("Error deleting sale:", error);
      }
    }
  };

  // Table Columns
  const columns = [
    { field: "No", headerName: "Index", flex: 1, minWidth: 150 },
    {
      field: "employeeName",
      headerName: "Employee Name",
      flex: 1,
      minWidth: 150,
    },
    { field: "clientName", headerName: "Client Name", flex: 1, minWidth: 150 },
    {
      field: "projectTitle",
      headerName: "Project Title",
      flex: 1,
      minWidth: 200,
    },
    { field: "summary", headerName: "Summary", flex: 1, minWidth: 250 },
    {
      field: "upfrontAmount",
      headerName: "Upfront Amount",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "receivedAmount",
      headerName: "Received Amount",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "remainingAmount",
      headerName: "Remaining Amount",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span className="px-4 py-2 font-semibold rounded-[25px] text-[#eea124] bg-[#44341d]">
          {params.row.paymentMethod}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span
          className={`px-4 py-2 font-semibold rounded-[25px] ${
            params.row.status === "Fully Paid"
              ? "text-[#58e186] bg-[#0d2a1f]"
              : params.row.status === "Partially Paid"
                ? "text-[#ff6dae] bg-[#32152eb6]"
                : "text-[#ec3e7b] bg-[#441729]"
          }`}
        >
          {params.row.status}
        </span>
      ),
    },
    { field: "month", headerName: "Month", flex: 1, minWidth: 150 },
    { field: "year", headerName: "Year", flex: 1, minWidth: 150 },
    { field: "leadDate", headerName: "Lead Date", flex: 1, minWidth: 150 },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditSale(params.row.id)}>
            <FaPencilAlt size={16} className="text-[#71717a]" />
          </IconButton>

          {user?.role === "employee" && (
            <IconButton onClick={() => handleDelete(params.row.id)}>
              <MdDelete size={18} className="text-[#bc134f]" />
            </IconButton>
          )}
        </>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 3, backgroundColor: "#121212", borderRadius: 2 }}>
      {/* Add Sales Button */}

      {user?.role === "employee" && (
        <Box
          sx={{ display: "flex", justifyContent: "end", marginBottom: "20px" }}
        >
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setSelectedPage("/addSales")}
          >
            Add Sales
          </Button>
        </Box>
      )}

      {/* Filters */}
      <div className="search_records sm:flex justify-between gap-4 mb-4">
        {user?.role === "admin" && (
          <div className="mb-4 w-full sm:w-1/2">
            <FormControl fullWidth>
              <InputLabel>Employee</InputLabel>
              <Select
                value={filters.employeeId}
                label="Employee"
                onChange={(e) =>
                  handleFilterChange("employeeId", e.target.value)
                }
              >
                {employees?.map((employee) => (
                  <MenuItem key={employee._id} value={employee._id}>
                    {employee.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}
        <div className="mb-4 w-full sm:w-1/2">
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              {["Pending", "Fully Paid", "Partially Paid"].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="mb-4 w-full sm:w-1/2">
          <TextField
            label="Search Records"
            variant="outlined"
            fullWidth
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
      </div>

      <div className="filter_records sm:flex gap-4">
        <div className="mb-4 w-full sm:w-1/2">
          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select
              value={filters.month}
              label="Month"
              onChange={(e) => handleFilterChange("month", e.target.value)}
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
        </div>
        <div className="mb-4 w-full sm:w-1/2">
          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select
              value={filters.year}
              label="Year"
              onChange={(e) => handleFilterChange("year", e.target.value)}
            >
              {[2025, 2024, 2023, 2022, 2021, 2020].map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Sales Table */}
      <GridTable
        selectedRows={selectedRows}
        rows={rows}
        columns={columns}
        setSelectedRows={setSelectedRows}
      />

      {/* Edit Sales Modal */}
      {selectedSale && (
        <EditSalesModal
          open={editModalOpen}
          saleId={saleId}
          refetchSales={fetchAllSales}
          onClose={() => setEditModalOpen(false)}
          initialData={selectedSale}
          onSubmit={() => {
            setEditModalOpen(false);
          }}
        />
      )}
    </Box>
  );
};

export default SalesTable;

// Expense
