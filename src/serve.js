import express from "express";
import pkg from "pg";

const { Pool } = pkg;

const connection = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "qwe123",
  database: "boardcamp",
});

const app = express();
app.use(express.json());

app.get("/categories", async (req, res) => {
  const categories = await connection.query("SELECT * FROM categories;");
  res.send(categories.rows);
});

app.post("/categories", async (req, res) => {
  const { name } = req.body;

  await connection.query("INSERT INTO categories (name) VALUES ($1)", [name]);

  res.sendStatus(201);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port ${port}`));
