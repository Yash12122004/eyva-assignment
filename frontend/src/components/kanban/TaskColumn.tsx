import { useState } from "react";
import { TaskCard } from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import { Paper, Typography, Box, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import type { Task } from "../../types";
import { TaskModal } from "../TaskModal";
import api from "../../api/axios";

interface Props {
  status: Task["status"];
  tasks: Task[];
  projectId: string;
  onTaskCreated: () => void;
  onDeleteTask: (id: string) => void;
}

const statusLabels: Record<Task["status"], string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

const statusColors: Record<Task["status"], string> = {
  todo: "#ff9800",
  "in-progress": "#2196f3",
  done: "#4caf50",
};

export function TaskColumn({ status, tasks, projectId, onTaskCreated, onDeleteTask }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateTask = async (taskData: Partial<Task>) => {
    setLoading(true);
    try {
      await api.post("/api/tasks", {
        ...taskData,
        projectId: projectId,
      });
      onTaskCreated();
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Paper
        ref={setNodeRef}
        elevation={0}
        sx={{
          flex: '1 1 0',
          minWidth: 300,
          maxWidth: 350,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          transition: 'background-color 0.2s ease',
          backgroundColor: isOver ? '#e3f2fd' : '#f5f5f5',
        }}
      >
        <Box sx={{ p: 2, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box 
            sx={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              backgroundColor: statusColors[status] 
            }} 
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {statusLabels[status]}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ ml: 'auto', backgroundColor: '#e0e0e0', px: 1, py: 0.25, borderRadius: 1 }}
          >
            {tasks.length}
          </Typography>
        </Box>
        
        <Box sx={{ p: 2, pt: 1, flex: 1, overflowY: 'auto' }}>
          {tasks.length === 0 ? (
            <Box 
              sx={{ 
                py: 4, 
                textAlign: 'center',
                border: '2px dashed #ccc',
                borderRadius: 2,
                color: '#9e9e9e'
              }}
            >
              <Typography variant="body2">
                No tasks
              </Typography>
              <Typography variant="caption">
                Drag tasks here
              </Typography>
            </Box>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </Box>
        
        <Box sx={{ p: 2, pt: 0 }}>
          <Button
            fullWidth
            variant="text"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            sx={{
              justifyContent: 'flex-start',
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Create Task
          </Button>
        </Box>
      </Paper>
      
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTask}
        projectId={projectId}
        defaultStatus={status}
        loading={loading}
      />
    </>
  );
}
