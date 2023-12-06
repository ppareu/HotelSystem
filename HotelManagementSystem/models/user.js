const mysql = require("mysql2/promise");

// MySQL 연결 설정
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "000120",
  database: "hotel",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function loginUser(username, password) {
  try {
    const [rows, fields] = await db.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error(err);
    throw new Error("로그인 처리 중 오류가 발생했습니다.");
  }
}

module.exports = {
  loginUser,
};
