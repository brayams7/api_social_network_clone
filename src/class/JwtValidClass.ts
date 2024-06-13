import { PayloadInterface, TokenValidInterface } from "../interfaces/jwt/tokenValid.interface"

class JwtValidClass{
    isError:boolean
    message:string
    payload:PayloadInterface | null

    constructor(error:boolean, message:any, payload:PayloadInterface | null){
        this.isError = error
        this.message=message || ""
        this.payload = payload
    }

    setIsError(isError:boolean){
        this.isError = isError
    }

    setMessage(message:string){
        this.message = message
    }

    setPayload(payload:PayloadInterface | null){
        this.payload = payload
    }

    getFullData(): TokenValidInterface{
        return {
            isError:this.isError,
            message:this.message,
            payload:this.payload
        }
    }
}

export {
    JwtValidClass
}