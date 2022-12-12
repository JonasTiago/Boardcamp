import { connection } from "../database/db.js";

export async function listCustomers(req, res) {
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
}

export async function insertCustomer(req, res) {
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
}

export async function SearchCustomerById(req, res) {
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
}

export async function updateCustomer(req, res) {
  const clientId = req.params.id;
  const { name, phone, cpf, birthday } = req.body;

  try {
    const clientsCpf = await connection.query(
      "SELECT cpf FROM customers WHERE NOT id = $1",
      [clientId]
    );

    if (clientsCpf.rows.find((cpfs) => cpfs.cpf === cpf)) return res.send(409);

    await connection.query(
      "UPDATE customers SET (name, phone, cpf, birthday) = ($1, $2, $3, $4) WHERE id = $5;",
      [name, phone, cpf, birthday, clientId]
    );
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}