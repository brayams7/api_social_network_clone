import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";


export const validateResult = (req:Request, res:Response, next:NextFunction)=>{
    let globalErrors: ValidationError[] = []
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            globalErrors = errors.array()
            throw new Error("Error en los datos")    
        }
        return next()
    } catch (error:any) {
        
        return res.status(404).json({
            errors:globalErrors
        })
    }
}