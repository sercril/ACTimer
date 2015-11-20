var should = require('should-http');
var assert = require('assert');
var request = require('request');
var mongoose = require('mongoose');
var winston = require('winston');
var config = require('./config.js');

var Task = require("../models/Task.js");
var Projects = require("../models/Project.js");
var Category = require("../models/Category.js");
var Timer = require("../models/Timer.js");
var ActiveCollab = require('activecollab');


describe('Routing', function(){

	var url = 'http://localhost:3000';
    var apiUrl = "http://projects.firefly.cc/";
    var apiKey = "19-D29SMh1Bxes64fjzFgRl9PT3OGK5ud5kaMXiBoFF";
    var ac = new ActiveCollab(apiUrl, apiKey);
    var testID = "";

	before(function(done){
		mongoose.connect(config.db.mongodb);
		done();
	});

    describe('Timer', function(){
        it('Adding Timer', function(done){
            var timer =
            {
                elapsedTime: 300,
                billable: false,
                description: 'Unit Test Timer',
                category: "Training",
                date: Date.now(),
                task: 14903
            };
            var req = {
              url:url+"/timers",
              form: timer
            };

            request.post(req, function(err, res){
                    if(err)
                    {
                        throw err;
                    }


                    res.should.have.status(200);
                    done();
                });
        });
        it('Updating Timer', function(done){


            Timer.find({}).sort({"_id": -1}).exec(function(err, timers){
                if(err)
                {
                    return next(err);
                }
                var timer =
                {
                    billable: true,
                    description: 'Unit Test'
                };


                timers = JSON.parse(JSON.stringify(timers));
                testID = timers[0]._id;
                var req =
                {
                    url:url+"/timers/"+testID,
                    method:"PUT",
                    body: timer,
                    json:true
                };

                request(req,function(err,res){
                    if(err)
                    {
                        throw err;
                    }
                    var req =
                    {
                        url:url+"/timers/"+res.body._id,
                        method:"GET",
                        json:true
                    };
                    request(req,function(err,res) {
                        if (err) {
                            throw err;
                        }
                        res.body.billable.should.be.equal(true);
                        res.body.description.should.be.equal('Unit Test');

                        done();
                    });
                });
            });
        });
        it('Removing Timer', function(done){
            var req =
            {
                url:url+"/timers/"+testID,
                method:"DELETE"
            };

            request(req, function(err, res){
                if(err)
                {
                    throw err;
                }
                var req =
                {
                    url:url+"/timers/"+testID,
                    method:"GET",
                    json:true
                };
                request(req,function(err,res) {
                    if (err)
                    {
                        throw err;
                    }
                    if(res.body !== null)
                    {
                        throw "Item not removed!";
                    }

                    done();
                });

            })
        });
    });
    describe('Getting Data from ActiveCollab', function(){
        it("Getting Projects and Tasks", function(done){
            this.timeout(60000);
            Task.remove({}, function(){});
            Projects.remove({}, function(){});
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
                done();
            });
        });

        it("Getting Categories", function(done){
            this.timeout(30000);
            request({
                url:apiUrl,
                qs: {
                    path_info:"projects/486/hourly-rates",
                    auth_api_token:apiKey,
                    format:"json",
                    submitted:"submitted"
                },
                method:"GET"
            }, function(error,resp,body){
                if(error)
                {
                    console.error(error);
                }
                else
                {
                    Category.remove({}, function(){});
                    body = JSON.parse(body);

                    body.forEach(function(cat){


                        Category.create({
                            categoryId:cat.id,
                            categoryName:cat.name
                        });


                    });

                    done();
                }
            });
        });
    });

});
