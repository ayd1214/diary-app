const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const authRouter = require('./routes/auth');
const diariesRouter = require('./routes/diaries');
const sharedRouter = require('./routes/shared');

app.use('/auth', authRouter);
app.use('/diaries', diariesRouter);
app.use('/shared', sharedRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});