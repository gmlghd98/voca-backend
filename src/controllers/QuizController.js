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

// 퀴즈 채점
exports.submitQuiz = async (req, res) => {
    const { setId } = req.params;
    const { answers } = req.body; // 사용자가 입력한 답안들 [{ voca_id, user_answer }, ...]

    if (!setId) {
        return res.status(400).json(response('fail', 'setId가 필요합니다.'));
    }

    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json(response('fail', '유효한 답안 배열을 제공해야 합니다.'));
    }

    try {
        // 정답 가져오기
        const vocaIds = answers.map((ans) => ans.voca_id);
        const sql = `SELECT voca_id, meaning FROM voca WHERE set_id = ? AND voca_id IN (?)`;
        const [correctAnswers] = await pool.query(sql, [setId, vocaIds]);

        let score = 0;
        let results = [];

        // 채점
        answers.forEach((userAnswer) => {
            const correct = correctAnswers.find((ca) => ca.voca_id === userAnswer.voca_id);
            if (correct) {
                const isCorrect = correct.meaning.trim().toLowerCase() === userAnswer.user_answer.trim().toLowerCase();
                if (isCorrect) score += 1;
                results.push({
                    voca_id: userAnswer.voca_id,
                    user_answer: userAnswer.user_answer,
                    correct_answer: correct.meaning,
                    is_correct: isCorrect,
                });
            }
        });

        res.json(response('success', '퀴즈 채점 완료', { score, total: answers.length, results }));
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json(response('fail', '퀴즈 채점 실패: ' + err.message));
    }
};
