import {Router} from 'express'
import {readdirSync} from 'fs'
import { fileNameAndRouterMainNameInterface } from '../interfaces/router.interface'

const PATH_ROUTER = `${__dirname}`
const INDEX = 'index'
const router = Router()

const cleanFileName = (fileName:string) : fileNameAndRouterMainNameInterface =>{
    const name = fileName.split('.').shift()

    const list = fileName.split('.')
    list.pop()
    return {
        fileName:name,
        routerMainName:list.join('.')
    }
}

const listDir = readdirSync(PATH_ROUTER)

listDir.filter((fileName:string) : void => {
    const objectCleanName = cleanFileName(fileName)
    if(
        Object.entries(objectCleanName).length > 0 && 
        typeof objectCleanName.fileName === 'string' &&
        objectCleanName.fileName !== INDEX 
        ){
        
        import(`./${objectCleanName.routerMainName}`)
        .then((moduleRoute)=>{
            console.log({route:`/${objectCleanName.fileName}`})
            router.use(`/${objectCleanName.fileName}`, moduleRoute.router)
        })
    }
})

export {
    router
}


