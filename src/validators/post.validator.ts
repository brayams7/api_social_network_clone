import { NextFunction, Request, Response } from "express"
import { check } from "express-validator"
import { validateResult } from "../helpers/validate.helper"


export const registerPostValidator = [
    check('userId', "Agregue el id")
        .exists()
        .isString()
        .trim()
        .not()
        .isEmpty(),

    check('desc', "Descripción incorrecta")
        .optional(true)
        .isString(),
    
    check('image', "El campo es requerido")
        .optional(true)
        .isString(),

    (req:Request, res:Response, next:NextFunction)=>{

        validateResult(req,res,next)
    }
]


export const likedPostValidator = [
    check('idUser', "Agregue el id de usuario")
        .exists()
        .isString()
        .trim()
        .not()
        .isEmpty(),
    check('like', 'El campo es requerido')
        .exists()
        .isBoolean(),

    (req:Request, res:Response, next:NextFunction)=>{
        validateResult(req,res,next)
    }
]

