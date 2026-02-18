import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Paper, Typography, Box, Chip } from "@mui/material";
import { DragIndicator as DragIndicatorIcon } from "@mui/icons-material";

import type { Task } from "../../types";

interface Props {
  task: Task;
  isOverlay?: boolean;
}

const priorityColors: Record<Task["priority"], "success" | "warning" | "error"> = {
  low: "success",
  medium: "warning",
  high: "error",
};

export function TaskCard({ task, isOverlay }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { 
      status: task.status,
      task: task 
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    transformOrigin: isOverlay ? 'center center' : undefined,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      elevation={isOverlay ? 8 : 1}
      sx={{
        p: 2,
        mb: 1.5,
        cursor: isOverlay ? 'grabbing' : 'grab',
        backgroundColor: '#fff',
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        boxShadow: isOverlay ? 8 : 1,
        '&:hover': {
          boxShadow: 3,
          borderColor: '#bdbdbd',
        },
        '&:active': {
          cursor: 'grabbing',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <DragIndicatorIcon sx={{ color: '#9e9e9e', fontSize: 20, mt: 0.25 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {task.title}
          </Typography>
          {task.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {task.description}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip 
              label={task.priority} 
              size="small" 
              color={priorityColors[task.priority]}
              sx={{ textTransform: 'capitalize', height: 24, fontSize: '0.75rem' }}
            />
            {task.dueDate && (
              <Typography variant="caption" color="text.secondary">
                {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}