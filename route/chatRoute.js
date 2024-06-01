import express from 'express';
import * as chatController from '../controller/chatController.js';
import * as userController from '../controller/userController.js';
import isLoggedIn from '../util/authUtil.js';

const router = express.Router();

router.get('/chat/status/:user1_id/:user2_id', chatController.getStatus);
router.get('/chat/:room_id', chatController.getChatList);
router.get('/chat/list/:user_id', chatController.getChatRooms);

router.post('/chat', chatController.storeChat);
router.post('/chat/request', chatController.insertStatus);

router.patch('/chat/approve',chatController.updateStatus);
router.patch('/chat/dblclick',chatController.updateDblclick);

export default router;