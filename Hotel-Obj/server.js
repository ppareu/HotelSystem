const express = require('express');
const app = express();

app.use(express.static(__dirname)); // 현재 디렉토리를 정적 파일 서버로 사용

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
