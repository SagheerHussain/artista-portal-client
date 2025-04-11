import React, { useEffect, useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GridTable from "../../components/GridTable";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import {
  deleteAnnouncement,
  getAnnouncements,
} from "../../../services/announcement";
import EditAnnouncementModal from "./EditAnnouncementModal";

const AnnouncementTable = ({ setSelectedPage }) => {
  // Get User & Token
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));

  const dispatch = useDispatch();

  // State Variables
  const [announcementId, setAnnouncementId] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Fetch Employees Data
  const fetchAnnouncements = async () => {
    try {
      const { announcements, success, message } = await getAnnouncements(token);
      if (success) {
        setAnnouncements(announcements);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Format Users Data
  useEffect(() => {
    const formattedRows = announcements?.reverse().map((item, index) => ({
      id: item._id,
      No: index + 1,
      announcement: item.announcement,
      status: item?.status,
      admin: item?.admin?.name,
    }));
    setRows(formattedRows);
  }, [announcements]);

  // Table Columns
  const columns = [
    { field: "No", headerName: "Index", flex: 1, minWidth: 150 },
    {
      field: "announcement",
      headerName: "Announcement",
      flex: 1,
      minWidth: 400,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 50,
      renderCell: (params) => (
        <span className={`${params.value === "active" ? "text-green-500" : "text-red-500"}`}>
          {params.value === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    { field: "admin", headerName: "Admin", flex: 1, minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditAnnouncement(params.row.id)}>
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
  const handleEditAnnouncement = (id) => {
    setAnnouncementId(id);
    const announcement = announcements.find((u) => id === u._id);
    setSelectedAnnouncement(announcement);
    setEditModalOpen(true);
  };

  // Delete User
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this announcement? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const { success, message } = await deleteAnnouncement(token, id);
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
            onClick={() => setSelectedPage("/addAnnouncement")}
          >
            Add Announcement
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
      {selectedAnnouncement && (
        <EditAnnouncementModal
          open={editModalOpen}
          announcementId={announcementId}
          refetchTaxes={fetchAnnouncements}
          onClose={() => setEditModalOpen(false)}
          initialData={selectedAnnouncement}
          onSubmit={() => {
            setEditModalOpen(false);
          }}
        />
      )}
    </Box>
  );
};

export default AnnouncementTable;
