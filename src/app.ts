import express from "express";
import orderRoutes from "./modules/orders/order.routes";
import { errorHandler } from "./shared/errors/errorHandler";

export const app = express();

app.use(express.json());

app.use("/orders", orderRoutes);

app.use(errorHandler);
