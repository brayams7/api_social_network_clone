import { Router } from "express";
import multer from "multer";
import {dirname, join, extname} from 'path'
import {fileURLToPath} from 'url'
import { checkJwtMiddleware } from "../middleware/session";
import { uploadController } from "../controllers/upload.controller";
import {storageFirebase} from '../firebase/config'
import {getStorage, uploadBytes, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'

const router =  Router()

const MYMETYPES = ["image/jpeg","image/png"]

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//         console.log(req.body)
//         const fileExtencion = extname(file.originalname)
//         const fileName = file.originalname.split(fileExtencion)[0]
//         const datetime = Date.now()
//         cb(null, fileName + '-' + datetime+fileExtencion)
//     }
//   })
//   const upload = multer({
//     fileFilter(req, file, callback) {
//         if(MYMETYPES.includes(file.mimetype)) callback(null, true)
//         else callback(new Error(`Only ${MYMETYPES.join()}`))
//     }, 
//     storage: storage 
// })

// router.post('/', upload.single('file'),(req, res, next) => {
//     const file = req.file
//     // if (!file) {
//     //   const error = new Error('Please upload a file')
//     //   error.httpStatusCode = 400
//     //   return next(error)
//     // }
//     //   res.send(file)
//    return res.json({
//     ok:"OK"
//    })
//   })


const upload = multer({
    fileFilter(_req, file, callback) {
        if(MYMETYPES.includes(file.mimetype)) callback(null, true)
        else callback(new Error(`Only ${MYMETYPES.join()}`))
    }, 
    storage: multer.memoryStorage()
})

router.post('/firebase', upload.single("filename"), uploadController)

export {
    router
}
