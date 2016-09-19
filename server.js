"use strict";
var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var passport = require('passport');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');

// Load environment variables from .env file
dotenv.load();

// Controllers
var HomeController = require('./controllers/home');
var userController = require('./controllers/user');
var contactController = require('./controllers/contact');
var apiController = require('./controllers/api');

// Passport OAuth strategies
require('./config/passport');

var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user ? req.user.toJSON() : null;
  next();
});
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', HomeController.homelifetime); //homelifetime scores
app.get('/homehighscores', HomeController.homehighscores);
app.get('/homehighlevels', HomeController.homehighlevels);

app.get('/game', HomeController.game);
// app.get('/websocketschat', userController.ensureAuthenticated, HomeController.websocketschat);
// app.get('/currentgamebuild', HomeController.currentgamebuild);
// app.get('/currentgamebuild1', HomeController.currentgamebuild1);
// app.get('/contact', contactController.contactGet);
// app.post('/contact', contactController.contactPost);
app.get('/account', userController.ensureAuthenticated, userController.accountGet);
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
app.get('/signup', userController.signupGet);
app.post('/signup', userController.signupPost);
app.get('/login', userController.loginGet);
app.post('/login', userController.loginPost);
app.get('/forgot', userController.forgotGet);
app.post('/forgot', userController.forgotPost);
app.get('/reset/:token', userController.resetGet);
app.post('/reset/:token', userController.resetPost);
app.get('/logout', userController.logout);
app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));


// API for Unity Project
app.post('/api/login', apiController.loginPost);
app.post('/api/signup', apiController.signupPost);
app.get('/api/getltscores', apiController.getLtScores);
app.get('/api/gethscores',  apiController.getHScores);

app.put('/api/updatescore', function (req, res, next) {
	console.log("req.body:", req.body);
	console.log("req.headers:", req.headers);
	next();
}, apiController.ensureAuthenticated, apiController.scorePut);

// app.put('/api/updatescore', function (req, res, next) {
// 	console.log("req.body:", req.body);
// 	console.log("req.headers:", req.headers);
// 	next();
// }, expressJWT({ secret: process.env.JWTSECRET }), function (req, res, next) {
// 	console.log("#### after JWT, in function");
// 	console.log("req.user:", req.user);
// 	console.log("req.body:", req.body);
//   if (req.user.id) {
//     next();
//   } else {
// 		console.log("Error");
// 		res.send('{"error": "error", "msg": "No authorization token was found"}');
// 	}
// }, apiController.scorePut);


// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}



let connectedSockets = {};
let connectedCount = 0;

function sendJustTheNames ( wholeList ) {
	let justTheNames = [];

	for ( let user in wholeList ) {
		justTheNames.push(wholeList[user]);
	}

	return justTheNames;
};

function getClientId ( userName ) {
	for ( let id in connectedSockets ) {
		if ( connectedSockets[id] === userName ) {
			return id;
		}
	}
};

io.on('connection', function (client) {
	console.log('***Client connected:', client.id);

	client.on('initSession', function (userName) {
		connectedSockets[client.id] = userName;
		connectedCount++;
		// client.emit just sends a message back to this one socket
		client.emit('respond', connectedSockets[client.id]);
		io.emit('usersList', sendJustTheNames(connectedSockets));

	});

	client.on('join', function(data) {
			client.emit('connected', 'You are connected,' + data);
	});

	client.on('messages', function(data) {

		if ( data.sendTo === "all" ) {
		 io.emit('broad', data);
	 } else {
		 client.emit('broad', data);
		 client.broadcast.to(getClientId(data.sendTo)).emit('broad', data);
	 }
		 console.log(connectedSockets);
	});

	client.on('disconnect', function() {
		console.log('socket disconnected');
		delete connectedSockets[client.id];
		io.emit('usersList', sendJustTheNames(connectedSockets));
	});

});



server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
