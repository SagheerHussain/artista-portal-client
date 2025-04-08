import React from "react";
import { Menu, MenuItem, IconButton, Typography, Avatar } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function ProfileMenu({ user }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <Typography variant="body1">Welcome, {user?.name || "User"}</Typography>
      <IconButton onClick={handleMenu} color="inherit">
        <Avatar>{user?.name?.[0]}</Avatar>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Edit Profile</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
