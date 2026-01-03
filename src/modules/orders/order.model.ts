import mongoose, { Schema, Document } from "mongoose";
import type { OrderState, OrderStatus, OrderServiceItem } from "./order.types";

export interface OrderDocument extends Document {
  lab: string;
  patient: string;
  customer: string;
  state: OrderState;
  status: OrderStatus;
  services: OrderServiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

const ServiceItemSchema = new Schema<OrderServiceItem>(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "DONE"],
      default: "PENDING",
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<OrderDocument>(
  {
    lab: {
      type: String,
      required: true,
    },
    patient: {
      type: String,
      required: true,
    },
    customer: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      enum: ["CREATED", "ANALYSIS", "COMPLETED"],
      default: "CREATED",
      index: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "DELETED"],
      default: "ACTIVE",
      index: true,
    },
    services: {
      type: [ServiceItemSchema],
      required: true,
      validate: {
        validator: (v: OrderServiceItem[]) => v.length > 0,
        message: "Services array must have at least one item",
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const OrderModel = mongoose.model<OrderDocument>("Order", OrderSchema);
