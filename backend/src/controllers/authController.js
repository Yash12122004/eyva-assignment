import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;

    const hashed = await hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password, name) VALUES ($1,$2,$3) RETURNING id,email,name",
      [email, hashed, name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505")
      return res.status(400).json({ message: "Email already exists" });

    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = result.rows[0];

    const valid = await compare(password, user.password);

    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
}
