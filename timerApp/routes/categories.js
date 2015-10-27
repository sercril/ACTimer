var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
var Category = require("../models/Category.js");

//GET operations
router.get('/', function(req, res, next) {
  Category.find(function(err, categories){
     if(err)
     {
         return next(err);
     }

     res.json(categories);
  });
});

router.get('/:id', function(req, res, next) {
    Category.findOne({'categoryId': req.params.id},function(err, post) {
        if(err)
        {
            return next(err);
        }

        res.json(post);
    });
});

//POST operations
router.post('/', function(req, res, next) {
    Category.create(req.body, function(err, post) {
        if(err)
        {
            return next(err);
        }

        res.json(post);
    });
});

//PUT operations
router.put('/:id', function(req, res, next) {
    Category.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
        if(err)
        {
            return next(err);
        }

        res.json(post);
    });
});


//DELETE operations
router.delete('/:id', function(req, res, next) {
    Category.findByIdAndRemove(req.params.id, req.body, function(err, post) {
        if(err)
        {
            return next(err);
        }

        res.json(post);
    });
});

module.exports = router;
