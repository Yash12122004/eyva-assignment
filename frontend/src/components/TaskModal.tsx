import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import type { Task, TaskStatus } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<Task>) => void;
  projectId: string;
  defaultStatus?: TaskStatus;
  loading?: boolean;
}

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function TaskModal({ open, onClose, onSubmit, projectId, defaultStatus = "todo", loading }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      priority,
      status: defaultStatus,
      projectId: projectId,
      dueDate: dueDate || undefined,
    });
    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    onClose();
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task["priority"])}
              fullWidth
            >
              {priorities.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading || !title.trim()}>
            Create Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
