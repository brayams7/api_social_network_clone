export interface TokenValidInterface{
    isError:boolean,
    message:string,
    payload:PayloadInterface | null
}

export interface PayloadInterface{
    id:string,
    iat:number,
    expires:number,
    newToken:NewTokenInterface
}

export interface NewTokenInterface{
    jwt:string,
    expires: any
}