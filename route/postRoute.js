import express from 'express';
import * as postController from '../controller/postController.js';
import isLoggedIn from '../util/authUtil.js';

const router = express.Router();

router.get('/posts', postController.getPosts);
router.get('/posts/search', postController.getSearch);
router.get('/posts/:post_id', postController.getPost);

router.post('/posts', postController.writePost);

router.patch('/posts/like', postController.updateLike);
router.patch('/posts/:post_id', postController.updatePost);

router.delete('/posts/:post_id', postController.softDeletePost);

export default router;