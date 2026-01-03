import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import type { RegisterDTO, LoginDTO } from "./auth.types";

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: RegisterDTO = req.body;
      const result = await this.authService.register(dto);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: LoginDTO = req.body;
      const result = await this.authService.login(dto);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
