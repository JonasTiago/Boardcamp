import { connection } from "../database/db.js";
import customerSchema from "../models/schemaCustomers.js";

export default async function customerSchemaValidate(req, res, next) {
  const { name, phone, cpf, birthday } = req.body;
  const clientId = req.params.id;

  const customer = { name, phone, cpf, birthday };

  const { error } = customerSchema.validate(customer, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }

  try {
    if (!clientId) {
      const cpfValid = await connection.query(
        "SELECT cpf FROM customers WHERE cpf = $1;",
        [cpf]
      );

      if (cpfValid.rows.length) return res.sendStatus(409);
    }

    const clientsCpf = await connection.query(
      "SELECT cpf FROM customers WHERE NOT id = $1",
      [clientId]
    );

    if (clientsCpf.rows.find((cpfs) => cpfs.cpf === cpf))
      return res.sendStatus(409);

    res.locals.customer = customer;
    res.locals.id = clientId;
    
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }

  next();
}
