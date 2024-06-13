
export interface Auth{
    username:string,
    password:string
}

export interface RegisterUser extends Auth{
    firstName:string,
    lastName:string,
    email?:string
}

export interface User extends Auth{
    email:string
    firstName:string,
    lastName:string,
    // contact:Contact,
    isAdmin:boolean,
    profilePicture?: String,
    coverPicture?: String,
    detailProfile:DetailProfile,
    followers:[],
    following:[],
    createdAt: Date,
    updateAt:Date
}

export interface Contact{
    phone:String,
    email?:String | undefined | null
}

export interface DetailProfile{
    about:string,
    livesIn:string,
    workAt?: WorkAt[],
    relationShip:string
}

export interface WorkAt{
    workIn:string
}

/*
    intefaces de usuario para el uso genérico
*/

export interface PreViewProfileInterface{
    idUser:string,
    username:string
    profilePicture?: String,
    followers:[],
    following:[]
}