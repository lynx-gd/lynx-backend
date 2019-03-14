const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
var cors = require("cors");

var app = express();
app.use(cors());
app.options("*", cors());
app.use("/", router);
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(express.static(__dirname + "/public"));

require("./routes/Assets")(app);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));

router.get("/api/hello", (req, res) => {
  res.send({ msg: "lynx backend" });
});
