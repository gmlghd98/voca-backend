const express = require('express');
const router = express.Router({ mergeParams: true });
// mergeParams: true => 부모 라우터의 파라미터 사용 가능

const setController = require('../controllers/SetController');
const vocaRouter = require('../routes/VocaRouter');

// Root - /api/users/{userId}/set

// ---------- Voca Set ----------

// 세트 생성
// router.post('/', setController.postSet); => *세트 + 단어 생성* 으로 변경

// 사용자 전체 세트 조회
router.get('/', setController.getAllSet);

// 세트 검색
router.get('/search', setController.findSet);

// 세트 조회
router.get('/:setId', setController.getSet);

// 세트 수정
router.put('/:setId', setController.updateSet);

// 세트 삭제
router.delete('/:setId', setController.deleteSet);

// ---------- Voca ----------

// 단어 라우터 연결
router.use('/:setId/voca', vocaRouter);

// ---------- Set + Voca ----------
// 세트 + 단어 생성
router.post('/', setController.postSetVoca);

module.exports = router;
