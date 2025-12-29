import { OrderRepository } from "./order.repository";
import type {
  CreateOrderDTO,
  ListOrdersQuery,
  OrderResponse,
  PaginationMeta,
  OrderState,
  OrderServiceItem,
} from "./order.types";
import { AppError } from "../../shared/errors/AppError";
import type { OrderDocument } from "./order.model";
import { getNextState } from "./order.state-machine";

export class OrderService {
  constructor(private repository: OrderRepository) {}

  async create(dto: CreateOrderDTO): Promise<OrderResponse> {
    // Validar services
    if (!dto.services || dto.services.length === 0) {
      throw new AppError(
        "Services array is required and must have at least one item",
        400
      );
    }

    // Calcular total
    const total = this.calculateTotal(dto.services);

    // Validar total > 0
    if (total <= 0) {
      throw new AppError("Total order value must be greater than 0", 400);
    }

    // Forçar defaults (ignorar se vier do client)
    const orderData = {
      lab: dto.lab,
      patient: dto.patient,
      customer: dto.customer,
      state: "CREATED" as OrderState,
      status: "ACTIVE" as const,
      services: dto.services.map((service) => ({
        name: service.name,
        value: service.value,
        status: service.status || "PENDING",
      })),
    };

    const order = await this.repository.create(orderData);
    return this.mapToResponse(order);
  }

  async list(query: ListOrdersQuery): Promise<{
    data: OrderResponse[];
    meta: PaginationMeta;
  }> {
    // Tratar paginação com defaults e máximo
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 10));

    const skip = (page - 1) * limit;

    const { items, total } = await this.repository.list({
      state: query.state,
      skip,
      limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: items.map((item) => this.mapToResponse(item)),
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async advance(id: string): Promise<OrderResponse> {
    const order = await this.repository.findById(id);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    // Calcular próximo estado usando state machine
    const nextState = getNextState(order.state);

    // Atualizar e persistir
    order.state = nextState;
    const updatedOrder = await this.repository.save(order);

    return this.mapToResponse(updatedOrder);
  }

  private calculateTotal(services: Array<{ value: number }>): number {
    return services.reduce((sum, service) => sum + service.value, 0);
  }

  private mapToResponse(doc: OrderDocument): OrderResponse {
    return {
      id: doc._id.toString(),
      lab: doc.lab,
      patient: doc.patient,
      customer: doc.customer,
      state: doc.state,
      status: doc.status,
      services: doc.services.map((service) => ({
        name: service.name,
        value: service.value,
        status: service.status,
      })),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
