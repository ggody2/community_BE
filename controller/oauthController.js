import mysql from 'mysql2';
import * as userModel from '../model/userModel.js';
import { validEmail, validNickname, validPassword } from '../util/validUtil.js';
import bcrypt from 'bcrypt';
import { response } from 'express';

const GOOGLE_CLIENT_ID = '1097264416833-p73fhi7bitnpuintfk3fc5u7h7eukr0t.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_REDIRECT_URI = 'http://localhost:8080/login/redirect';


export const googleLogin = (req, res) => {
    console.log("oauth컨트롤러!!");
    let url = 'https://accounts.google.com/o/oauth2/v2/auth';
    url += `?client_id=${GOOGLE_CLIENT_ID}`;
    url += `&redirect_uri=${GOOGLE_REDIRECT_URI}`;
    url += '&response_type=code';
    url += '&scope=email profile';
    res.redirect(url);
};

export const googleRedirect = async (req, res) => {
    const { code } = req.query;
    console.log(`code: ${code}`);
    
    try {
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code',
            }),
        });

        const tokenData = await tokenResponse.json();
        const { access_token } = tokenData;
        
        const userResponse = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`);
        const userData = await userResponse.json();
        console.log("userData !! ",userData);

        const requestData = {
            email: mysql.escape(userData.email),
        };
    
        const resData = await userModel.checkEmail(requestData, response);
    
        if (resData === null) {
            const reqSignupData = {
                email: mysql.escape(userData.email),
                password: mysql.escape(userData.id),
                nickname: mysql.escape(userData.name),
            };
            const resSignupData = await userModel.signUpUser(
                reqSignupData,
                response,
            );
            console.log("회원가입완료 !! ",resSignupData);
        }
    
        const requestData2 = {
            email: mysql.escape(userData.email),
            password: mysql.escape(userData.id),
        };

        const responseData = await userModel.loginUser(requestData2, response);

        if (!responseData || responseData === null)
            return response.status(401).json({
                status: 401,
                message: 'login_failed',
                data: null,
            });

        responseData.sessionId = request.sessionID;

        const requestSessionData = {
            session: mysql.escape(responseData.sessionId),
            userId: mysql.escape(responseData.userId),
        };
        await userModel.updateUserSession(requestSessionData, response);


        return response.status(400).json({
            status: 400,
            message: 'already_exist_email',
            data: null,
        });

        //res.json(userData);
    } catch (error) {
        res.status(500).send('Error during authentication');
    }
};
