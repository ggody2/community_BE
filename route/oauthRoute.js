import express from 'express';
import * as oauthController from '../controller/oauthController.js';
import isLoggedIn from '../util/authUtil.js';

const router = express.Router();

router.get('/login', oauthController.googleLogin);
router.get('/login/redirect', oauthController.googleRedirect);

export default router;