var express = require("express");
var app = express();

app.get("/test", function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
  res.send({ a: 123 });
});

app.listen(8686);
