import { Router } from "express";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { OrderRepository } from "./order.repository";

const router = Router();

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

router.post("/", orderController.create);
router.get("/", orderController.list);
router.patch("/:id/advance", orderController.advance);

export default router;

