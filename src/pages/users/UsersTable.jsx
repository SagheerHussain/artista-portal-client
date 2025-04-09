import React, { useEffect, useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GridTable from "../../components/GridTable";
import { deleteEmployee, getEmployees } from "../../../services/users";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import EditUserModal from "./EditUserModal";
import Swal from "sweetalert2";

const UsersTable = ({ setSelectedPage }) => {
  // Get User & Token
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));

  // State Variables
  const [userId, setUserId] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch Employees Data
  const fetchUsers = async () => {
    try {
      const usersData = await getEmployees(token);
      setUsers(usersData.users);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Format Users Data
  useEffect(() => {
    const formattedRows = users.reverse().map((item, index) => ({
      id: item._id,
      No: index + 1,
      name: item.name,
      email: item.email,
      role: item.role,
      profilePicture: item.profilePicture,
    }));
    setRows(formattedRows);
  }, [users]);

  // Table Columns
  const columns = [
    { field: "No", headerName: "Index", flex: 1, minWidth: 150 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 150 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span
          className={`${params.row.role === "admin" ? "text-green-400" : "text-orange-500"}`}
        >
          {params.row.role}
        </span>
      ),
    },
    {
      field: "profilePicture",
      headerName: "Profile Picture",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <a
          href={
            params.row.profilePicture ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-white underline"
        >
          View Profile Photo
        </a>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditUser(params.row.id)}>
            <FaPencilAlt size={16} className="text-[#71717a]" />
          </IconButton>

          {user?.role === "admin" && (
            <IconButton onClick={() => handleDelete(params.row.id)}>
              <MdDelete size={18} className="text-[#bc134f]" />
            </IconButton>
          )}
        </>
      ),
    },
  ];

  // Edit User Modal
  const handleEditUser = (id) => {
    setUserId(id);
    const user = users.find((u) => id === u._id);
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  // Delete User
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this user? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const { success, message } = await deleteEmployee(id, token);
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
            onClick={() => setSelectedPage("/addUser")}
          >
            Add User
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
      {selectedUser && (
        <EditUserModal
          open={editModalOpen}
          userId={userId}
          refetchUsers={fetchUsers}
          onClose={() => setEditModalOpen(false)}
          initialData={selectedUser}
          onSubmit={() => {
            setEditModalOpen(false);
          }}
        />
      )}
    </Box>
  );
};

export default UsersTable;
