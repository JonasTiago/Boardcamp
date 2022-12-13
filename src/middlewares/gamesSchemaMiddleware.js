import { connection } from "../database/db.js";
import gameSchema from "../models/schemaGames.js";

export default async function gamesSchema(req, res, next) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  const game = {
    name,
    image,
    stockTotal,
    categoryId,
    pricePerDay,
  };

  const { error } = gameSchema.validate(game, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }

  try {
    const categoryValid = await connection.query(
      "SELECT * FROM categories WHERE id = $1",
      [categoryId]
    );

    if (!categoryValid.rows.length) return res.sendStatus(400);

    const nameValid = await connection.query(
      "SELECT * FROM games WHERE name = $1;",
      [name]
    );

    if (nameValid.rows.length) return res.sendStatus(409);

    res.locals.game = game;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }

  next();
}
