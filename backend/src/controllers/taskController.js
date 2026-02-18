import pool from "../db.js";

export async function getProjectTasks(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE project_id=$1",
      [req.params.id]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const { title, description, status, priority, projectId, assigneeId, dueDate } = req.body;

    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, priority, project_id, assignee_id, due_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, description, status || "todo", priority || "medium", projectId, assigneeId, dueDate]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const { status, description, assigneeId } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET status=$1, description=$2, assignee_id=$3, updated_at=NOW()
       WHERE id=$4 RETURNING *`,
      [status, description, assigneeId, req.params.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Task not found" });

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function updateTaskStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const result = await pool.query(
      `UPDATE tasks
       SET status = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    await pool.query("DELETE FROM tasks WHERE id=$1", [req.params.id]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
}
