import { UserRepository } from "../users/user.repository";
import type { RegisterDTO, LoginDTO, AuthResponse } from "./auth.types";
import { AppError } from "../../shared/errors/AppError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(dto: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
    });

    const token = this.generateToken(user._id.toString());

    return { token };
  }

  async login(dto: LoginDTO): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = this.generateToken(user._id.toString());

    return { token };
  }

  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError("JWT_SECRET is not configured", 500);
    }

    return jwt.sign({ sub: userId }, secret, { expiresIn: "1d" });
  }
}

