import { connection } from "../database/db.js";
import rentalSchema from "../models/schemaRentals.js";

export default async function rentalsSchema(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;

  const { error } = rentalSchema.validate(
    { customerId, gameId, daysRented },
    { abortEarly: false }
  );

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }

  try {
    const customerValid = await connection.query(
      "SELECT * FROM customers WHERE id = $1;",
      [customerId]
    );

    const gameValid = await connection.query(
      "SELECT * FROM games WHERE id = $1;",
      [gameId]
    );

    if (!customerValid.rows.length || !gameValid.rows.length || !daysRented)
      return res.sendStatus(400);

    const rentedGame = await connection.query(
      'SELECT * FROM rentals WHERE "gameId" = $1;',
      [gameValid.rows[0].id]
    );

    const stockTotalGame = gameValid.rows[0].stockTotal;

    if (stockTotalGame - rentedGame.rows.length < 0) return res.sendStatus(400);

    const originalPrice = gameValid.rows[0].pricePerDay * daysRented

    const newRent = { customerId, gameId, daysRented, originalPrice}

    res.locals.rent = newRent;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }

  next();
}
