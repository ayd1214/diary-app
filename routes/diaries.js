const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// 일기 작성
router.post('/', authMiddleware, async (req, res) => {
  const { title, content, is_shared } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: '제목과 내용을 입력해주세요.' });
  }

  try {
    await db.query(
      'INSERT INTO DIARY (user_id, title, content, is_shared) VALUES (?, ?, ?, ?)',
      [req.user.id, title, content, is_shared ?? false]
    );
    res.status(201).json({ message: '일기 작성 성공' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 본인이 작성한 일기 조회
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, title, is_shared, created_at FROM DIARY WHERE user_id = ?',
      [req.user.id]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 본인이 작성한 특정 일기 조회
router.get('/:id', authMiddleware, async (req, res) => {
  const diaryId = req.params.id;

  try {
    const [rows] = await db.query(
      'SELECT * FROM DIARY WHERE id = ? AND user_id = ?',
      [diaryId, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;