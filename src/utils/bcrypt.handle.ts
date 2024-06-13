import { hash, compare } from "bcryptjs"

const encrypt = async (password:string)=>{
    return await hash(password,10)
}

const verified = async (password:string,passHass:string)=>{
    return await compare(password,passHass)
}

export {
    verified,
    encrypt
}