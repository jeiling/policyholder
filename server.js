exports.__esModule = true;
var json_server_1 = require("json-server");
var server = json_server_1["default"].create();
var router = json_server_1["default"].router("db.json");
var middlewares = json_server_1["default"].defaults();
var port = 3001;
server.use(middlewares);
server.get("/api/policyholders/:code/top", function (req, res) {
  var code = req.params.code;
  var db = router.db;
  var policyholder = db.get("policyholders").find({ code: code }).value();
  if (policyholder) {
    res.json(policyholder);
  } else {
    res.status(404).send("Not found");
  }
});
server.use(router);
server.listen(port, function () {
  console.log("JSON Server is running on port ".concat(port));
});
