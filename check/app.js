// app.js
const express = require('express');
const bodyParser = require('body-parser');
const { getAllGuests, checkIn, checkOut, getAllLogs, formatDate } = require('./models/index');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// View engine 설정
app.set('view engine', 'ejs'); // EJS를 뷰 엔진으로 사용

// Routes
app.get('/', (req, res) => {
    res.render('index', { guests: getAllGuests(), formatDate });
});

app.post('/checkin', (req, res) => {
    const { name, room } = req.body;
    const guest = checkIn(name, room);
    if (guest) {
        res.redirect('/');
    } else {
        res.send('체크인 실패. 같은 이름의 손님이 이미 체크인되어 있습니다.');
    }
});

app.post('/checkout', (req, res) => {
    const { id } = req.body;
    const guest = checkOut(Number(id));
    if (guest) {
        res.redirect('/');
    } else {
        res.send('체크아웃 실패. 해당 ID의 손님이 없거나 이미 체크아웃되었습니다.');
    }
});

app.get('/log', (req, res) => {
    res.render('log', { logs: getAllLogs(), formatDate });
});

// Start server
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
