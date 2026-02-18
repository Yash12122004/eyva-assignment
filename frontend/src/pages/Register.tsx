import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Container, Paper, Typography, Box, Alert, CircularProgress } from "@mui/material";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/auth/register", data);
      login(res.data.token, res.data);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Sign up to start managing your projects
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              fullWidth
              {...register("name", { 
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters"
                }
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={loading}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={loading}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loading}
            />
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              disabled={loading}
              sx={{ mt: 1 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
            </Button>
          </Box>
        </form>
        
        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
