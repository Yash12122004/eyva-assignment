import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { TaskColumn } from "./TaskColumn";
import { TaskCard } from "./TaskCard";
import type { Task } from "../../types";
import { Box, CircularProgress } from "@mui/material";

interface Props {
  tasks: Task[];
  projectId: string;
  updateTaskStatus: (id: string, status: Task["status"]) => void;
  onTaskCreated: () => void;
  loading?: boolean;
}

export function KanbanBoard({
  tasks,
  projectId,
  updateTaskStatus,
  onTaskCreated,
  loading,
}: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  // Sync when parent refetches
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Always use localTasks
  const grouped = {
    todo: localTasks.filter((t) => t.status === "todo"),
    "in-progress": localTasks.filter((t) => t.status === "in-progress"),
    done: localTasks.filter((t) => t.status === "done"),
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = localTasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = localTasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const activeStatus = active.data.current?.status as Task["status"];

    const overStatus =
      over.data.current?.status ??
      localTasks.find((t) => t.id === overId)?.status;

    if (!overStatus) return;

    // CASE 1: Reorder inside same column
    if (activeStatus === overStatus) {
      const columnTasks = localTasks.filter(
        (t) => t.status === activeStatus
      );
    
      const oldIndex = columnTasks.findIndex(
        (t) => t.id === activeId
      );
    
      const newIndex = columnTasks.findIndex(
        (t) => t.id === overId
      );
    
      if (oldIndex === -1 || newIndex === -1) return;
      if (oldIndex === newIndex) return;
    
      const reorderedColumn = arrayMove(
        columnTasks,
        oldIndex,
        newIndex
      );
    
      // Rebuild entire task list preserving new column order
      const newTasks = [
        ...localTasks.filter((t) => t.status !== activeStatus),
        ...reorderedColumn,
      ];
    
      setLocalTasks(newTasks);
    }    

    // CASE 2: Move across columns
    if (activeStatus !== overStatus) {
      // Optimistic UI update
      setLocalTasks((prev) =>
        prev.map((t) =>
          t.id === activeId
            ? { ...t, status: overStatus }
            : t
        )
      );

      // Persist to backend
      updateTaskStatus(activeId, overStatus);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          height: "100%",
          overflowX: "auto",
          pb: 1,
          px: 0.5,
        }}
      >
        {Object.entries(grouped).map(([status, items]) => (
          <SortableContext
            key={status}
            items={items.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <TaskColumn
              status={status as Task["status"]}
              tasks={items}
              projectId={projectId}
              onTaskCreated={onTaskCreated}
            />
          </SortableContext>
        ))}
      </Box>

      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
