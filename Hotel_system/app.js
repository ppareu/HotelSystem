const express = require("express");
const path = require("path");

const app = express();
app.set("port", process.env.PORT || 8080);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "models")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/index.html"));
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
