import { Request } from "express";
import { PayloadInterface } from "../jwt/tokenValid.interface";

export interface RequestExtend extends Request{
    user?: PayloadInterface
}
