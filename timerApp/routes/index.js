var express = require('express');
var router = express.Router();
require('dotenv').config();
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.SECRET,
  userProperty: 'payload'
});

var profileController = require('../controllers/profile');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/timer', function(req, res, next) {
  res.render('timer', { title: 'Timers' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/', auth, profileController.profileRead);

module.exports = router;
