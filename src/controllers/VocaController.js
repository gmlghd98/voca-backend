const vocaService = require('../services/VocaService');
const { response } = require('../utils/format');

// 전체 단어 조회
exports.getAllVoca = async (req, res) => {
    const { setId } = req.params;

    try {
        const result = await vocaService.getAll(setId);

        if (result.length > 0) {
            res.json(response('success', `${setId}번 세트의 단어를 조회합니다`, result));
        } else {
            res.status(404).json(response('fail', `${setId}번 세트에 단어가 없습니다`));
        }
    } catch (err) {
        res.status(500).json(response('fail', err.message));
    }
};

// 단어 조회
exports.getVoca = async (req, res) => {
    const { vocaId } = req.params;

    try {
        const result = await vocaService.get(vocaId);

        if (result.length > 0) {
            res.json(response('success', `${vocaId}번 단어를 조회합니다`, result[0]));
        } else {
            res.status(404).json(response('fail', `${vocaId}번 단어는 없습니다`));
        }
    } catch (err) {
        res.status(500).json(response('fail', err.message));
    }
};

// 단어 생성
exports.postVoca = async (req, res) => {
    const { setId } = req.params;
    const { word, meaning } = req.body;

    if (!word || !meaning) {
        return res.status(400).json(response('fail', '내용을 입력하세요'));
    }

    try {
        const result = await vocaService.post(setId, word, meaning);

        if (result.affectedRows > 0) {
            res.json(response('success', '단어 생성에 성공했습니다', req.body));
        } else {
            res.status(500).json(response('fail', `단어 생성에 실패했습니다`));
        }
    } catch (err) {
        res.status(500).json(response('fail', err.message));
    }
};

// 단어 수정
exports.updateVoca = async (req, res) => {
    const { vocaId } = req.params;
    const { word, meaning } = req.body;

    if (!word || !meaning) {
        return res.status(400).json(response('fail', '빈 내용은 입력할 수 없습니다'));
    }

    try {
        const result = await vocaService.update(vocaId, word, meaning);

        if (result.affectedRows > 0) {
            res.json(response('success', `${vocaId}번 단어 수정에 성공했습니다`, req.body));
        } else {
            res.status(500).json(response('fail', `${vocaId}번 단어 수정에 실패했습니다`));
        }
    } catch (err) {
        res.status(500).json(response('fail', err.message));
    }
};

// 단어 삭제
exports.deleteVoca = async (req, res) => {
    const { vocaId } = req.params;

    try {
        const result = await vocaService.delete(vocaId);

        if (result.affectedRows > 0) {
            res.json(response('success', `${vocaId}번 단어 삭제에 성공했습니다`));
        } else {
            res.status(500).json(response('fail', `단어 삭제에 실패했습니다`));
        }
    } catch (err) {
        res.status(500).json(response('fail', err.message));
    }
};
