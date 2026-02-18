import pool from "../db.js";

export async function getProjects(req, res, next) {
  try {
    const result = await pool.query(
      `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.created_at,
        COUNT(t.id) AS total_tasks,
        COUNT(t.id) FILTER (WHERE t.status = 'todo') AS todo_tasks,
        COUNT(t.id) FILTER (WHERE t.status = 'in-progress') AS in_progress_tasks
      FROM projects p
      LEFT JOIN tasks t ON t.project_id = p.id
      WHERE p.owner_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
      `,
      [req.user.userId]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function createProject(req, res, next) {
  try {
    const { name, description } = req.body;

    const result = await pool.query(
      "INSERT INTO projects (name, description, owner_id) VALUES ($1,$2,$3) RETURNING *",
      [name, description, req.user.userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function getProjectById(req, res, next) {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "SELECT * FROM projects WHERE id = $1 AND owner_id = $2",
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}
