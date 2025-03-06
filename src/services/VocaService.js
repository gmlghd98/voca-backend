const pool = require('../models/DB_Pool');

// 전체 단어 조회
exports.getAll = async (setId) => {
    const sql = `select * from voca where set_id=?`;

    try {
        const [result] = await pool.query(sql, [setId]);
        return result;
    } catch (err) {
        console.error('Error: ' + err);
        throw new Error('DB 연결 실패: ' + err.message);
    }
};

// 단어 조회
exports.get = async (vocaId) => {
    const sql = `select * from voca where voca_id=?`;

    try {
        const [result] = await pool.query(sql, [vocaId]);
        return result;
    } catch (err) {
        console.error('Error: ' + err);
        throw new Error('DB 연결 실패: ' + err.message);
    }
};

// 단어 검색
exports.find = async (setId, keyword) => {
    const sql = `
      select * from voca 
      where set_id=? and set_name like '%?%'
    `;

    try {
        const [result] = await pool.query(sql, [setId, keyword]);
        return result;
    } catch (err) {
        console.error('Error: ' + err);
        throw new Error('DB 연결 실패: ' + err.message);
    }
};

// 단어 생성
exports.post = async (setId, word, meaning) => {
    const vocaData = [setId, word, meaning];
    const sql = `
      insert into voca(set_id, word, meaning)
      value(?, ?, ?)
    `;

    try {
        const [result] = await pool.query(sql, vocaData);
        return result;
    } catch (err) {
        console.error('Error: ' + err);
        throw new Error('DB 연결 실패: ' + err.message);
    }
};

// 단어 수정
exports.update = async (vocaId, word, meaning) => {
    const setData = [word, meaning, vocaId];
    const sql = `
    update voca
    set word = ?, meaning = ? 
    where voca_id = ?
  `;

    try {
        const [result] = await pool.query(sql, setData);
        return result;
    } catch (err) {
        console.error('Error: ' + err);
        throw new Error('DB 연결 실패: ' + err.message);
    }
};

// 단어 삭제
exports.delete = async (vocaId) => {
    const sql = `delete from voca where voca_id=? `;

    try {
        const [result] = await pool.query(sql, [vocaId]);
        return result;
    } catch (err) {
        console.error('Error: ' + err);
        throw new Error('DB 연결 실패: ' + err.message);
    }
};
