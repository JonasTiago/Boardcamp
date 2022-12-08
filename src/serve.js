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


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port ${port}`));
