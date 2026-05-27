import type { Request } from "express";

export interface RequestWithUser extends Request {
  user?: {
    id: string;
    displayName: string;
    username: string;
  };
}
