import { response } from 'express';
import * as dbConnect from '../database/index.js';

export const selectStatus = async (requestData, response) => {
    const { user1_id, user2_id } = requestData;

    const sql = `
    SELECT room_id, status, user1_id, user2_id
    FROM chat_room
    WHERE (user1_id IN (${user1_id}, ${user2_id}) AND user2_id IN (${user1_id}, ${user2_id}))
    AND user1_id <> user2_id;
    `;
    const results = await dbConnect.query(sql, response);

    if (!results || results.length === 0) return null;
    return results;
};

export const insertMessage = async (requestData, response) => {
    const { room_id, sender_id,message_text } = requestData;

    const sql = `
    INSERT INTO chat_message (room_id, sender_id, message_text) 
    VALUES (${room_id},${sender_id},${message_text});
    `;
    const results = await dbConnect.query(sql, response);

    if (!results || results.length === 0) return null;
    return results;
};

export const selectAllChat = async (requestData, response) => {
    const { room_id } = requestData;

    const sql = `
    SELECT *
    FROM chat_message
    WHERE room_id = ${room_id}
    `;
    const results = await dbConnect.query(sql, response);
    console.log("model select : ",results);
    if (!results || results.length === 0) return null;
    return results;
};

export const insertChatReq = async(requestData, response) => {
    const {user1_id,user2_id} = requestData;

    const sql = `
    INSERT INTO chat_room (user1_id,user2_id,status) 
    VALUES (${user1_id},${user2_id},'request');
    `;
    const results = await dbConnect.query(sql, response);

    if (!results || results.length === 0) return null;
    return results;
}

export const updateChatStatus = async(requestData, response) => {
    const {room_id} = requestData;

    const sql = `
    UPDATE chat_room
    SET status = 'accepted', room_created_at = NOW()
    WHERE room_id = ${room_id};
    `;
    const results = await dbConnect.query(sql, response);
    if (!results) return null;

    return results;
}

export const updateChatLike = async(requestData, response) => {
    const {message_id} = requestData;

    const sql = `
    UPDATE chat_message
    SET chat_like = !chat_like
    WHERE message_id = ${message_id};
    `;
    const results = await dbConnect.query(sql, response);
    if (!results) return null;

    return results;
}

export const selectChatRoom = async(requestData, response) => {
    const {user_id} = requestData;

    const sql = `
    SELECT 
        cr.room_id,
        cm.message_text,
        cm.sent_at,
        cm.isRead,
        ut.nickname,
        ut.file_id,
        ut.user_id,
        COALESCE(ft.file_path, '/public/image/profile/default.jpg') AS profileImagePath
    FROM 
        chat_room cr
        LEFT JOIN 
            (
                SELECT 
                    room_id, 
                    message_text, 
                    sent_at, 
                    isRead
                FROM 
                    chat_message
                WHERE 
                    message_id IN (
                        SELECT 
                            MAX(message_id)
                        FROM 
                            chat_message
                        GROUP BY 
                            room_id
                    )
            ) cm ON cr.room_id = cm.room_id
        LEFT JOIN 
            user_table ut ON ut.user_id = 
                CASE 
                    WHEN cr.user1_id = ${user_id} THEN cr.user2_id 
                    WHEN cr.user2_id = ${user_id} THEN cr.user1_id 
                END
        LEFT JOIN
            file_table ft ON ut.file_id = ft.file_id
    WHERE 
        cr.status = 'accepted' 
        AND (cr.user1_id = ${user_id} OR cr.user2_id = ${user_id})
    ORDER BY 
        cm.sent_at DESC;
    `;

    const results = await dbConnect.query(sql, response);
    if (!results) return null;

    return results;
}