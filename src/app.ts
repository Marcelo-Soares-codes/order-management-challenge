import express from "express";
import orderRoutes from "./modules/orders/order.routes";
import { errorHandler } from "./shared/errors/errorHandler";
import { authMiddleware } from "./modules/auth/auth.middleware";
import authRoutes from "./modules/auth/auth.routes";

export const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/orders", authMiddleware, orderRoutes);

app.use(errorHandler);
