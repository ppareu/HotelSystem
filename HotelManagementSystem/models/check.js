// check.js
//INSERT INTO Reservation (user_id, room_number, check_in_date, check_out_date)
//VALUES
// (1, 101, '2023-12-10', NULL),
//(2, 102, '2023-12-11', NULL),
// (3, 103, '2023-12-12', NULL),
// (4, 104, '2023-12-13', NULL),
// (5, 105, '2023-12-14', NULL);

const mysql = require("mysql2/promise");

// MySQL 데이터베이스 연결 설정
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "000120", //000120
  database: "hotel",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// reservation 테이블의 모든 예약 정보를 조회하는 함수
async function fetchReservations() {
  try {
    // Reservation 테이블을 조회하면서 해당 방의 방 번호도 함께 가져오기
    const [rows, fields] = await db.query("SELECT * FROM Reservation");
    return rows;
  } catch (error) {
    console.error("예약 정보 조회 중 오류 발생:", error);
    throw error;
  }
}

// 체크아웃 처리 함수
async function checkoutReservation(reservationId) {
  try {
    // 현재 타임스탬프 가져오기
    const checkoutTimestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    // 데이터베이스 업데이트 로직 구현
    await db.query(
      "UPDATE Reservation SET check_out_date = ? WHERE reservation_id = ?",
      [checkoutTimestamp, reservationId]
    );
  } catch (error) {
    console.error("예약 체크아웃 중 오류 발생:", error);
    throw error;
  }
}

module.exports = {
  fetchReservations,
  checkoutReservation,
};
