const setService = require('../services/SetService');
const setAndVocaService = require('../services/SetAndVocaService');
const { response } = require('../utils/format');

// 사용자 세트 전체 조회
exports.getAllSet = async (req, res) => {
    const { userId } = req.params;

    // 유효성 검사
    console.log('GET 요청 확인: userId =', userId); // ✅ userId가 정상적으로 전달되는지 확인
    if (!userId) {
        return res.status(400).json(response('fail', 'userId가 필요합니다.'));
    }

    try {
        const result = await setService.getAll(userId);

        if (result.length > 0) {
            res.json(response('success', `${userId}번 사용자의 세트를 조회합니다`, result));
        } else {
            res.status(404).json(response('fail', `${userId}번 사용자의 세트는 없습니다`));
        }
    } catch (err) {
        console.error('단어 세트 조회 오류:', err);
        res.status(500).json(response('fail', err.message));
    }
};

// 세트 조회
exports.getSet = async (req, res) => {
    const { setId } = req.params;

    try {
        const result = await setService.get(setId);

        if (result.length > 0) {
            res.json(response('success', `${setId}번 세트를 조회합니다`, result));
        } else {
            res.status(404).json(response('fail', `${setId}번 세트는 없습니다`));
        }
    } catch (err) {
        res.status(500).json(response('fail', err.message));
    }
};

// 세트 검색
exports.findSet = async (req, res) => {
    const { userId, keyword } = req.params;

    try {
        const result = await setService.find(userId, keyword);

        if (result.length > 0) {
            res.json(response('success', `${keyword} 검색 결과입니다`, result));
        } else {
            res.status(404).json(response('fail', `${keyword} 검색 결과는 없습니다`));
        }
    } catch (err) {
        res.status(500).json(response('fail', err.message));
    }
};

// 세트 생성
exports.postSet = async (req, res) => {
    const { userId } = req.params;
    const { set_name, description } = req.body;

    if (!set_name || !description) {
        return res.status(400).json(response('fail', '내용을 입력하세요'));
    }

    try {
        const result = await setService.post(userId, set_name, description);

        if (result.affectedRows > 0) {
            res.json(response('success', '세트 생성에 성공했습니다', req.body));
        } else {
            res.status(500).json(response('fail', `세트 생성에 실패했습니다`));
        }
    } catch (err) {
        res.status(500).json(response('fail', err.message));
    }
};

// 세트 수정
exports.updateSet = async (req, res) => {
    const { setId } = req.params;
    const { set_name, description } = req.body;

    if (!set_name || !description) {
        return res.status(400).json(response('fail', '빈 내용은 입력할 수 없습니다'));
    }

    try {
        const result = await setService.update(setId, set_name, description);

        if (result.affectedRows > 0) {
            res.json(response('success', `${setId}번 세트 수정에 성공했습니다`, req.body));
        } else {
            res.status(500).json(response('fail', `${setId}번 세트 수정에 실패했습니다`));
        }
    } catch (err) {
        res.status(500).json(response('fail', err.message));
    }
};

// 세트 삭제
exports.deleteSet = async (req, res) => {
    const { setId } = req.params;

    try {
        const result = await setService.delete(setId);

        if (result.affectedRows > 0) {
            res.json(response('success', `${setId}번 세트 삭제에 성공했습니다`));
        } else {
            res.status(500).json(response('fail', `세트 삭제에 실패했습니다`));
        }
    } catch (err) {
        res.status(500).json(response('fail', err.message));
    }
};

// --------------------------------------------
// 세트 + 단어 생성
exports.postSetVoca = async (req, res) => {
    const { userId } = req.params;
    // const { set, voca } = req.body;
    const { set_name, description, words: voca } = req.body;

    // 유효성 검사
    // if(!set || !voca || voca.length == 0)
    if (!set_name || !description || !voca || voca.length == 0) {
        return res.status(400).json(response('fail', '내용을 입력하세요'));
    }

    const set = { set_name, description };

    try {
        const result = await setAndVocaService.post(userId, set, voca);
        if (result) {
            res.status(200).json(response('success', '세트와 단어 생성에 성공했습니다'));
        } else {
            res.status(500).json(response('fail', '세트와 단어 생성에 실패했습니다'));
        }
    } catch (err) {
        res.status(500).json(response('fail', err.message));
    }
};
