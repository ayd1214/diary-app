const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// 공유된 일기 목록 조회
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT DIARY.id, DIARY.title, DIARY.content, DIARY.created_at, USER.email 
       FROM DIARY 
       JOIN USER ON DIARY.user_id = USER.id 
       WHERE DIARY.is_shared = true`
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 공유된 특정 일기 조회
router.get('/:id', authMiddleware, async (req, res) => {
  const diaryId = req.params.id;

  try {
    const [rows] = await db.query(
      `SELECT DIARY.*, USER.email 
       FROM DIARY 
       JOIN USER ON DIARY.user_id = USER.id 
       WHERE DIARY.id = ? AND DIARY.is_shared = true`,
      [diaryId]
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