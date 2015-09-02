var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
var Timers = require("../models/Timer.js");

//GET operations
router.get('/', function(req, res, next) {
  Timers.find(function(err, timers){
     if(err)
     {
         return next(err);
     }

     res.json(timers);
  });
});

router.get('/:id', function(req, res, next) {
    Timers.findById(req.params.id,function(err, post) {
        if(err)
        {
            return next(err);
        }

        res.json(post);
    });
});

//POST operations
router.post('/', function(req, res, next) {
    Timers.create(req.body, function(err, post) {
        if(err)
        {
            return next(err);
        }

        res.json(post);
    });
});

//PUT operations
router.put('/:id', function(req, res, next) {
    Timers.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
        if(err)
        {
            return next(err);
        }

        res.json(post);
    });
});


//DELETE operations
router.delete('/:id', function(req, res, next) {
    Timers.findByIdAndRemove(req.params.id, req.body, function(err, post) {
        if(err)
        {
            return next(err);
        }

        res.json(post);
    });
});

module.exports = router;
