const pool = require('../models/DB_Pool');
const vocaService = require('../services/VocaService');

// 세트 조회
exports.get = async (setId) => {
    const sql = `select * from voca_set where set_id=?`;

    try {
        const [result] = await pool.query(sql, [setId]);
        return result;
    } catch (err) {
        console.error('Error: ' + err);
        throw new Error('DB 연결 실패: ' + err.message);
    }
};

// 세트 생성
exports.post = async (userId, set_name, description) => {
    const setData = [userId, set_name, description];
    const sql = `
      insert into voca_set(user_id, set_name, description)
      value(?, ?, ?)
    `;

    try {
        const [result] = await pool.query(sql, setData);
        return result;
    } catch (err) {
        console.error('Error: ' + err);
        throw new Error('DB 연결 실패: ' + err.message);
    }
};

// 세트 수정
exports.update = async (setId, set_name, description) => {
    const setData = [set_name, description, setId];
    const sql = `
    update voca_set
    set set_name = ?, description = ? 
    where set_id = ?
  `;

    try {
        const [result] = await pool.query(sql, setData);
        return result;
    } catch (err) {
        console.error('Error: ' + err);
        throw new Error('DB 연결 실패: ' + err.message);
    }
};

// 세트 삭제
exports.delete = async (setId) => {
    const sql = `delete from voca_set where set_id=? `;

    try {
        const [result] = await pool.query(sql, [setId]);
        return result;
    } catch (err) {
        console.error('Error: ' + err);
        throw new Error('DB 연결 실패: ' + err.message);
    }
};

// ---------------------------------------------------------
// 세트 + 단어 생성
exports.postSetVoca = async (userId, set, voca) => {
    const connection = await pool.getConnection(); // 연결 생성

    try {
        await connection.beginTransaction(); // 트랜잭션 시작

        // 세트 생성
        const setSql = 'insert into voca_set (user_id, set_name, description) values (?, ?, ?)';
        const setData = [userId, set.set_name, set.description];
        const [setResult] = await connection.query(setSql, setData);

        if (setResult.affectedRows <= 0) {
            throw new Error('세트 생성에 실패했습니다');
        }

        const setId = setResult.insertId;

        // 단어 생성
        const vocaSql = 'insert into voca (set_id, word, meaning) values (?, ?, ?)';
        for (const v of voca) {
            const vocaData = [setId, v.word, v.meaning];
            const [vocaResult] = await connection.query(vocaSql, vocaData);

            if (vocaResult.affectedRows <= 0) {
                throw new Error('단어 생성에 실패했습니다');
            }
        }

        await connection.commit(); // 트랜잭션 종료, 커밋 (성공)
        return true;
    } catch (err) {
        await connection.rollback(); // 트랜잭션 종료, 롤백 (실패)
        connection.release();
        throw err;
    } finally {
        connection.release();
    }
};
