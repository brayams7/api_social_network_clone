import { Router } from "express";
import { createPostController, getPostController, getTimeLineUserAggregatePaginateController, likePostController, listPostController, listPostsAllController, listPostsPaginationController, updatePostController } from "../controllers/posts.controlle";
import { checkJwtMiddleware } from "../middleware/session";
import { likedPostValidator, registerPostValidator } from "../validators/post.validator";

const router =  Router()

router.get('/',checkJwtMiddleware, listPostsAllController)
router.get('/postPagination',checkJwtMiddleware,listPostsPaginationController)
router.post('/',checkJwtMiddleware,registerPostValidator, createPostController)
router.get('/:id',checkJwtMiddleware, getPostController)
router.put('/:id',checkJwtMiddleware,registerPostValidator, updatePostController)
router.put('/liked/:idPost',checkJwtMiddleware,likedPostValidator, likePostController)
router.get('/timeLine/:idUser',checkJwtMiddleware,listPostController)
router.get('/timeLine/v1/:idUser',checkJwtMiddleware, getTimeLineUserAggregatePaginateController)


export {
    router
}