import { connection } from "../database/db.js";
import dayjs from "dayjs";

export async function listRentals(req, res) {
  const { customerId, gameId } = req.query;

  try {
    if (customerId) {
      const rentals = await connection.query(
        `SELECT rentals.*, JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS "customer", JSON_BUILD_OBJECT('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS "game" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id  WHERE "customerId" = $1;`,
        [customerId]
      );

      return res.send(rentals.rows);
    }

    if (gameId) {
      const rentals = await connection.query(
        `SELECT rentals.*, JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS "customer", JSON_BUILD_OBJECT('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS "game" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id  WHERE "gameId" = $1;`,
        [gameId]
      );

      return res.send(rentals.rows);
    }

    const rentals = await connection.query(
      `SELECT rentals.*, JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS "customer", JSON_BUILD_OBJECT('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS "game" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id;`
    );

    res.send(rentals.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(5000);
  }
}

export async function enterRent(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  try {
    const cliet = await connection.query(
      "SELECT * FROM customers WHERE id = $1;",
      [customerId]
    );

    const game = await connection.query("SELECT * FROM games WHERE id = $1;", [
      gameId,
    ]);

    if (!cliet.rows.length || !game.rows.length || !daysRented)
      return res.sendStatus(400);

    const rentedGame = await connection.query(
      'SELECT * FROM rentals WHERE "gameId" = $1;',
      [game.rows[0].id]
    );

    const stockTotalGame = game.rows[0].stockTotal;

    if (stockTotalGame - rentedGame.rows.length < 0) return res.sendStatus(400);

    await connection.query(
      'INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);',
      [
        customerId,
        gameId,
        dayjs().format("YYYY-MM-DD"),
        daysRented,
        null,
        daysRented * game.rows[0].pricePerDay,
        null,
      ]
    );

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function finalizeRent(req, res) {
  const { id } = req.params;

  try {
    const rent = await connection.query("SELECT * FROM rentals WHERE id=$1;", [
      id,
    ]);

    if (!rent.rows.length) return res.sendStatus(404);

    if (rent.rows[0].returnDate) return res.sendStatus(400);

    const delayFeeResut = await connection.query(
      "SELECT CURRENT_DATE - DATE ($1) AS dias;",
      [rent.rows[0].rentDate]
    );

    const thereDelay = delayFeeResut.rows[0].dias > rent.rows[0].daysRented;

    const delayFeeValue = thereDelay
      ? delayFeeResut.rows[0].dias * rent.rows[0].originalPrice
      : 0;

    await connection.query(
      'UPDATE rentals SET "returnDate" = $1 , "delayFee" = $2  WHERE id = $3;',
      [dayjs().format("YYYY-MM-DD"), parseInt(delayFeeValue), id]
    );

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function eraseRent(req, res) {
  const { id } = req.params;

  try {
    const rent = await connection.query("SELECT * FROM rentals WHERE id = $1", [
      id,
    ]);

    if (!rent.rows.length) return res.sendStatus(404);
    if (!rent.rows[0].returnDate) return res.sendStatus(400);

    await connection.query("DELETE FROM rentals WHERE id = $1;", [id]);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
