var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
var Task = require("../models/Task.js");
var Projects = require("../models/Project.js");
var Category = require("../models/Category.js");

var Request = require("request");

var apiUrl = "http://acapi.actimer.dev/request";

//GET operations
router.get('/', function(req, res, next) {
  Task.find(function(err, tasks){
     if(err)
     {
         return next(err);
     }

     res.json(tasks);
  });
});

router.get('/:id', function(req, res, next) {

    if (req.params.id === "reload")
    {
        Task.remove({}, function(){});
        Projects.remove({}, function(){});

        Request({
            url: apiUrl,
            qs: {
                path_info:"projects",
                request_type:"get"
            },
            method:"POST"
        }, function(projectsError,projectsResp,projectsBody){

            if(projectsError)
            {
                console.error(projectsError);
            }
            else
            {
                projectsBody = JSON.parse(projectsBody);

                projectsBody.forEach(function(project){
                    var newProject = {
                        projectId: project.id,
                        projectName: project.name
                    };
                    Projects.create(newProject);
                    Request({
                        url: apiUrl,
                        qs: {
                            path_info: "projects/"+project.id+"/tasks",
                            request_type:"get"
                        },
                        method: "POST"
                    }, function(tasksError, tasksResp, tasksBody){

                        if(tasksError)
                        {
                            console.error(tasksError);
                        }
                        else
                        {
                            tasksBody = JSON.parse(tasksBody);

                            tasksBody = tasksBody.tasks;

                            tasksBody.forEach(function(task){
                                var newTask = {
                                    taskId: task.id,
                                    taskName: task.name,
                                    projectId: project.id
                                };
                                Task.create(newTask);
                            });
                        }
                    });
                });
            }
        });

        Request({
            url: apiUrl,
            qs: {
                path_info:"job-types",
                request_type: "get"
            },
            method:"POST"
        }, function(error,resp,categoryList){
            if(error)
            {
                console.error(error);
            }
            else
            {
                Category.remove({}, function(){});
                categoryList = JSON.parse(categoryList);

                categoryList.forEach(function(cat){
                    Category.create({
                        categoryId:cat.id,
                        categoryName:cat.name
                    });
                });
                res.json({result:'success'});
            }
        });
    }
    else
    {
        Task.findOne({'taskId':req.params.id},function(err, post) {
            if(err)
            {
                return next(err);
            }

            res.json(post);
        });
    }


});

router.get('/project/:id', function(req, res, next) {
    Task.find({projectId:req.params.id},function(err, post) {
        if(err)
        {
            return next(err);
        }

        res.json(post.sort(function(a,b){
            var x = a['taskName'].toLowerCase(); var y = b['taskName'].toLowerCase();
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }));
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
