const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

// 로그인 라우트 추가
router.post('/login', authController.login);

//클라이언트에서 jwt삭제되면서 로그아웃수행
router.post('/logout', (_, res) => {
    res.json(response('success', '로그아웃 되었습니다.'));
});

module.exports = router;
