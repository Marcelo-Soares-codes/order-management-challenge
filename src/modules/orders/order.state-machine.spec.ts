import { describe, it, expect } from "bun:test";
import { getNextState } from "./order.state-machine";
import { AppError } from "../../shared/errors/AppError";
import type { OrderState } from "./order.types";

describe("Order State Machine", () => {
  it("should return ANALYSIS when current state is CREATED", () => {
    const result = getNextState("CREATED");
    expect(result).toBe("ANALYSIS");
  });

  it("should return COMPLETED when current state is ANALYSIS", () => {
    const result = getNextState("ANALYSIS");
    expect(result).toBe("COMPLETED");
  });

  it("should throw AppError when trying to advance from COMPLETED", () => {
    expect(() => getNextState("COMPLETED")).toThrow(AppError);
  });

  it("should throw AppError instance with statusCode 409 when advancing from COMPLETED", () => {
    let thrownError: unknown;
    
    try {
      getNextState("COMPLETED");
    } catch (error) {
      thrownError = error;
    }
    
    expect(thrownError).toBeInstanceOf(AppError);
    expect((thrownError as AppError).statusCode).toBe(409);
  });
});

