const pool = require('../models/DB_Pool');
const { response } = require('../utils/format');

// 퀴즈 단어 추출
exports.getQuizVoca = async (req, res) => {
    const { setId } = req.params;
    const quantity = 10; // 갯수 고정

    console.log('퀴즈 진입 성공 ---------');

    // const { quantity } = req.query;
    // if (!quantity) {
    //     return res.status(400).json(response('fail', '갯수를 입력하세요'));
    // }

    const quizData = [setId, quantity];
    const sql = 'select voca_id, word, meaning from voca where set_id = ? order by RAND() limit ?';

    try {
        const [result] = await pool.query(sql, quizData); // []

        if (result.length > 0) {
            res.json(response('success', `${setId}번 세트의 퀴즈를 생성했습니다`, result));
        } else {
            res.status(204).json(response('fail', `단어가 없습니다`));
        }
    } catch (err) {
        console.error('Error: ' + err);
        res.status(500).json(response('fail', 'DB 연결 실패: ' + err.message));
    }
};
