import React, { useEffect, useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GridTable from "../../components/GridTable";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { deleteTax, getTaxes } from "../../../services/tax";
import EditTaxModal from "./EditTaxModal";
import { useDispatch } from "react-redux";
import { fetchAnalytics } from "../../store/analyticsSlice";

const TaxTable = ({ setSelectedPage }) => {
  // Get User & Token
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));

  const dispatch = useDispatch();

  // State Variables
  const [taxId, setTaxId] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [taxes, setTaxes] = useState([]);

  // Fetch Employees Data
  const fetchTaxes = async () => {
    try {
      const {taxes, success, message} = await getTaxes(token);
      if (success) {
        setTaxes(taxes);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  // Format Users Data
  useEffect(() => {
    const formattedRows = taxes?.reverse().map((item, index) => ({
      id: item._id,
      No: index + 1,
      percentage: `${item.percentage}%`,
      month: item.month,
      year: item.year,
    }));
    setRows(formattedRows);
  }, [taxes]);

  // Table Columns
  const columns = [
    { field: "No", headerName: "Index", flex: 1, minWidth: 150 },
    { field: "percentage", headerName: "Percentage", flex: 1, minWidth: 150 },
    { field: "month", headerName: "Month", flex: 1, minWidth: 150 },
    { field: "year", headerName: "Year", flex: 1, minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditTax(params.row.id)}>
            <FaPencilAlt size={16} className="text-[#71717a]" />
          </IconButton>

          <IconButton onClick={() => handleDelete(params.row.id)}>
            <MdDelete size={18} className="text-[#bc134f]" />
          </IconButton>
        </>
      ),
    },
  ];

  // Edit User Modal
  const handleEditTax = (id) => {
    setTaxId(id);
    const tax = taxes.find((u) => id === u._id);
    setSelectedTax(tax);
    setEditModalOpen(true);
  };

  // Delete User
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this tax? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const { success, message } = await deleteTax(token, id);
        if (success) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: message,
            timer: 800,
          });
          setRows(rows.filter((row) => row.id !== id));
          dispatch(fetchAnalytics({ user, token }));
        }
      } catch (error) {
        console.error("Error deleting sale:", error);
      }
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#121212", borderRadius: 2 }}>
      {/* Add User Button */}

      {user?.role === "admin" && (
        <Box
          sx={{ display: "flex", justifyContent: "end", marginBottom: "20px" }}
        >
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setSelectedPage("/addTax")}
          >
            Add Tax
          </Button>
        </Box>
      )}

      {/* Sales Table */}
      <GridTable
        selectedRows={selectedRows}
        rows={rows}
        columns={columns}
        setSelectedRows={setSelectedRows}
      />

      {/* Edit User Modal */}
      {selectedTax && (
        <EditTaxModal
          open={editModalOpen}
          taxId={taxId}
          refetchTaxes={fetchTaxes}
          onClose={() => setEditModalOpen(false)}
          initialData={selectedTax}
          onSubmit={() => {
            setEditModalOpen(false);
          }}
        />
      )}
    
    </Box>
  );
};

export default TaxTable;
