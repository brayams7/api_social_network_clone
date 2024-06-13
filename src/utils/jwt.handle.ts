import {sign, verify, VerifyErrors} from 'jsonwebtoken'
import "dotenv/config"
import { JSON_WEB_TOKEN_ERROR, TOKEN_EXPIRED_ERROR } from './typesErrors'
import { JwtValidClass } from '../class/JwtValidClass'
import { NewTokenInterface } from '../interfaces/jwt/tokenValid.interface'

const JWT_SECRET = process.env.JWT_SECRET || "Secreto2022"
const JWT_REFRESH = process.env.JWT_REFRESH || "secretRefresh2023"

const generateToken = (id:string)=>{
  // const expiresIn = 60*60*24*30 //30 días
  const expiresIn = 60*60*24 //1 día


    const jwt = sign({id},JWT_SECRET,{
        expiresIn
    })

    return {
      jwt,
      expires: new Date(Date.now() + expiresIn * 1000) 
    }
}

//se encarga de generar un nuevo token
const generateRefreshToken = (id:string)=>{
  const expiresIn = 60*60*24*30

    const refreshToken = sign({id},JWT_REFRESH,{
        expiresIn
    })

    return {
      refreshToken,
      expires: new Date(Date.now() + expiresIn * 1000)
    }
}

const verifyToken = (token:string, JWT_SECRET:string)=>{
    const initialPayload = {id:'', iat: 0, expires: 0,newToken:{jwt:'',expires:''}}
    const jwtValidClass = new JwtValidClass(false,"",initialPayload)

    verify(token, JWT_SECRET, (error:null | VerifyErrors, decod:any) => {

      if (error) {
        switch (error.name) {
          case TOKEN_EXPIRED_ERROR:
            jwtValidClass.setIsError(true)
            jwtValidClass.setMessage('TOKEN EXPIRADO')
            break
          case JSON_WEB_TOKEN_ERROR:
            jwtValidClass.setIsError(true)
            jwtValidClass.setMessage('JSON WEB TOKEN ERROR')
            break
          default:
            jwtValidClass.setIsError(true)
            jwtValidClass.setMessage('TOKEN INVÁLIDO')
            break 
        }
      }else{
        jwtValidClass.setIsError(false)
        jwtValidClass.setMessage('TOKEN VÁLIDO')
        jwtValidClass.setPayload({
            ...initialPayload,
            id:decod.id, iat: decod.iat, expires: decod.exp
        })
      }
        
    })

    return jwtValidClass.getFullData()
}

const verifyTokenWithRefresh = (id:string, token:string, JWT_SECRET:string)=>{
  const initialPayload = {id:'', iat: 0, expires: 0,newToken:{jwt:'',expires:''}}

  const jwtValidClass = new JwtValidClass(false,"",initialPayload)


  verify(token, JWT_SECRET, (error:null | VerifyErrors, decod:any) => {

    let tokenExpiration = false
    let newToken:NewTokenInterface
    if (error) {
      switch (error.name) {
        case TOKEN_EXPIRED_ERROR:
          tokenExpiration = true
          break
        case JSON_WEB_TOKEN_ERROR:
          jwtValidClass.setIsError(true)
          jwtValidClass.setMessage('JSON WEB TOKEN ERROR')
          break
        default:
          jwtValidClass.setIsError(true)
          jwtValidClass.setMessage('TOKEN INVÁLIDO')
          break 
      }

      if(tokenExpiration){

        newToken = generateToken(id)

        jwtValidClass.setIsError(false)
        jwtValidClass.setMessage('REFRESH_TOKEN')
        jwtValidClass.setPayload({
          id:decod.id, 
          iat: decod.iat, 
          expires: decod.exp,
          newToken:newToken
        })

      }
     
    }else{
      jwtValidClass.setIsError(false)
      jwtValidClass.setMessage('TOKEN VÁLIDO')
      jwtValidClass.setPayload({
        ...initialPayload,
        id:decod.id, iat: decod.iat, expires: decod.exp
      })
    }
      
  })

  return jwtValidClass.getFullData()
}

export {
    generateToken,
    verifyToken,
    generateRefreshToken,
    verifyTokenWithRefresh
}