const express = require('express');
const router = express.Router();
// mergeParams: true => 부모 라우터의 파라미터 사용 가능

const userController = require('../controllers/UserController');
const setRouter = require('../routes/SetRouter');

// ---------- User ----------

// 회원가입
router.post('/', userController.postUser);

// 회원정보 조회
router.get('/:userId', userController.getUser);

// 회원정보 수정
router.put('/:userId', userController.updateUser);

// 회원탈퇴
router.delete('/:userId', userController.deleteUser);

// 이메일 중복 여부 확인 - email (unique 제약조건) - TBD
// router.post('/login', userController.validateUser);

// TODO : 로그인

// ---------- Voca Set ----------

// 세트 라우터 연결
router.use('/:userId/set', setRouter);

module.exports = router;
