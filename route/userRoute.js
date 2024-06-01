import express from 'express';
import * as userController from '../controller/userController.js';
import isLoggedIn from '../util/authUtil.js';

const router = express.Router();

router.get('/users/:user_id', userController.getUser);
router.get('/users/auth/check', userController.checkAuth);
router.get('/users/email/check', userController.checkEmail);
router.get('/users/nickname/check', userController.checkNickname);

router.post('/users/signup', userController.signupUser);
router.post('/users/login', userController.loginUser);
router.post('/users/logout', userController.logoutUser);

router.put('/users/:user_id', userController.updateUser);

router.patch('/users/:user_id/password', userController.changePassword);

router.delete('/users/:user_id', userController.softDeleteUser);

export default router;