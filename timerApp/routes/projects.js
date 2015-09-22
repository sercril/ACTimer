var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
var Projects = require("../models/Project.js");

//GET operations
router.get('/', function(req, res, next) {
  Projects.find(function(err, timers){
     if(err)
     {
         return next(err);
     }

     res.json(timers);
  });
});

router.get('/:id', function(req, res, next) {
    Projects.findById(req.params.id,function(err, post) {
        if(err)
        {
            return next(err);
        }

        res.json(post);
    });
});

//POST operations
router.post('/', function(req, res, next) {
    Projects.create(req.body, function(err, post) {
        if(err)
        {
            return next(err);
        }

        res.json(post);
    });
});

//PUT operations
router.put('/:id', function(req, res, next) {
    Projects.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
        if(err)
        {
            return next(err);
        }

        res.json(post);
    });
});


//DELETE operations
router.delete('/:id', function(req, res, next) {
    Projects.findByIdAndRemove(req.params.id, req.body, function(err, post) {
        if(err)
        {
            return next(err);
        }

        res.json(post);
    });
});

module.exports = router;
