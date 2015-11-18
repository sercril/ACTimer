var should = require('should');
var assert = require('assert');
var request = require('request');
var mongoose = require('mongoose');
var winston = require('winston');
var config = require('./config-debug');

describe('Routing', function(){

	var url = 'http://localhost:3000/';

	before(function(done){
		mongoose.connect(config.db.mongodb);
		done();
	});


});
