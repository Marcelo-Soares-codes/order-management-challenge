import type { Request, Response, NextFunction } from "express";
import { OrderService } from "./order.service";
import type { CreateOrderDTO, ListOrdersQuery } from "./order.types";

export class OrderController {
  constructor(private orderService: OrderService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: CreateOrderDTO = req.body;
      const order = await this.orderService.create(dto);
      return res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: ListOrdersQuery = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        state: req.query.state as ListOrdersQuery["state"],
      };

      const result = await this.orderService.list(query);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  advance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      const order = await this.orderService.advance(id);
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  };
}
