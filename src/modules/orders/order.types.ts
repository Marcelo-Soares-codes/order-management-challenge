export type OrderState = "CREATED" | "ANALYSIS" | "COMPLETED";
export type OrderStatus = "ACTIVE" | "DELETED";
export type ServiceStatus = "PENDING" | "DONE";

export interface OrderServiceItem {
  name: string;
  value: number;
  status: ServiceStatus;
}

export interface OrderEntity {
  lab: string;
  patient: string;
  customer: string;
  state: OrderState;
  status: OrderStatus;
  services: OrderServiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderDTO {
  lab: string;
  patient: string;
  customer: string;
  services: Array<{
    name: string;
    value: number;
    status?: ServiceStatus;
  }>;
  state?: OrderState;
  status?: OrderStatus;
}

export interface ListOrdersQuery {
  page?: number;
  limit?: number;
  state?: OrderState;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrderResponse {
  id: string;
  lab: string;
  patient: string;
  customer: string;
  state: OrderState;
  status: OrderStatus;
  services: OrderServiceItem[];
  createdAt: Date;
  updatedAt: Date;
}
