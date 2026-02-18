import { AppBar, Toolbar, Typography, Button, Box, Avatar } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Project Manager
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 2 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user.name}
              </Typography>
            </Box>
          )}
          <Button
            color="inherit"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}
