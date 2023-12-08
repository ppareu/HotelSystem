/**
 *
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 *    [프로젝트 명] : 호텔 관리 시스템
 *    [제작자] : 박현빈[팀장], 김현우, 김동욱, 김승준
 *    [제작일] : 2023. 12. 07
 *    [제품 문의] : bin000120@sillain.ac.kr
 *    [제작 파트]
 *    박현빈 : 서버구성 및 음식 주문 시스템 개발
 *    김현우 : 예약 시스템 개발
 *    김동욱 : 로그인 시스템 개발
 *    김승준 : 체크인 체크아웃 시스템 개발
 *
 *    제품 설명 : 위 제품은 호텔 관리 시스템 입니다.
 *    고객 로그인 : user 비밀번호 : 1111
 *    관리자 로그인 : admin 비밀번호 : admin
 *    위 계정으로 로그인하면 고객으로 로그인 할 시 호텔을 예약하기 위한
 *    예약하기 버튼과 음식을 주문하기 위해 주문하기 시스템이 있습니다.
 *    관리자로 로그인하면 고객이 주문한 음식 주문 리스트, 고객의 체크인 체크아웃을
 *    돕기 위해 체크인 체크아웃 시스템 버튼이 있습니다.
 *
 *    DB는 MYSQL을 사용했으며 고객의 기록 및 정보를 DB에 저장해서 기록을 관리자 시스템쪽으로 보냅니다.
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 *
 */
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { loginUser } = require("./models/user");
const { fetchReservations, checkoutReservation } = require("./models/check");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // 데이터베이스 사용자명
  password: "000120", // 데이터베이스 비밀번호
  database: "hotel", // 데이터베이스명
});

db.connect((err) => {
  if (err) {
    console.error("DB 연결 오류:", err);
  } else {
    console.log("DB 연결 성공");
  }
});

const app = express();
app.set("port", process.env.PORT || 8080);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "models")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/index.html"));
});

// 로그인 처리
app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await loginUser(username, password);

    console.log("로그인 시도:", user);

    if (user) {
      if (user.username.toLowerCase() === "admin") {
        console.log("admin으로 로그인 성공");
        res.sendFile(path.join(__dirname, "./views/adminMain.html"));
      } else {
        console.log("user로 로그인 성공");
        res.sendFile(path.join(__dirname, "./views/userMain.html"));
      }
    } else {
      console.log("로그인 실패");
      res.send("로그인 실패 - 다시 시도하세요");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// 예약 목록 조회 라우트
app.get("/api/reservations", async (req, res) => {
  try {
    const reservations = await fetchReservations();
    res.json(reservations);
  } catch (error) {
    console.error("Error getting reservations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Checkout 라우트
app.post("/api/checkout/:reservationId", async (req, res) => {
  const reservationId = req.params.reservationId;

  try {
    await checkoutReservation(reservationId);
    res.status(200).send("Checkout successful");
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/placeOrder", async (req, res) => {
  const orderList = req.body.orderList;

  try {
    // 여기서 주문 정보를 데이터베이스에 저장하는 코드를 작성
    const insertQuery =
      "INSERT INTO orders (food_name, quantity, price) VALUES (?, ?, ?)";

    for (const orderItem of orderList) {
      const { item, quantity, price } = orderItem;
      db.query(insertQuery, [item, quantity, price], (err, results) => {
        if (err) {
          console.error("주문 정보 저장 오류:", err);
        } else {
          console.log("주문 정보 저장 성공");
        }
      });
    }

    // 주문이 성공적으로 처리되면 클라이언트에 응답
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

async function getOrdersFromDatabase() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM orders";
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

app.get("/admin/orders", async (req, res) => {
  try {
    const results = await getOrdersFromDatabase(); // 데이터베이스에서 주문 목록 가져오기
    res.json(results);
  } catch (error) {
    console.error("주문 목록 가져오기 오류:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Set up middleware to parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the HTML form
app.get("/reservation.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "reservation.html"));
});

// Handle form submissions
app.post("/submit", (req, res) => {
  const { user_id, room_number, check_in_date, check_out_date } = req.body;

  const sql = `INSERT INTO Reservation (user_id, room_number, check_in_date, check_out_date) VALUES (?, ?, ?, ?)`;

  const getUserIdQuery = `SELECT id FROM users WHERE username = ?`;

  const adminUsername = "admin";

  db.query(getUserIdQuery, [adminUsername], (err, results) => {
    if (err) {
      console.error("MySQL query error:", err);
      res.status(500).send("내부 서버 오류");
    } else {
      if (results.length > 0) {
        const adminUserId = results[0].id;

        db.query(
          sql,
          [adminUserId, room_number, check_in_date, check_out_date],
          (err, result) => {
            if (err) {
              console.error("MySQL query error:", err);
              res.status(500).send("내부 서버 오류");
            } else {
              console.log("Reservation data inserted successfully");
              res.send("예약 성공!");
            }
          }
        );
      } else {
        console.log("해당 사용자가 존재하지 않습니다.");
        res.status(400).send("해당 사용자가 존재하지 않습니다.");
      }
    }
  });
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
