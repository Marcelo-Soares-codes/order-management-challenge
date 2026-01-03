import { UserModel, type UserDocument } from "./user.model";
import type { CreateUserDTO } from "./user.types";
import { Types } from "mongoose";

export class UserRepository {
  async create(data: CreateUserDTO): Promise<UserDocument> {
    const user = new UserModel(data);
    return await user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await UserModel.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return await UserModel.findById(id);
  }
}

