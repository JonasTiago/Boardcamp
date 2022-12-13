import { connection } from "../database/db.js";

export default async function rentFinalizeValidate(req, res, next) {
  const { id } = req.params;

  try {
    const rentValid = await connection.query(
      "SELECT * FROM rentals WHERE id=$1;",
      [id]
    );

    if (!rentValid.rows.length) return res.sendStatus(404);

    if (rentValid.rows[0].returnDate) return res.sendStatus(400);

    const delayFeeResut = await connection.query(
      "SELECT CURRENT_DATE - DATE ($1) AS dias;",
      [rentValid.rows[0].rentDate]
    );

    const thereDelay =
      delayFeeResut.rows[0].dias > rentValid.rows[0].daysRented;

    const delayFeeValue = thereDelay
      ? delayFeeResut.rows[0].dias * rentValid.rows[0].originalPrice
      : 0;

    const rentValids = { delayFeeValue, id };

    res.locals.rentValids = rentValids;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }

  next();
}
