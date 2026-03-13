const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

// 회원가입
router.post('/signup', async (req, res) => {
  const { email, password, nickname } = req.body;

  // 필수 값 체크
  if (!email || !password || !nickname) {
    return res.status(400).json({ message: '이메일, 비밀번호, 닉네임을 모두 입력해주세요.' });
  }

  try {
    // 이메일 중복 체크
    const [existing] = await db.query('SELECT id FROM USER WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: '이미 사용 중인 이메일입니다.' });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // DB에 저장
    await db.query(
      'INSERT INTO USER (email, password, nickname) VALUES (?, ?, ?)',
      [email, hashedPassword, nickname]
    );

    res.status(200).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
  }

  try {
    // 이메일로 유저 찾기
    const [rows] = await db.query('SELECT * FROM USER WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 틀렸습니다.' });
    }

    const user = rows[0];

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 틀렸습니다.' });
    }

    // JWT 토큰 발급
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;