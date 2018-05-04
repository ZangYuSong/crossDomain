var express = require("express");
var app = express();

app.get("/test", function(req, res) {
  var callback = req.query.callback;
  res.send(callback + "('Hello World')");
});

app.listen(8686);
