export type OrderState = "CREATED" | "ANALYSIS" | "COMPLETED";
export type OrderStatus = "ACTIVE" | "DELETED";
export type ServiceStatus = "PENDING" | "DONE";

export interface OrderServiceItem {
  name: string;
  value: number;
  status: ServiceStatus;
}

export interface Order {
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
