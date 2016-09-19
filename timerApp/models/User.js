var mongoose = require("mongoose");
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
require('dotenv').config();

var UserSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
    systems: [
        {
            url: String,
            company: String,
        }
    ],
    hash: String,
    salt: String
});

UserSchema.methods.setPassword = function(password)
{
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password)
{
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJwt = function()
{
    var expireTime = new Date();
    expireTime.setDate(expireTime.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        systems : this.systems,
        exp: parseInt(expireTime.getTime() / 1000),
    }, process.env.SECRET);
};

module.exports = mongoose.model("Users", UserSchema);