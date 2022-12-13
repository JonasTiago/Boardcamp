import { connection } from "../database/db.js";

export default async function deleteRentValidate(req, res, next) {
  const { id } = req.params;

  try {
    const rent = await connection.query("SELECT * FROM rentals WHERE id = $1", [
      id,
    ]);

    if (!rent.rows.length) return res.sendStatus(404);
    if (!rent.rows[0].returnDate) return res.sendStatus(400);

    res.locals.id = id;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }

  next();
}
