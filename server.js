const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// 환경변수
const port = process.env.PORT;
const host = process.env.HOST;

// 라우터
const userRouter = require('./src/routes/UserRouter');

const app = express();

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// 라우터 연결
app.use('/api/users', userRouter);

// 루트 경로
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// 서버 시작
app.listen(port, () => {
    console.log('Server Connected: http://' + host + ':' + port);
});
