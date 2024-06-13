import { Router } from "express";
import { createUserController, deleteUserController, followUserController, getTotalPostsUserController, getUserInfoController, loginUserController, refreshTokenController, unfollowUserController, updateDetailUserController, updateUserController } from "../controllers/auth.controller";
import { checkJwtMiddleware } from "../middleware/session";
import { updateUserValidator, loginUserValidator, registerUserValidator, paramIdValidator } from "../validators/auth.validator";

const router =  Router()

router.post('/', registerUserValidator,createUserController)

router.post('/login', loginUserValidator, loginUserController)

router.get('/refreshToken', refreshTokenController)

//Private routes

router.get('/:id', checkJwtMiddleware, getUserInfoController)
router.put('/:id', checkJwtMiddleware, updateUserValidator, updateUserController)
router.delete('/:id', checkJwtMiddleware, paramIdValidator, deleteUserController)

router.put('/detailUser/:id', checkJwtMiddleware, updateUserValidator, updateDetailUserController)

router.put('/follow/:id', checkJwtMiddleware, paramIdValidator, followUserController)

router.put('/unfollow/:id', checkJwtMiddleware, paramIdValidator, unfollowUserController)

router.get('/countPosts/:id', checkJwtMiddleware, paramIdValidator, getTotalPostsUserController)




export {
    router
}