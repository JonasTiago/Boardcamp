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
      `SELECT rentals.*, JSON_BUILD_OBJECT('id', customers.id, 'name', customers.name) AS "customer", JSON_BUILD_OBJECT('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS "game" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id ;`
    );

    res.send(rentals.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(5000);
  }
}

export async function enterRent(req, res) {
  const { customerId, gameId, daysRented, originalPrice } = res.locals.rent;

  try {
    await connection.query(
      'INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);',
      [
        customerId,
        gameId,
        dayjs().format("YYYY-MM-DD"),
        daysRented,
        null,
        originalPrice,
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
  const { delayFeeValue, id } = res.locals.rentValids;

  try {
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
  const id = res.locals.id;

  try {
    await connection.query("DELETE FROM rentals WHERE id = $1;", [id]);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
