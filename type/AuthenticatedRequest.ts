import { Request } from "express";

export default interface AuthenticatedRequest extends Request {
    user?: {
      role: string;
      userId: number;
      username: string;
      name: string;
    };
  }