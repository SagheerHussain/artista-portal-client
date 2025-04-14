import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const HeaderWithUser = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "User",
    profilePicture: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      gap={1.5}
      px={3}
      py={1}
      sx={{ cursor: "pointer" }}
    >
      <Typography variant="body1" color="white" fontWeight={500}>
        {user.name}
      </Typography>
      <Avatar
        alt={user.name}
        src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
      />
    </Box>
  );
};

export default HeaderWithUser;
