import express from 'express';
import session from 'express-session';
import cors from 'cors';
import * as dbConnect from './database/index.js';
import { Server } from 'socket.io';
import route from './route/index.js';
import http from 'http';

const app = express();
const port = 8080;

app.use(cors('*'));
app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret: 'startupcode!adapterz@', // secret key
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, // https에서만 동작하게 하려면 true로 변경,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    }),
);

// Routes
app.use('/', route);

// 404 응답
app.use((request, response, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// 서버 에러 500 응답
app.use((error, request, response, next) => {
    response.status(error.status || 500);
    response.send({
        error: {
            message: error.message,
        },
    });
});

// HTTP 서버 생성
const server = http.createServer(app);

// Socket.io 서버 설정
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('a user connected!!');

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room!: ${roomId}`);
    });
    socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId);
        console.log(`User left room: ${roomId}`);
    });
    socket.on('chatMessage', (data) => {
        const { roomId, message,senderId } = data;
        io.to(roomId).emit('chatMessage', { message, timestamp: new Date(),senderId });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// 서버 시작하면 전체 유저 데이터 session_id NULL로 초기화
const initSessionId = async (res, req) => {
    const sql = 'UPDATE user_table SET session_id = NULL;';
    await dbConnect.query(sql, res, req);
};

initSessionId();
