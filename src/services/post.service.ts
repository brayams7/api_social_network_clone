import mongoose, { Document, Types } from "mongoose";
import { ResponseClass } from "../class/ResonseClass";
import { PreViewProfileInterface } from "../interfaces/auth.interface";
import {
  PostCreateInterface,
  PostInterface,
  UpdatePostInterface,
} from "../interfaces/posts/post.interface";
import PostModel, { PostModelAggregate, PostModelTimeLine } from "../model/post.model";
import UserModel, { UserModelAggregate } from "../model/user.model";

const responseMessageLike = {
  like:"Post liked",
  dislike:"Post unliked"
}

const createPostService = async (post: PostCreateInterface) => {
  try {
    const newPost = await PostModel.create(post);
    return new ResponseClass(200, newPost, "OK").getResponseData();
  } catch (error) {
    console.log(error);
    return new ResponseClass(404, {}, "FALLIDO").getResponseData();
  }
};

const getPostService = async (idPost: string) => {
  try {
    const post = await PostModel.findById(idPost);
    return new ResponseClass(200, post, "OK").getResponseData();
  } catch (error) {
    console.log(error);
    return new ResponseClass(
      404,
      {},
      "Ocurrió un error, intente mas tarde"
    ).getResponseData();
  }
};

/**
 * 
 * @param id 
 * @param updatePost 
 * @returns 
 * 
 * Este servicio actualiza un post de forma general, tomando como referencia
 * la interface de postInterface
 */
const updatePostService = async (
  id: string,
  updatePost: UpdatePostInterface
) => {
  try {
    const post = await PostModel.findById(id);
    
    if (post?.userId !== updatePost.userId) {
      return new ResponseClass(
        404,
        {},
        "Acceso no autorizado"
      ).getResponseData();
    }

    const nPost = await post.updateOne({
        $set:{
            desc:updatePost.desc,
            image:updatePost.image
        }
    },{new:true})

    return new ResponseClass(
        200,
        nPost,
        "Ok"
    ).getResponseData();

  } catch (error) {
    console.log(error);
    return new ResponseClass(404, {}, "FALLIDO").getResponseData();
  }
}

/**
 * 
 * @param id 
 * 
 * @param userLiked 
 * @returns ResponseInterface
 * 
 * Description:
 *  Like/dislike a post 
 */
const likePostService = async (
    idPost: string,
    idUser:string,
    like:boolean
  ) => {

    let message = like ? responseMessageLike.like : responseMessageLike.dislike
    let data = {}

    try {
      const user = await UserModel.findById(idUser)
      const post = await PostModel.findById(idPost)

      if(!post || !user){
        return new ResponseClass(
          404,
          {},
          "Error en credenciales"
        ).getResponseData()
      }
      const likes : PreViewProfileInterface[] = post?.likes || []
      
      const userLiked: PreViewProfileInterface = {
        idUser:user.id,
        username:user.username,
        profilePicture:user.profilePicture,
        followers:user.followers,
        following:user.following
      }

      const isLiked = likes.find((profile:PreViewProfileInterface) =>{
        const idUser = profile.idUser.toString()
        return idUser === userLiked.idUser
      })

      if(like && isLiked) message = responseMessageLike.like
      

      if(!like && !isLiked) message = responseMessageLike.dislike
      
      if(like && !isLiked){
        const nPost = await post.updateOne({
          $push:{
            likes: userLiked
          }
        },{new:true})
        message = responseMessageLike.like
        data = nPost

      }

      if(!like && isLiked){
        const nPost = await post.updateOne({
          $pull:{
            likes: userLiked
          }
        },{new:true})
        message = responseMessageLike.dislike
        data = nPost

      }
      

      return new ResponseClass(
        200,
        data,
        message
      ).getResponseData()
      
    } catch (error) {
      console.log(error);
      return new ResponseClass(404, {}, "FALLIDO").getResponseData();
    }
}

/**
 * 
 * @param userId 
 * 
 * @returns 
 * 
 * Esta función se encarga de listar los posts del usuario logueado y 
 * a los que sigue.
 */
const getTimeLinePostsService = async (userId:string, page=0)=>{
  try {
    const currentUserPosts = await PostModel.find(
      {
        userId
      }
    ).sort({
      updatedAt:-1
    })

    const skip = page * 10
    const limit = (page+1) * 10

    const followPosts = await UserModel.aggregate( [
      {
        $match:{
          _id: new Types.ObjectId(userId)
        }
      },
      {
        $lookup:{
          from:"posts",
          localField:"following",
          foreignField:"userId",
          as : "followingPosts"
        }
      },
      {
        $project:{
          followingPosts:1,
          _id:0
        }
      }
    ]).skip(skip).limit(limit)

    const listPosts = currentUserPosts.concat(...followPosts[0].followingPosts)
    listPosts.sort((a,b)=>{
                          return b.createdAt.getTime() - a.createdAt.getTime()
                        })

    // const listPostTemp = followPosts.filter(value=>{
    //   return typeof value === "string" 
    // })
    // console.log(listPostTemp)
    return new ResponseClass(
      200,
      listPosts,
      "OK"
    ).getResponseData()
  } catch (error) {
    return new ResponseClass(
      404,
      {},
      "FALLIDO"
    ).getResponseData()
  }
}


const getPostsService = async (page:number, limit:number)=>{
  try {
    
    const options = {
      page,
      limit,
      sort:{
        updatedAt:-1
      }
    }

    const currentPost = await PostModel.paginate({}, options)

    console.log({currentPost})

    return new ResponseClass(
      200,
      currentPost,
      "OK"
    ).getResponseData()
  } catch (error) {
    return new ResponseClass(
      404,
      {},
      "FALLIDO"
    ).getResponseData()
  }
}

const getPostsAggregatePaginate = async (page:number, limit:number) => {
  try {
    
    const options = {
      page,
      limit
    }

    const postsAggregate = PostModelAggregate.aggregate([
      {
        $addFields:{
            convertedIdUser:{
                $toObjectId:"$userId"
            }
        }  
      },
      {
        $lookup: {
          from: "users",
          localField: "convertedIdUser",
          foreignField: "_id",
          as: "dataUser",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ["$dataUser", 0],
              },
              "$$ROOT",
            ],
          },
        },
      },
      {
        $project: {
          dataUser: 0,
          email: 0,
          isAdmin: 0,
          coverPicture: 0,
          detailprofile: 0,
          // firstName: 0,
          password: 0,
          // lastName: 0,
          detailProfile: 0,
          convertedIdUser:0
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ])

    const postsPaginate = await PostModelAggregate.aggregatePaginate(postsAggregate, options)

    return new ResponseClass(
      200,
      postsPaginate,
      "OK"
    ).getResponseData()
  } catch (error) {
    return new ResponseClass(
      404,
      {},
      "FALLIDO"
    ).getResponseData()
  }
}

const getTimeLineUserAggregatePaginate = async (idUser:string, page:number, limit:number) => {
  try {
    
    const options = {
      page,
      limit
    }

    const optionsPostUser = {
      page,
      limit,
      sort:{
        updatedAt:-1
      }
    }

    const user = await UserModel.findById(idUser)

    if(!user){
      return new ResponseClass(
        404,
        {},
        "NO EXISTE USUARIO"
      ).getResponseData()
    }

    // const detailInfoUser = {
    //   firstName : user.firstName,
    //   lastName : user.lastName,
    //   username : user.username,
    //   profilePicture : user.profilePicture,
    //   followers: user.followers,
    // }

    // const currentPostUser = await PostModelTimeLine.paginate({userId:user._id}, optionsPostUser)
    
    const postsUserAggregate = PostModelAggregate.aggregate([
      {
        $match: {
          userId: "63fcf3c5478f47587656768e",
        },
      },
      {
        $addFields: {
          convertedIdUser: {
            $toObjectId: "$userId",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "convertedIdUser",
          foreignField: "_id",
          as: "dataUser",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ["$dataUser", 0],
              },
              "$$ROOT",
            ],
          },
        },
      },
      {
        $addFields: {
          post: {
            _id: "$_id",
            userId: "$userId",
            desc: "$desc",
            likes: "$likes",
            image: "$image",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt",
            __v: "$__v",
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: 0,
          desc: 0,
          likes: 0,
          image: 0,
          dataUser: 0,
          createdAt: 0,
          updatedAt: 0,
          email: 0,
          isAdmin: 0,
          coverPicture: 0,
          detailprofile: 0,
          // firstName: 0,
          password: 0,
          following: 0,
          // lastName: 0,
          detailProfile: 0,
          convertedIdUser: 0,
          __v: 0,
        },
      },
      {
        $sort: {
          "post.updatedAt": -1,
        },
      },
    ]);

    // console.log(mapPostsUser)
    const postsUserPaginate = await PostModelAggregate.aggregatePaginate(postsUserAggregate, options) 

    const defPostsFollowersUser = UserModelAggregate.aggregate([
      /*{
        $addFields: {
            convertedIdUser: {
                $toString: "$_id"
            }
        }
    },*/
      {
        $match: {
          _id: new Types.ObjectId(idUser),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "post",
        },
      },
      {
        $project: {
          _id: 0,
          email: 0,
          username: 0,
          isAdmin: 0,
          coverPicture: 0,
          profilePicture: 0,
          detailprofile: 0,
          firstName: 0,
          password: 0,
          lastName: 0,
          detailProfile: 0,
          followers: 0,
          following: 0,
          createdAt: 0,
          updatedAt: 0,
          //convertedIdUser: 0
        },
      },
      {
        $unwind: {
          path: "$post",
        },
      },
      {
        $addFields: {
          convertedIdUser: {
            $toObjectId: "$post.userId",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "convertedIdUser",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ["$userData", 0],
              },
              "$$ROOT",
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          email: 0,
          isAdmin: 0,
          coverPicture: 0,
          detailprofile: 0,
          //firstName: 0,
          password: 0,
          //lastName: 0,
          detailProfile: 0,
          //followers:0,
          following: 0,
          createdAt: 0,
          updatedAt: 0,
          userData: 0,
          //convertedIdUser: 0
        },
      },
      {
        $sort: {
          "post.updatedAt": -1,
        },
      },
    ]);

    const PostsFollowersUser = await UserModelAggregate.aggregatePaginate(defPostsFollowersUser, options)

    return new ResponseClass(
      200,
      PostsFollowersUser,
      "OK"
    ).getResponseData()
  } catch (error) {
    return new ResponseClass(
      404,
      {},
      "FALLIDO"
    ).getResponseData()
  }
}


export { createPostService, getPostService, updatePostService,likePostService, getTimeLinePostsService, getPostsService, getPostsAggregatePaginate, getTimeLineUserAggregatePaginate };
