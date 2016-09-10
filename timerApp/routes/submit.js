var express = require('express');
var router = express.Router();

var Request = require("request");
// {auth_api_token:"19-D29SMh1Bxes64fjzFgRl9PT3OGK5ud5kaMXiBoFF",format:"json",submitted:"submitted", user_id:19}
// http://projects.firefly.cc/projects/:project_id/tasks/:task_id/tracking/time/add

var apiUrl = "http://acapi.actimer.dev/request";

router.post('/', function(req, res, next) {

    var auth_api_token = encodeURIComponent('19-D29SMh1Bxes64fjzFgRl9PT3OGK5ud5kaMXiBoFF');
    var path_info = 'projects/'+req.body.project_id+'/tasks/'+req.body.task_id+'/tracking/time/add';
    delete req.body.project_id;
    delete req.body.task_id;
    var formObj = {
        'value':req.body.value,
        'user_id':19,
        'record_date':req.body.record_date,
        'job_type_id':req.body.job_type_id,
        'billable_status': req.body.billable,
        'request_type': 'post',
        'path_info': path_info
    };
    var postObj = {
        url: apiUrl,
        form: formObj
    };

    Request.post(postObj, function(err, httpReponse, body){
        res.send(httpReponse);
    });
});

module.exports = router;