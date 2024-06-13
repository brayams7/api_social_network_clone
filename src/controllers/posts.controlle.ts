import { Response } from "express"
import { PreViewProfileInterface } from "../interfaces/auth.interface"
import { PostCreateInterface, PostInterface, UpdatePostInterface } from "../interfaces/posts/post.interface"
import { RequestExtend } from "../interfaces/request/requestExtended.interface"
import { createPostService, getPostService, getPostsAggregatePaginate, getPostsService, getTimeLinePostsService, getTimeLineUserAggregatePaginate, likePostService, updatePostService } from "../services/post.service"



const getPostController = async (req:RequestExtend, res:Response) => {
    const idPost = req.params.id

    if(
        typeof idPost !== "string" || !idPost
    ){
        return res.status(404).json({
            code:404,
            data:null,
            message:"Mala petición"
        })
    }

    const response = await getPostService(idPost)
    return res.status(response.code).json(response)

}

const createPostController = async (req:RequestExtend, res:Response) => {
    
    const post: PostCreateInterface = {
        userId:req.body.userId,
        desc:req.body.desc || '',
        likes:[],
        image:req.body.image
    }

    console.log(post)

    const response = await createPostService(post)
    return res.status(response.code).json(response)
}

const updatePostController = async (req:RequestExtend, res:Response) => {
    const idPost = req.params.id

    if(
        typeof idPost !== "string" || !idPost
    ){
        return res.status(404).json({
            code:404,
            data:null,
            message:"Mala petición"
        })
    }
    const post: UpdatePostInterface = {
        userId:req.body.userId,
        desc:req.body.desc,
        image:req.body.image
    }

    const response = await updatePostService(idPost,post)
    return res.status(response.code).json(response)
}

const likePostController = async (req:RequestExtend, res:Response) => {
    
    const idPost = req.params.idPost
    const idUser = req.body.idUser
    const like = req.body.like

    if(
        (typeof idPost !== "string" || !idPost)
        && (typeof idUser !== "string" || !idUser)

    ){
        return res.status(404).json({
            code:404,
            data:null,
            message:"Mala petición"
        })
    }

    

    const response = await likePostService(idPost,idUser, like)
    return res.status(response.code).json(response)
}


const listPostController = async (req:RequestExtend, res:Response) => {
    console.log(req.cookies.refreshToken)
    const idUser = req.params.idUser
    if(
        typeof idUser !== "string" || !idUser
    ){
        return res.status(404).json({
            code:404,
            data:null,
            message:"Mala petición"
        })
    }

    const response = await getTimeLinePostsService(idUser)
    return res.status(response.code).json(response)
}

const listPostsAllController = async (req:RequestExtend, res:Response) => {
    let page = req.query.page || "1"
    let limit = req.query.limit || "5"

    if(
        (typeof page !== "string" || !page) ||
        (typeof limit !== "string" || !limit)
    ){
        return res.status(404).json({
            code:404,
            data:null,
            message:"Mala petición"
        })
    }else{
        
        const response = await getPostsService(parseInt(page), parseInt(limit))
        return res.status(response.code).json(response)
    }
}

const listPostsPaginationController = async (req:RequestExtend, res:Response) => {
    
    let page = req.query.page || "1"
    let limit = req.query.limit || "5"
    
    if(
        (typeof page !== "string" || !page) ||
        (typeof limit !== "string" || !limit)
    ){
        return res.status(404).json({
            code:404,
            data:null,
            message:"Mala petición"
        })
    }else{
        
        const response = await getPostsAggregatePaginate(parseInt(page), parseInt(limit))
        return res.status(response.code).json(response)
    }
}

const getTimeLineUserAggregatePaginateController = async (req:RequestExtend, res:Response) => {
    
    let page = req.query.page || "1"
    let limit = req.query.limit || "5"
    const idUser = req.params.idUser

    if(
        (typeof page !== "string" || !page) ||
        (typeof limit !== "string" || !limit) ||
        !idUser
    ){
        return res.status(404).json({
            code:404,
            data:null,
            message:"Mala petición"
        })
    }else{
        
        const response = await getTimeLineUserAggregatePaginate(idUser, parseInt(page), parseInt(limit))
        return res.status(response.code).json(response)
    }
}

export {
    listPostController,
    createPostController,
    getPostController,
    updatePostController,
    likePostController,
    listPostsAllController,
    listPostsPaginationController,
    getTimeLineUserAggregatePaginateController
}
