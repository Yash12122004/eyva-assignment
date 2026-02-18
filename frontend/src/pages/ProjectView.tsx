import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { Task, Project } from "../types";
import { KanbanBoard } from "../components/kanban/KanbanBoard";
import { Box, Typography, CircularProgress, Alert, Button, IconButton, Paper } from "@mui/material";
import { ArrowBack as ArrowBackIcon, Refresh as RefreshIcon, Add as AddIcon } from "@mui/icons-material";

function transformTask(apiTask: any): Task {
  return {
    id: apiTask.id,
    title: apiTask.title,
    description: apiTask.description,
    status: apiTask.status,
    priority: apiTask.priority,
    projectId: apiTask.project_id,
    dueDate: apiTask.due_date,
  };
}


export default function ProjectView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/api/projects/${id}`),
        api.get(`/api/projects/${id}/tasks`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data.map(transformTask));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load project data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const updateTaskStatus = async (taskId: string, status: Task["status"]) => {
    try {
      await api.patch(`/api/tasks/${taskId}/status`, { status });
      setTasks(prev =>
        prev.map(t => t.id === taskId ? { ...t, status } : t)
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update task");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !project) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }} action={
          <Button color="inherit" size="small" onClick={fetchData}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate("/")} title="Back to Dashboard">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {project?.name || "Project"}
            </Typography>
            {project?.description && (
              <Typography variant="body2" color="text.secondary">
                {project.description}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={fetchData} disabled={loading} title="Refresh">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ flex: 1, overflow: 'hidden', p: 2 }}>
        <KanbanBoard 
          tasks={tasks} 
          projectId={id || ""}
          updateTaskStatus={updateTaskStatus}
          onTaskCreated={fetchData}
        />
      </Paper>
    </Box>
  );
}
