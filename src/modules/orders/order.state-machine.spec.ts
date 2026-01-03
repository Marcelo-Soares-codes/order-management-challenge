import { describe, it, expect } from "vitest";
import { getNextState } from "./order.state-machine";
import { AppError } from "../../shared/errors/AppError";

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

  it("should throw AppError with statusCode 409 when advancing from COMPLETED", () => {
    try {
      getNextState("COMPLETED");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).statusCode).toBe(409);
    }
  });
});
