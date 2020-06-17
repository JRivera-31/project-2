const db = require("../models");
const passport = require("../config/passport.js");
const multer = require("multer");
// env
require("dotenv").config();

// Google cloud storage
// const MulterGoogleCloudStorage = require("multer-google-storage")
// var multerGoogleStorage = require("multer-cloud-storage");
let storage = require("./storage");
const uploadHandler = multer({ storage: storage });

//Init upload
// const uploadHandler = multer({
//     storage: multerGoogleStorage.storageEngine()
// })
console.log(process.env.GCS_BUCKET);
module.exports = function (app) {
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      res.json({});
    } else {
      res.json({
        email: req.user.email,
        id: req.user.id,
      });
    }
  });
  app.post("/api/sellitem", uploadHandler.single("file"), (req, res) => {
    console.log(req.file);
    const itemDetails = JSON.parse(req.body.item);
    itemDetails.image = req.file.filename;
    console.log(itemDetails);
    db.Item.create(itemDetails)
      .then(() => res.status(200))
      .catch((err) => {
        console.log(err);
        res.status(401).json(err);
      });
  });


    app.get("/api/categories/:value", (req,res) => {
        db.Item.findAll({
            where: {
                category: req.params.category
              }
        }).then (function(cat){
            res.json(cat);
        });
    });

};
