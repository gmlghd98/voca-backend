const setService = require('../services/SetService');
const vocaService = require('../services/VocaService');
const { response } = require('../utils/format');

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

// 세트 + 단어 생성
exports.postSetVoca = async (req, res) => {
    const { userId } = req.params;
    const { set, voca } = req.body;

    if (!set || !voca) {
        return res.status(400).json(response('fail', '내용을 입력하세요'));
    }

    const { set_name, description } = set;
    const word = null,
        meaning = null,
        vocaResult = null;

    // TODO : Transaction으로 감싸기
    try {
        const setResult = await setService.post(userId, set_name, description);
        if (setResult.affectedRows <= 0) throw Error('세트 생성에 실패했습니다');

        voca.forEach(async (v) => {
            (word = v.word), (meaning = v.meaning);
            vocaResult = await vocaService.post(_, word, meaning);
            if (vocaResult.affectedRows <= 0) throw Error('단어 생성에 실패했습니다');
        });

        // 여기까지 오면 성공 (commit 처리)

        // TODO : response 객체 생성
        res.status(200).json(response('success', '세트와 단어 생성에 성공했습니다'));
    } catch (err) {
        res.status(500).json(response('fail', err.message));
    }
};
