import { NextFunction, Request, Response } from "express";
import { check, param } from "express-validator";
import { validateResult } from "../helpers/validate.helper";


export const registerUserValidator = [
    check('email', "Ingrese un email válido")
        .optional(true)
        .isEmail()
        .normalizeEmail(),

    check('username', "Ingrese un username valido")
        .exists()
        .trim()
        .not()
        .isEmpty(),
    
    check('firstName', "el Nombre es requerido")
        .exists()
        .trim()
        .not()
        .isEmpty(),

    check('lastName', "el Nombre es requerido")
        .exists()
        .trim()
        .not()
        .isEmpty(),

    check('password', "La contraseña es incorrecta")
        .exists()
        .trim()
        .not()
        .isEmpty()
        .isLength({min:8})
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .custom((input:string, {req})=>{
            if(input !== req.body.confirmPassword) throw new Error('Las contraseñas no coiciden')
            return true
        }),

    (req:Request, res:Response, next:NextFunction)=>{

        validateResult(req,res,next)
    }
]

export const updateUserValidator = [
    check('email', "Ingrese un email válido")
        .optional(true)
        .isEmail()
        .normalizeEmail(),

    check('username', "Ingrese un username valido")
        .optional()
        .isString(),
    
    check('firstName', "el Nombre es requerido")
        .optional()
        .isString(),

    check('lastName', "el Nombre es requerido")
        .optional()
        .isString(),

    check('password', "La contraseña es incorrecta")
        .optional()
        .isString()
        .isLength({min:8})
        .withMessage('La contraseña debe tener al menos 8 caracteres'),

    check('profilePicture', "Ingrese un valor correcto")
        .optional(true)
        .isString()
        .withMessage('Debe ser un String'),

    check('coverPicture', "Ingrese un valor de portada corrrecta correcto")
        .optional(true)
        .isString()
        .withMessage('Debe ser un String'),

    // check('followers', "Ingresa el valor de followers correcto")
    //     .exists()
    //     .isArray()
    //     .withMessage('Debe ser una lista'),

    // check('following', "Ingresa el valor de following correcto")
    //     .exists()
    //     .isArray()
    //     .withMessage('Debe ser una lista'),

    check('about', "Ingresa un valor correcto")
        .optional()
        .isString(),

    check('livesIn', "Ingresa un valor correcto")
        .optional()
        .isString(),

    check('relationShip', "Ingresa un valor correcto")
        .optional()
        .isString(),

    check('workAt', "Ingresa un valor correcto")
        .optional()
        .isArray()
        .customSanitizer((list:[])=>{
            const listMap = []
            for (const value of list) {
                if(typeof value === "string"){
                    listMap.push({
                        name:value
                    })
                }else{
                    throw new Error('La lista de WorkAt debe ser de tipo String')
                }
            }
                
            return listMap
        }),

    (req:Request, res:Response, next:NextFunction)=>{

        validateResult(req,res,next)
    }
]


export const paramIdValidator = [
    param('id',"Mala petición en la url")
    .exists()
    .not()
    .isEmpty()
    .isString(),
    (req:Request, res:Response, next:NextFunction)=>{

        validateResult(req,res,next)
    }
]

export const loginUserValidator = [
    check('username', "Ingrese un username valido")
        .exists()
        .trim()
        .not()
        .isEmpty(),

    check('password', "La contraseña es incorrecta")
        .exists()
        .trim()
        .not()
        .isEmpty()
        .isLength({min:8})
        .withMessage('La contraseña debe tener al menos 8 caracteres'),
    
    (req:Request, res:Response, next:NextFunction)=>{

        validateResult(req,res,next)
    }
]