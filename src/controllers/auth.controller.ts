import { Request, response, Response } from "express"
import { Auth, Contact, DetailProfile, User, WorkAt } from "../interfaces/auth.interface"
import { RequestExtend } from "../interfaces/request/requestExtended.interface"
import { loginService, registerNewUserService } from "../services/auth.service"
import { deleteUserService, followUserService, getTotalPostsUser, getUserService, unfollowUserService, updatedUserDetailService, updatedUserService } from "../services/user.service"
import { generateToken, verifyToken } from "../utils/jwt.handle"

const JWT_REFRESH = process.env.JWT_REFRESH || "secretRefresh2023"

//Solo se encarga de el request y de responder.
const createUserController = async (req:Request, res:Response) => {
    
    let workAt : WorkAt[] = []

    const user : Partial<User> = {
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        password:req.body.password,
        email:req.body.email,
        isAdmin: req.body.isAdmin || false,
        username:req.body.username,
        profilePicture: req.body.profilePicture || "",
        coverPicture: req.body.coverPicture || "",
        followers:[],
        following:[],
    }

    const responseInterface = await registerNewUserService(user)
    if(responseInterface.code === 200){
        
        const auth: Auth = {
            username:req.body.username,
            password:req.body.password,
        }
        
        const loginUser = await loginService(auth)
        const refreshToken = String(loginUser.extra?.refreshToken)
        
        if(refreshToken){
            res.cookie("refreshToken", refreshToken,{
                httpOnly:true,
                secure: !(process.env.MODO === 'develop')
            })
        }
        
        return res.json(loginUser)
    }else{
        return res.json(responseInterface)
    }
    
    // return res.json(responseInterface)
}

const loginUserController = async (req:Request, res:Response) => {
    const body = req.body
    const auth: Auth = {
        username:body.username,
        password:body.password
    }

    const response = await loginService(auth)
    const refreshToken = String(response.extra?.refreshToken)
    
    if(refreshToken){
        res.cookie("refreshToken", refreshToken,{
            httpOnly:true,
            secure: !(process.env.MODO === 'develop')
        })
    }
    
    return res.json(response)
}


const refreshTokenController = (req:Request, res:Response)=>{
    // const cookieRefreshToken = req.cookies.refreshToken
    
    const refreshToken = req.header("refreshToken") || ""

    const jwt = refreshToken.split(" ")[1]

    if(!(jwt !== "" && typeof jwt === "string")){
        return res.json({
            code:401,
            message:"NO autorizado",
            data:null
        }).status(401)        
    }
    const verifyT = verifyToken(jwt, JWT_REFRESH)
    console.log(verifyT)
    const id = verifyT.payload?.id || ''

    if(verifyT.isError || id === '')
        return res.json({
            code:401,
            message:"NO autorizado",
            data:null
        }).status(401)

    const token = generateToken(id)
    
    return res.json({
        code:200,
        message:"ok",
        data:token
    })
}

const getUserInfoController = async (req:RequestExtend, res:Response) => {

    const id = req.params.id
    const response = await getUserService(id)
    
    return res.json({
        response
    })
}

const updateUserController = async (req:RequestExtend, res:Response) => {

    const id = req.params.id

    const user : Partial<User> = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        password : req.body.password,
        email : req.body.email,
        isAdmin : req.body.isAdmin,
        username : req.body.username,
        profilePicture : req.body.profilePicture,
        coverPicture : req.body.coverPicture,
        followers: req.body.followers,
        following:req.body.following,
    }

    const response = await updatedUserService(id,user)
    
    return res.json({
        response
    })
}

const updateDetailUserController = async (req:RequestExtend, res:Response) => {

    const id = req.params.id
    
    
    const detailProfile: Partial<DetailProfile> = {
        about   : req.body.about,
        livesIn : req.body.livesIn,
        workAt  : req.body.workAt,
        relationShip :  req.body.relationShip
    }

    const response = await updatedUserDetailService(id,detailProfile)
    
    return res.json({
        response
    })
}


const deleteUserController = async (req:RequestExtend, res:Response) => {

    const id = req.user?.id

    const response = await deleteUserService(id)
    return res.status(response.code).json({
        response
    })
}

const followUserController = async (req:RequestExtend, res:Response) => {

    const currentUserId = req.user?.id
    const followId = req.params.id

    if(
        !(typeof currentUserId === "string" &&
        typeof followId === "string")
    ){
        return res.status(404).json({
            code:404,
            data:null,
            message:"Mala petición"
        })
    }

    const response = await followUserService(followId,currentUserId)
    const responseData = response.getResponseData()
    return res.status(responseData.code).json({
        response:responseData
    })
}

const unfollowUserController = async (req:RequestExtend, res:Response) => {

    const currentUserId = req.user?.id
    const followId = req.params.id

    if(
        !(typeof currentUserId === "string" &&
        typeof followId === "string")
    ){
        return res.status(404).json({
            code:404,
            data:null,
            message:"Mala petición"
        })
    }

    const response = await unfollowUserService(followId,currentUserId)
    const responseData = response.getResponseData()
    return res.status(responseData.code).json({
        response:responseData
    })
}

const getTotalPostsUserController = async (req:RequestExtend, res:Response)=>{
    const idUser = req.params.id

    if(
        !(typeof idUser === "string")
    ){
        return res.status(404).json({
            code:404,
            data:null,
            message:"Mala petición"
        })
    }

    const response = await getTotalPostsUser(idUser)
    const responseData = response.getResponseData()
    return res.status(responseData.code).json({
        response:responseData
    })
} 
   


export {
    createUserController,
    loginUserController,
    getUserInfoController,
    refreshTokenController,
    updateUserController,
    updateDetailUserController,
    deleteUserController,
    followUserController,
    unfollowUserController,
    getTotalPostsUserController
}