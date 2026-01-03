import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "../auth.service";
import { AppError } from "../../../shared/errors/AppError";
import bcrypt from "bcryptjs";

// Mock do bcrypt
vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

describe("AuthService", () => {
  const mockUserRepository = {
    findByEmail: vi.fn(),
    create: vi.fn(),
  };

  let authService: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    authService = new AuthService(mockUserRepository as any);
  });

  it("should throw AppError when user does not exist on login", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login({
        email: "test@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should throw AppError when password is invalid", async () => {
    mockUserRepository.findByEmail.mockResolvedValue({
      password: "hashed-password",
    });

    (bcrypt.compare as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      false
    );

    await expect(
      authService.login({
        email: "test@example.com",
        password: "wrong-password",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
