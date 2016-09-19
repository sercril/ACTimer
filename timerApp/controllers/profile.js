var mongoose = require("mongoose");
var User = require("../models/User.js");

module.exports.profileRead = function(req, res)
{
    if(!req.payload._id)
    {
        res.status(401).json({
           'message' : 'UnauthorizedError: private profile'
        });
    }
    else
    {
        User
            .findById(req.payload._id)
            .exec(function(err,user){
                res.status(200).json(user);
            });
    }
};

function profileController($location, Authorization)
{
    var vm = this;

    vm.user = {};

    Authorization.getProfile()
        .success(function(data){
            vm.user = data;
        })
        .error(function(e){
            console.log(e);
        });
}