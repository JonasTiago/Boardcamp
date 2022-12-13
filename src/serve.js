import express from "express";
import cors from "cors";
import categoriesRoutes from "./routers/categoriesRoutes.js";
import gamesRouter from "./routers/gamesRoutes.js";
import customersRouter from "./routers/customersRoutes.js";
import rentalsRouter from "./routers/rentalsRontes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(categoriesRoutes);
app.use(gamesRouter);
app.use(customersRouter);
app.use(rentalsRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running in port ${port}`));