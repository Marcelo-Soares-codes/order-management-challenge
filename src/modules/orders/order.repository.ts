import { OrderModel, type OrderDocument } from "./order.model";
import type { OrderState } from "./order.types";
import { Types } from "mongoose";

export class OrderRepository {
  async create(data: {
    lab: string;
    patient: string;
    customer: string;
    state: OrderState;
    status: "ACTIVE" | "DELETED";
    services: Array<{
      name: string;
      value: number;
      status: "PENDING" | "DONE";
    }>;
  }): Promise<OrderDocument> {
    const order = new OrderModel(data);
    return await order.save();
  }

  async findById(id: string): Promise<OrderDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return await OrderModel.findById(id);
  }

  async list(params: {
    state?: OrderState;
    skip: number;
    limit: number;
  }): Promise<{ items: OrderDocument[]; total: number }> {
    const filter: Record<string, unknown> = {};

    if (params.state) {
      filter.state = params.state;
    }

    const [items, total] = await Promise.all([
      OrderModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(params.skip)
        .limit(params.limit)
        .exec(),
      OrderModel.countDocuments(filter).exec(),
    ]);

    return { items, total };
  }

  async save(doc: OrderDocument): Promise<OrderDocument> {
    return await doc.save();
  }
}
