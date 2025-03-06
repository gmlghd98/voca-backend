const pool = require('../models/DB_Pool');

// 사용자 세트 전체 조회
exports.getAll = async (userId) => {
    const sql = `selct * from voca_set where user_id=?`;

    try {
        const [result] = await pool.query(sql, [userId]);
        return result;
    } catch (err) {
        console.log('Error: ' + err);
        throw new Error('DB 연결 실패: ' + err.message);
    }
};

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

// 세트 검색
exports.find = async (userId, keyword) => {
    const sql = `
        select * from voca_set 
        where user_id=? and set_name like '%?%'
      `;

    try {
        const [result] = await pool.query(sql, [userId, keyword]);
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
