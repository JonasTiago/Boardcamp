import categorieSchema from "../models/schemaCategories.js";
import { connection } from "../database/db.js";

export default async function categoriesSchema(req, res, next) {
  const { name } = req.body;

  const categorie = {
    name,
  };

  const { error } = categorieSchema.validate(categorie);

  if (error) return res.status(401).send(error.details[0].message);

  try {
    const categorieNot = await connection.query(
      "SELECT * FROM categories WHERE name = $1",
      [name]
    );

    if (categorieNot.rows.length) return res.sendStatus(409);
  } catch (err) {
    res.sendStatus(500);
  }

  res.locals.name = name;

  next();
}
