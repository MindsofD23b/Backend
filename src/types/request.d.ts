import { User } from "@prisma/client";
import { Request } from "express";

export interface SecureRequest extends Request {
    user?: Omit<User>;
}