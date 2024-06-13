import { Response } from "express"
import { RequestExtend } from "../interfaces/request/requestExtended.interface"
import {dirname, join, extname} from 'path'
import {storageFirebase} from '../firebase/config'
import {getStorage, uploadBytes, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'

const uploadController = async (req:RequestExtend, res:Response) => {
    try {
    
        const file = req.file
        if(!file || !req.file?.buffer)
          return res.json({
            message:"FALLIDO",
            error:true,
            data:null,
            code:404
          }).status(404)
    
        const fileExtencion = extname(file.originalname)
        const fileName = file.originalname.split(fileExtencion)[0]
        const datetime = Date.now()
    
        const buffer = req.file?.buffer
    
        const storageRef = ref(storageFirebase, `posts/${fileName +"-"+datetime + fileExtencion}`);
        
        const metadata = {
            contentType: req.file?.mimetype,
        };
        
        
        const snapshot = await uploadBytesResumable(storageRef,buffer, metadata);
        
        const downloadURL = await getDownloadURL(snapshot.ref);
    
        return res.json({
            message: 'OK',
            error:false,
            code:200,
            data: {
              name: req.file.originalname,
              type: req.file.mimetype,
              url:downloadURL
            }
        }).status(200)
        
    } catch (error:any) {
        return res.status(404).json({
            message:error.message || "Ocurrió un error",
            error:true,
            data:null,
            code:404
        })
    }
    
}

export{
    uploadController
}