import { PreViewProfileInterface } from "../auth.interface";

export interface PostInterface{
    userId:string,
    desc:string,
    likes: PreViewProfileInterface[],
    image:string,
    createdAt: Date,
    updateAt:Date
}

export interface PostCreateInterface{
    userId:string,
    desc:string,
    likes: PreViewProfileInterface[],
    image:string
}


export interface UpdatePostInterface{
    userId:string,
    desc:string,
    image:string
}

//post user timeline

export interface PostInterfaceTimeLine{
    userId:string,
    desc:string,
    likes: PreViewProfileInterface[],
    image:string,
    createdAt: Date,
    updateAt:Date
    firstName: string,
    lastName: string,
    username: string,
    profilePicture: string,
    followers: string[]
}
