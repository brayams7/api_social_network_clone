import { Response } from "express"

const handleHTTP = (res:Response, error:string, code?:number, errorRaw?:any) => {
    console.log({errorRaw})
    return res.status(code || 500).send({
        code:code || 500,
        error
    })
}

export { handleHTTP}