# Task Implementation Plan

## Task 1: Fix TaskCard.tsx
- [ ] Add isOverlay prop to TaskCard component
- [ ] Skip sortable functionality when isOverlay is true
- [ ] Add smooth scale/transform animation when isOverlay is true
- [ ] Fix opacity issue - remove semi-transparent effect when dragging

## Task 2: Fix KanbanBoard.tsx
- [ ] Pass isOverlay prop to TaskCard when in DragOverlay

## Task 3: Fix ProjectView.tsx
- [ ] Add data transformation to convert snake_case from API to camelCase
- [ ] Map due_date -> dueDate
- [ ] Map project_id -> projectId
