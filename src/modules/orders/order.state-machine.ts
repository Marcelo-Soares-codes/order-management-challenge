import type { OrderState } from "./order.types";
import { AppError } from "../../shared/errors/AppError";

const STATE_TRANSITIONS: Record<OrderState, OrderState | null> = {
  CREATED: "ANALYSIS",
  ANALYSIS: "COMPLETED",
  COMPLETED: null,
};

export function getNextState(current: OrderState): OrderState {
  const nextState = STATE_TRANSITIONS[current];

  if (nextState === null) {
    throw new AppError(
      `Order is already in final state (${current}). Cannot advance further.`,
      409
    );
  }

  return nextState;
}
