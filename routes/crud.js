var express = require('express');
var app = express();
var router = express.Router();

var Driver = require("../models/driver");

router.get("/", function (req, res, next) {
  res.json({ message: "Please follow the instructions of the service using documents." });
});

router.post("/create",
  createDriver,
  function (req, res, next) {
  res.json({ driver: req.driver, message: "New Driver has been created successfully." });
});

router.put("/edit/:id",
  updateDriver,
  function (req, res, next) {
  res.json({ driver: req.driver, message: "The Driver has been updated successfully." });
});

router.delete("/remove/:id",
  deleteDriver,
  function (req, res, next) {
  res.json({ driver: req.driver, message: "The Driver has been removed successfully." });
});

router.get("/ride",
  findNearDrivers,
  function (req, res, next) {
    res.json(req.drivers);
});

function createDriver (req, res, next) {
  var driver = new Driver();
  driver.name = req.body.name;
  driver.location = [Number(req.body.lng), Number(req.body.lat)];
  driver.save(function(err, driver) {
    req.driver = driver;
    if(err) { next(new Error("There was an error on MongoDB. Please try again later.")); console.log(err)}
    else next();
  });
}

function updateDriver (req, res, next) {
  Driver.findById(req.params.id, function (err, driver) {
    if (err) next(new Error("There was an error on MongoDB. Please try again later."));
    else {
      driver.name = req.body.name;
      driver.location = [Number(req.body.lng), Number(req.body.lat)];
      driver.save(function (err, driver) {
        req.driver = driver;
        if (err) next(new Error("There was an error on MongoDB. Please try again later."));
        else next();
      });
    }
  });
}

function deleteDriver (req, res, next) {
  Driver.findByIdAndRemove(req.params.id, function(err, driver) {
    req.driver = driver;
    if(err) { next(new Error("There was an error on MongoDB. Please try again later.")); }
    else next();
  });
}

function findNearDrivers (req, res, next) {
  var lat = req.query.lat || 0;
  var lng = req.query.lng || 0;
  Driver.find({
     location:
     { $near :
          {
            $geometry : {
               type : "Point" ,
               coordinates : [ Number(lng), Number(lat)  ] },
            $maxDistance : 100000000
          }
       }
  }).limit(3).exec(function (err, drivers) {
    if(err) console.log(err);
    console.log(drivers);
    req.drivers = drivers;
    next();
  });
}

module.exports = router;
