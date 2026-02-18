import pool from "../db.js";

export async function getProjects(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT * FROM projects WHERE owner_id=$1",
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
