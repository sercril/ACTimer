var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
var Task = require("../models/Task.js");
var Projects = require("../models/Project.js");

var Request = require("request");

var apiUrl = "http://projects.firefly.cc/";
var apiKey = "19-D29SMh1Bxes64fjzFgRl9PT3OGK5ud5kaMXiBoFF";

var ActiveCollab = require('activecollab');

var ac = new ActiveCollab(apiUrl, apiKey);

//http://projects.firefly.cc/api.php?path_info=projects&auth_api_token=19-D29SMh1Bxes64fjzFgRl9PT3OGK5ud5kaMXiBoFF&format=json&submitted=submitted

//GET operations
router.get('/', function(req, res, next) {
  Task.find(function(err, Tasks){
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
        Task.remove();
        Projects.remove();
        ac.projects.getAll(function(ps){

            ps.forEach(function(project){
                ac.tasks.getAll(project.id, function(ts){
                    Projects.create({
                        projectId: project.id,
                        projectName: project.name
                    });
                    if(ts !== null && typeof ts !== 'undefined' && ts.constructor === Array)
                    {
                        ts.forEach(function(t){
                            Task.create({
                                taskId: t.id,
                                taskName: t.name,
                                projectId: project.id
                            });
                        });
                    }

                });
            });

        });

        res.json("Done");
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
