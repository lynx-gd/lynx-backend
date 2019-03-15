const fs = require("fs");
const path = require("path");
const assetsDataPath = path.resolve(__dirname,`../persistance/data/Assets.json`);
const assetsImagePath = path.resolve(__dirname,`../public/images`);
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, assetsImagePath)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

module.exports = app => {
  app.get("/api/test", (req, res) => {
    res.send("assets test");
  });

  app.get("/api/assets", (req, res) => {
    let assetsData;
    fs.readFile(assetsDataPath, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        res.send({ error: err });
      }
      assetsData = JSON.parse(data);
      console.log(JSON.stringify(assetsData));
      res.send({ data: assetsData });
    });
  });

  app.get("/api/asset", (req, res) => {
    console.log("asset to find", req.query.id);
    fs.readFile(assetsDataPath, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        res.send({ error: err });
      }
      const assetsData = JSON.parse(data);
      const assets = assetsData.filter(asset => asset.id == req.query.id);
      if (assets && assets[0]) {
        res.send({ data: assets[0] });
      } else res.send({ error: "asset not found" });
    });
  });

  app.post("/api/asset", upload.array('images', 3), (req, res) => {
    const { description, value, physicalAddress, owner } = req.body;
    let images = [];
    req.files.forEach(function(file) {
      console.log('incoming file: ' + file.originalname);
      images.push(file.originalname);
    });
    fs.readFile(assetsDataPath, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        res.send({ error: err });
      }
      const assetsData = JSON.parse(data);
      const newId = assetsData[assetsData.length - 1].id + 10;
      const newAssetObj = {
        id: newId,
        description,
        value,
        physicalAddress,
        owner,
        images
      };
      // console.log("new asset: " + JSON.stringify(newAssetObj));
      assetsData.push(newAssetObj);
      fs.writeFile(assetsDataPath, JSON.stringify(assetsData), "utf8", err => {
        if (err) {
          console.log(err);
          res.send({ success: false, error: err });
        }
        res.send({ success: true, msg: "new asset id: " + newId });
      });
    });
  });

};
