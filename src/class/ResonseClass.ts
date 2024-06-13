import { ResponseInterface } from "../interfaces/response.interface";

class ResponseClass{
    code:number;
    message:any;
    data:object | null;
    extra:any

    constructor(code:number, data:object | null, message:any = "", extra:any = null){
        this.code = code
        this.message=message
        this.data=data
        this.extra = extra
    }

    setData(data:object|null):void{
        this.data = data
    }
    
    setMessage(message:any):void{
        this.message = message
    }

    setCode(code:number):void{
        this.code = code
    }

    setExtra(extra:any):void{
        this.extra = extra
    }

    getExtra():any{
        return this.extra
    }

    getResponseData() : ResponseInterface{
        return {
            code:this.code,
            message:this.message,
            data: this.data,
            extra:this.extra ?? null
        }
    }
}

export {
    ResponseClass
}