const pool = require('../models/DB_Pool');
const setService = require('../services/SetService');
const vocaService = require('../services/VocaService');

// 세트 + 단어 생성
exports.post = async (userId, set, voca) => {
    const connection = await pool.getConnection(); // 연결 생성
    const { set_name: setName, description } = set;

    try {
        await connection.beginTransaction(); // 트랜잭션 시작

        // 세트 생성
        const setResult = await setService.post(userId, setName, description);
        if (setResult.affectedRows <= 0) throw new Error('세트 생성에 실패했습니다');

        const setId = setResult.insertId; // 생성된 세트 id 추출

        // 단어 생성
        const word = null,
            meaning = null;
        for (const v of voca) {
            (word = v.word), (meaning = v.meaning);
            const vocaResult = await vocaService.post(setId, word, meaning);
            if (vocaResult.affectedRows <= 0) throw new Error('단어 생성에 실패했습니다');
        }

        await connection.commit(); // 트랜잭션 종료, 커밋 (성공)
        return true;
    } catch (err) {
        await connection.rollback(); // 트랜잭션 종료, 롤백 (실패)
        throw err;
    } finally {
        connection.release();
    }
};
