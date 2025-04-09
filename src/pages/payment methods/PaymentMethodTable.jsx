import React, { useEffect, useState } from "react";
import { Box, IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import GridTable from "../../components/GridTable";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
// import EditExpenseCategoryModal from "./EditExpenseCategoryModal";
import { deletePaymentMethod } from "../../../services/paymentMethod";
import { getPaymentMethods } from "../../../services/paymentMethod";
import EditPaymentMethodModal from "./EditPaymentMethodModal";

const PaymentMethodTable = ({ setSelectedPage }) => {
  // Get User & Token
  const token = JSON.parse(localStorage.getItem("token"));

  // State Variables
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // Fetch All Sales Initially
  const fetchAllPaymentMethods = async () => {
    try {
      const { success, paymentMethods } = await getPaymentMethods(token);
      if (success) {
        setPaymentMethods(paymentMethods);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllPaymentMethods();
  }, []);

  // Format Sales Data
  useEffect(() => {
    const formattedRows = paymentMethods.reverse().map((item, index) => ({
      id: item._id,
      No: index + 1,
      method: item.method,
    }));
    setRows(formattedRows);
  }, [paymentMethods]);

  // Edit Expense Modal
  const handleEditPaymentMethod = (id) => {
    setPaymentMethodId(id);
    const paymentMethod = paymentMethods.find((s) => id === s._id);
    setSelectedPaymentMethod(paymentMethod);
    setEditModalOpen(true);
  };

  // Delete Expense
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this payment method? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const { success, message } = await deletePaymentMethod(id, token);
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
    { field: "method", headerName: "Method", flex: 1, minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditPaymentMethod(params.row.id)}>
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
          onClick={() => setSelectedPage("/addPaymentMethod")}
        >
          Add Payment Method
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
      {selectedPaymentMethod && (
        <EditPaymentMethodModal
          open={editModalOpen}
          expenseId={paymentMethodId}
          refetchSales={fetchAllPaymentMethods}
          onClose={() => setEditModalOpen(false)}
          initialData={selectedPaymentMethod}
          onSubmit={() => {
            setEditModalOpen(false);
          }}
        />
      )}
    </Box>
  );
};

export default PaymentMethodTable;
