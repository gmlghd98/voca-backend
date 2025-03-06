const vocaService = require('../services/VocaService');
const { response } = require('../utils/format');

// 전체 단어 조회
exports.getAllVoca = async (req, res) => {
    const { setId } = req.params;

    // 유효성 검사
    console.log('GET 요청 확인: setId =', setId); // ✅ setId가 정상적으로 전달되는지 확인
    if (!setId) {
        return res.status(400).json(response('fail', 'setId가 필요합니다.'));
    }

    try {
        const result = await vocaService.getAll(setId);
        console.log('단어 목록 응답:', result); // ✅ 데이터 확인 로그 추가

        if (result.length > 0) {
            res.json(response('success', `${setId}번 세트의 단어를 조회합니다`, result));
        } else {
            res.status(404).json(response('fail', `${setId}번 세트에 단어가 없습니다`));
        }
    } catch (err) {
        console.error('단어 조회 오류:', err);
        res.status(500).json(response('fail', err.message));
    }
};

// 단어 조회
exports.getVoca = async (req, res) => {
    const { vocaId } = req.params;

    try {
        const result = await vocaService.get(vocaId);

        if (result.length > 0) {
            res.json(response('success', `${vocaId}번 단어를 조회합니다`, result));
        } else {
            res.status(404).json(response('fail', `${vocaId}번 단어는 없습니다`));
        }
    } catch (err) {
        res.status(500).json(response('fail', err.message));
    }
};

// 단어 검색
exports.findVoca = async (req, res) => {
    const { setId, keyword } = req.params;

    try {
        const result = await vocaService.find(setId, keyword);

        if (result.length > 0) {
            res.json(response('success', `${keyword} 검색 결과입니다`, result));
        } else {
            res.status(404).json(response('fail', `${keyword} 검색 결과는 없습니다`));
        }
    } catch (err) {
        res.status(500).json(response('fail', err.message));
    }
};

// 단어 생성
exports.postVoca = async (req, res) => {
    const { setId } = req.params;
    const { word, meaning } = req.body;

    console.log('📌 받은 요청 데이터:', req.body); // ✅ 요청 데이터가 정확한지 확인
    console.log('📌 setId 확인:', setId); // ✅ setId가 올바르게 들어오는지 확인

    if (!word || !meaning) {
        return res.status(400).json(response('fail', '내용을 입력하세요'));
    }

    try {
        const result = await vocaService.post(setId, word, meaning);

        if (result.affectedRows > 0) {
            res.json(response('success', '단어 생성에 성공했습니다', { voca_id: result.insertId }));
        } else {
            res.status(500).json(response('fail', `단어 생성에 실패했습니다`));
        }
    } catch (err) {
        res.status(500).json(response('fail', err.message));
    }
};

// 단어 수정
exports.updateVoca = async (req, res) => {
    console.log('📌 [백엔드] 단어 수정 요청 도착:', req.params); // 요청 도착 여부 확인

    const { vocaId } = req.params;
    const { word, meaning } = req.body;

    console.log('📌 [백엔드] 요청 데이터:', { word, meaning }); // 실제 요청 데이터 출력

    if (!word || !meaning) {
        return res.status(400).json(response('fail', '빈 내용은 입력할 수 없습니다'));
    }

    try {
        const result = await vocaService.update(vocaId, word, meaning);
        console.log('📌 [백엔드] SQL 실행 결과:', result); // SQL 실행 결과 확인

        if (result.affectedRows > 0) {
            res.json(response('success', `${vocaId}번 단어 수정에 성공했습니다`, req.body));
        } else {
            res.status(500).json(response('fail', `${vocaId}번 단어 수정에 실패했습니다`));
        }
    } catch (err) {
        console.error('📌 [백엔드] SQL 실행 오류:', err);
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
        console.error('Error:', err);
        res.status(500).json(response('fail', err.message));
    }
};
