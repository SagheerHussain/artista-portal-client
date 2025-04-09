import React, { useEffect, useState } from "react";
import { Box, IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import GridTable from "../../components/GridTable";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { deleteExpanceCategory, getExpanceCategories } from "../../../services/expense";
import EditExpenseCategoryModal from "./EditExpenseCategoryModal";

const ExpenseCategoryTable = ({ setSelectedPage }) => {
  // Get User & Token
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));

  // State Variables
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseId, setExpenseId] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Fetch All Sales Initially
  const fetchAllExpenseCategories = async () => {
    try {
      const { success, expanceCategories } = await getExpanceCategories(token);
      if (success) {
        setExpenses(expanceCategories);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllExpenseCategories();
  }, []);

  // Format Sales Data
  useEffect(() => {
    const formattedRows = expenses.reverse().map((item, index) => ({
      id: item._id,
      No: index + 1,
      name: item.name,
    }));
    setRows(formattedRows);
  }, [expenses]);

  // Edit Expense Modal
  const handleEditExpenseCategory = (id) => {
    setExpenseId(id);
    const expense = expenses.find((s) => id === s._id);
    setSelectedExpense(expense);
    setEditModalOpen(true);
  };

  // Delete Expense
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this expense category? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const { success, message } = await deleteExpanceCategory(id, token);
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
        console.error("Error deleting expense:", error);
      }
    }
  };

  // Table Columns
  const columns = [
    { field: "No", headerName: "Index", flex: 1, minWidth: 150 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditExpenseCategory(params.row.id)}>
            <FaPencilAlt size={16} className="text-[#71717a]" />
          </IconButton>

          <IconButton onClick={() => handleDelete(params.row.id)}>
            <MdDelete size={18} className="text-[#bc134f]" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 3, backgroundColor: "#121212", borderRadius: 2 }}>
      {/* Add Sales Button */}

      <Box
        sx={{ display: "flex", justifyContent: "end", marginBottom: "20px" }}
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setSelectedPage("/addExpenseCategory")}
        >
          Add Expense Category
        </Button>
      </Box>

      {/* Sales Table */}
      <GridTable
        selectedRows={selectedRows}
        rows={rows}
        columns={columns}
        setSelectedRows={setSelectedRows}
      />

      {/* Edit Sales Modal */}
      {selectedExpense && (
        <EditExpenseCategoryModal
          open={editModalOpen}
          expenseId={expenseId}
          refetchSales={fetchAllExpenseCategories}
          onClose={() => setEditModalOpen(false)}
          initialData={selectedExpense}
          onSubmit={() => {
            setEditModalOpen(false);
          }}
        />
      )}
    </Box>
  );
};

export default ExpenseCategoryTable;
