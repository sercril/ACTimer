var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
var Tasks = require("../models/Task.js");

//GET operations
router.get('/', function(req, res, next) {
  Tasks.find(function(err, Tasks){
     if(err)
     {
         return next(err);
     }

     res.json(Tasks);
  });
});

router.get('/:id', function(req, res, next) {
    Tasks.findById(req.params.id,function(err, post) {
        if(err)
        {
            return next(err);
        }

        res.json(post);
    });
});

//POST operations
router.post('/', function(req, res, next) {
    Tasks.create(req.body, function(err, post) {
        if(err)
        {
            return next(err);
        }

        res.json(post);
    });
});

//PUT operations
router.put('/:id', function(req, res, next) {
    Tasks.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
        if(err)
        {
            return next(err);
        }

        res.json(post);
    });
});


//DELETE operations
router.delete('/:id', function(req, res, next) {
    Tasks.findByIdAndRemove(req.params.id, req.body, function(err, post) {
        if(err)
        {
            return next(err);
        }

        res.json(post);
    });
});

module.exports = router;
