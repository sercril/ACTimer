var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
var Tasks = require("../models/Task.js");

var Request = require("request");

var apiUrl = "http://projects.firefly.cc/";
var apiKey = "19-D29SMh1Bxes64fjzFgRl9PT3OGK5ud5kaMXiBoFF";

var AC = Request.defaults({
    baseUrl : apiUrl
});

var baseQs = {
    auth_api_token : apiKey,
    format: "json",
    method:"GET"
};



//http://projects.firefly.cc/api.php?path_info=projects&auth_api_token=19-D29SMh1Bxes64fjzFgRl9PT3OGK5ud5kaMXiBoFF&format=json&submitted=submitted

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

    if (req.params.id === "reload")
    {
        var thisQs = baseQs;

        thisQs.path_info = "projects";
        thisQs.submitted = "submitted";
        AC.get({
            url : "api.php?auth_api_token="+apiKey+"&format=json&path_info=projects&submitted=submitted"
        },
        function (err, response, body)
        {
            console.log(body);
            res.json(body);
        });
    }
    else
    {
        Tasks.findById(req.params.id,function(err, post) {
            if(err)
            {
                return next(err);
            }

            res.json(post);
        });
    }


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
