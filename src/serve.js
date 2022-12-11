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
  try {
    const categories = await connection.query("SELECT * FROM categories;");
    res.send(categories.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/categories", async (req, res) => {
  const { name } = req.body;
  try {
    await connection.query("INSERT INTO categories (name) VALUES ($1)", [name]);
  } catch (err) {
    res.sendStatus(500);
  }
  res.sendStatus(201);
});

app.get("/games", async (req, res) => {
  try {
    const games = await connection.query("SELECT * FROM games;");
    res.send(games.rows);
  } catch (err) {
    res.sendStatus(500);
  }
});

app.post("/games", async (req, res) => {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  try {
    await connection.query(
      'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1,$2,$3,$4,$5);',
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    console.log("oi");
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
});

app.get("/customers", async (req, res) => {
  const cpf = req.query.cpf;

  try {
    if (cpf) {
      const clientes = await connection.query(
        "SELECT * FROM customers WHERE cpf LIKE $1;",
        [`${cpf}%`]
      );

      return res.send(clientes.rows);
    }

    const clientes = await connection.query("SELECT * FROM customers;");
    res.send(clientes.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/customers", async (req, res) => {
  const { name, phone, cpf, birthday } = req.body;

  try {
    await connection.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3,$4);",
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/customers/:id", async (req, res) => {
  const clientId = req.params.id;

  try {
    const client = await connection.query(
      "SELECT * FROM customers WHERE id = $1;",
      [clientId]
    );
    if (!client.rows.length) return res.sendStatus(400);
    res.send(client.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.put("/customers/:id", async (req, res) => {
  const clientId = req.params.id;
  const { name, phone, cpf, birthday } = req.body;

  try {
    const clientsCpf = await connection.query("SELECT cpf FROM customers WHERE NOT id = $1",[clientId]);

    if(clientsCpf.rows.find(cpfs => cpfs.cpf === cpf)) return res.send(409)

    await connection.query(
      "UPDATE customers SET (name, phone, cpf, birthday) = ($1, $2, $3, $4) WHERE id = $5;",
      [name, phone, cpf, birthday, clientId]
    );
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port ${port}`));
