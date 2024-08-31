import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Groups as GroupsIcon,
  Logout as LogoutIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { grayColor, matBlack } from "../../constants/Color";

const StyledLink = styled(Link)({
  textDecoration: "none",
  borderRadius: "2rem",
  padding: "1rem 2rem",
  color: "black",
  "&:hover": {
    color: "rgba(0, 0, 0, 0.54)",
  },
});

const adminTabs = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccountsIcon />,
  },
  { name: "Chats", path: "/admin/chats", icon: <GroupsIcon /> },
  { name: "Messages", path: "/admin/messages", icon: <MessageIcon /> },
];

const Sidebar = ({ w = "100%" }) => {
  const location = useLocation();

  const logoutHandler = () => {
    console.log("Logout");
  };

  return (
    <Stack width={w} spacing={"3rem"} p={"3rem 1rem"}>
      <Typography variant="h5" textTransform={"uppercase"}>
        Admin
      </Typography>
      <Stack spacing={"1rem"}>
        {adminTabs.map((tab) => (
          <StyledLink
            to={tab.path}
            key={tab.path}
            sx={
              location.pathname === tab.path && {
                backgroundColor: matBlack,
                color: "white",
                "&:hover": {
                  color: "white",
                },
              }
            }
          >
            <Stack direction={"row"} spacing={"1rem"}>
              {tab.icon}
              <Typography>{tab.name}</Typography>
            </Stack>
          </StyledLink>
        ))}

        <StyledLink onClick={logoutHandler}>
          <Stack direction={"row"} spacing={"1rem"}>
            <LogoutIcon />
            <Typography>Logout</Typography>
          </Stack>
        </StyledLink>
      </Stack>
    </Stack>
  );
};

const isAdmin = true;
const AdminLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const handleMobile = () => {
    setIsMobile((prev) => !prev);
    console.log("Mobile Menu");
  };

  const handleClose = () => setIsMobile(false);

  if (!isAdmin) {
    return <Navigate to="/admin" />;
  }

  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }}
      >
        <IconButton onClick={handleMobile}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
        <Sidebar />
      </Grid>
      <Grid
        item
        xs={12}
        md={8}
        lg={9}
        sx={{
          bgcolor: grayColor,
        }}
      >
        {children}
      </Grid>
      <Drawer open={isMobile} onClose={handleClose}>
        <Sidebar w="50vw" />
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;
