const express = require("express");
const bodyParser = require("body-parser");
const apiRouter = require("./router/api.routing");
const zipRouter = require("./router/zip.routing");
const app = express();
const port = process.env.PORT || 8080;

//module.exports.handler = async event => {

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT , PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,  x-xsrf-token, Content-Type, Authorization"
  );
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/resource", zipRouter);
app.use("/", apiRouter);
app.listen(port, () => {
  console.log("Express server listening on port " + port);
});
//};
module.exports = app;
