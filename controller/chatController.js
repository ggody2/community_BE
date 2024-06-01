import mysql from 'mysql2/promise';
import * as chatModel from '../model/chatModel.js';

export const getStatus = async(request,response) => {
    try {
        if (!request.params.user1_id || !request.params.user2_id)
            return response.status(400).json({
                status: 400,
                message: 'invalid_user_id',
                data: null,
            });
        const user1_id = request.params.user1_id;
        const user2_id = request.params.user2_id;

        const requestData = {
            user1_id: mysql.escape(user1_id),
            user2_id: mysql.escape(user2_id),
        }
        console.log("getStatus !!!! ",requestData);
        const result = await chatModel.selectStatus(requestData,response);
        return response.status(201).json({
            status: 201,
            message: 'select_status_success',
            data: result,
        });

    } catch (error) {
        console.error(error);
        return response.status(500).json({
            status: 500,
            message: 'internal_server_error',
            data: null,
        });
    }
}

export const storeChat = async(request,response) => {
    try {
        if (!request.body.room_id || !request.body.sender_id)
            return response.status(400).json({
                status: 400,
                message: 'invalid_chat_send',
                data: null,
            });

            const room_id = request.body.room_id;
            const sender_id = request.body.sender_id;
            const message_text = request.body.message_text;
    
            const requestData = {
                room_id: mysql.escape(room_id),
                sender_id: mysql.escape(sender_id),
                message_text: mysql.escape(message_text),
            }
            console.log("storeChat !!!! ",requestData);
            const result = await chatModel.insertMessage(requestData,response);
            return response.status(201).json({
                status: 201,
                message: 'insert_message_success',
                data: result,
            });
    
    }catch(error) {
        console.error(error);
        return response.status(500).json({
            status: 500,
            message: 'internal_server_error',
            data: null,
        });
    }

}

export const getChatList = async(request,response) => {
    try {
        if (!request.params.room_id)
            return response.status(400).json({
                status: 400,
                message: 'invalid_room_id',
                data: null,
            });
        const room_id = request.params.room_id;
        const requestData = {
            room_id: mysql.escape(room_id),
        }
        const result = await chatModel.selectAllChat(requestData,response);
        console.log("getChatList ::: ",result);
        return response.status(201).json({
            status: 201,
            message: 'select_AllChat_success',
            data: result,
        });
    }catch(error) {
        console.log("error:",error);
    }
}

export const insertStatus = async(request,response) => {
    console.log("request ::: ",request);
    try {
        if (!request.body.user1_id || !request.body.user2_id)
            return response.status(400).json({
                status: 400,
                message: 'invalid_user_id',
                data: null,
            });

            const user1_id = request.body.user1_id;
            const user2_id = request.body.user2_id;
    
            const requestData = {
                user1_id: mysql.escape(user1_id),
                user2_id: mysql.escape(user2_id),
            }
            console.log("insertStatus !!!! ",requestData);
            const result = await chatModel.insertChatReq(requestData,response);
            return response.status(201).json({
                status: 201,
                message: 'insert_chat_request_success',
                data: result,
            });
    }catch (error) {
        console.log("error:",error);
    }
}

export const updateStatus = async(request,response) => {
    console.log("request ::: ",request);
    try {
        if (!request.body.room_id)
            return response.status(400).json({
                status: 400,
                message: 'invalid_room_id',
                data: null,
            });

            const room_id = request.body.room_id;
    
            const requestData = {
                room_id: mysql.escape(room_id),
            }
            console.log("updateStatus !!!! ",requestData);
            const result = await chatModel.updateChatStatus(requestData,response);
            return response.status(201).json({
                status: 201,
                message: 'insert_chat_update_success',
                data: result,
            });
    }catch (error) {
        console.log("error:",error);
    }
}

export const updateDblclick = async(request,response) => {
    try {
        if (!request.body.message_id)
            return response.status(400).json({
                status: 400,
                message: 'invalid_message_id',
                data: null,
            });

            const message_id = request.body.message_id;
    
            const requestData = {
                message_id: mysql.escape(message_id),
            }
            console.log("updateDblclick !!!! ",requestData);
            const result = await chatModel.updateChatLike(requestData,response);
            return response.status(201).json({
                status: 201,
                message: 'insert_chat_like_success',
                data: result,
            });
    } catch(error) {
        console.log("error ",error);
    }
}

export const getChatRooms = async (request,response) => {
    try {
        if (!request.params.user_id)
            return response.status(400).json({
                status: 400,
                message: 'invalid_user_id',
                data: null,
            });
        const user_id = request.params.user_id;
        const requestData = {
            user_id: mysql.escape(user_id),
        }
        const result = await chatModel.selectChatRoom(requestData,response);
        console.log("getChatRooms ~~~ ",result);
        return response.status(201).json({
            status: 201,
            message: 'select_AllChatRoom_success',
            data: result,
        });
    }catch(error) {
        console.log("error:",error);
    }

}