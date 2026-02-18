import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Project } from "../types";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
} from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function transformProject(apiProject: any): Project {
  return {
    id: apiProject.id,
    name: apiProject.name,
    description: apiProject.description,
    createdAt: apiProject.created_at,
    totalTasks: Number(apiProject.total_tasks || 0),
    todoTasks: Number(apiProject.todo_tasks || 0),
    inProgressTasks: Number(apiProject.in_progress_tasks || 0),
  };
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/projects");
      setProjects(res.data.map(transformProject));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    setCreating(true);
    try {
      const res = await api.post("/api/projects", {
        name: newProjectName,
        description: newProjectDescription,
      });
      setProjects([...projects, transformProject(res.data)]);
      setCreateDialogOpen(false);
      setNewProjectName("");
      setNewProjectDescription("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const headerStyle = {
    fontWeight: 600,
    fontSize: "0.75rem",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: "#777",
    borderBottom: "1px solid #eee",
  };

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        px: 3,
        py: 6,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Projects
          </Typography>
          <Typography variant="body2" sx={{ color: "#777", mt: 0.5 }}>
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={fetchProjects}
            disabled={loading}
            sx={{
              border: "1px solid #eee",
              borderRadius: 2,
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "none",
            }}
          >
            New Project
          </Button>
        </Box>
      </Box>

      {/* Create Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          },
        }}
      >
        <DialogTitle sx={{fontWeight: 600}}>Create New Project</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              fullWidth
              required
              autoFocus
            />
            <TextField
              label="Description"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCreateDialogOpen(false)}
            disabled={creating}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreateProject}
            variant="contained"
            disabled={creating || !newProjectName.trim()}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "none",
            }}
          >
            {creating ? <CircularProgress size={22} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchProjects}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : projects.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 12,
            border: "1px dashed #e5e5e5",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            No projects yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create your first project to get started.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Create Project
          </Button>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            border: "1px solid #f1f1f1",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headerStyle}>Project</TableCell>
                <TableCell sx={headerStyle}>Description</TableCell>
                <TableCell sx={headerStyle}>Created</TableCell>
                <TableCell sx={headerStyle} align="center">
                  Total
                </TableCell>
                <TableCell sx={headerStyle} align="center">
                  Todo
                </TableCell>
                <TableCell sx={headerStyle} align="center">
                  In Progress
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {projects.map((project) => (
                <TableRow
                  key={project.id}
                  hover
                  onClick={() => navigate(`/project/${project.id}`)}
                  sx={{
                    cursor: "pointer",
                    transition: "background 0.15s ease",
                    "&:hover": {
                      backgroundColor: "#fafafa",
                    },
                  }}
                >
                  <TableCell>
                    <Typography fontWeight={600}>{project.name}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ maxWidth: 260 }}
                      noWrap
                    >
                      {project.description || "—"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString()
                        : "—"}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography fontWeight={600}>
                      {project.totalTasks}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography color="text.secondary">
                      {project.todoTasks}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography color="text.secondary">
                      {project.inProgressTasks}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
