var express = require('express');
var router = express.Router();

var Request = require("request");
// {auth_api_token:"19-D29SMh1Bxes64fjzFgRl9PT3OGK5ud5kaMXiBoFF",format:"json",submitted:"submitted", user_id:19}
// http://projects.firefly.cc/projects/:project_id/tasks/:task_id/tracking/time/add



router.post('/', function(req, res, next) {

    var auth_api_token = encodeURIComponent('19-D29SMh1Bxes64fjzFgRl9PT3OGK5ud5kaMXiBoFF');
    var command = encodeURIComponent('projects/'+req.body.project_id+'/tasks/'+req.body.task_id+'/tracking/time/add');
    var postUrl = 'http://projects.firefly.cc/api.php?path_info='+command+'&auth_api_token='+auth_api_token+'&format=json';
    delete req.body.project_id;
    delete req.body.task_id;
    var formObj = {
        submitted:'submitted',
        'time_record[value]':req.body.value,
        'time_record[user_id]':19,
        'time_record[record_date]':req.body.record_date,
        'time_record[job_type_id]':req.body.job_type_id
    };
    var postObj = {
        url: postUrl,
        form: formObj
    };

    Request.post(postObj, function(err, httpReponse, body){
        res.send(httpReponse);
    });
});

module.exports = router;