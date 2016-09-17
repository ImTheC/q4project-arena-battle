var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');


/**
 * POST /login
 */
exports.loginPost = function(req, res, next) {

  // req.assert('email', 'Email is not valid').isEmail();
  // req.assert('email', 'Email cannot be blank').notEmpty();
	req.assert('username', 'Username cannot be blank').notEmpty();
  req.assert('password', 'Password cannot be blank').notEmpty();
  // req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
		info.error = "error";
		res.send(errors); // on error
		return;
    // req.flash('error', errors);
    // return res.redirect('/login');
  }

  // passport.authenticate('local', function(err, user, info) {
  //   if (!user) {
	// 		info.error = "error";
	// 		res.send(info); // on error
	// 		return;
  //     // req.flash('error', info);
  //     // return res.redirect('/login')
  //   }

		new User({ username: req.body.username })
	    .fetch()
	    .then(function(user) {
	      if (!user) {
	        res.send('{ "error": "error", "msg": "The username " + username + " is not associated with any account. " + "Double-check your username and try again." }');
	      } else {
		      user.comparePassword(req.body.password, function(err, isMatch) {
		        if (!isMatch) {
		          res.send('{ "error": "error", "msg": "Invalid username or password." }');
		        } else {
							user.attributes.jwtid = jwt.sign({'id': user.id}, process.env.JWTSECRET);
							res.send(user);
						}
			    });
				}
	    });

    // req.logIn(user, function(err) {
		// 	user.attributes.jwtid = jwt.sign({'id': user.id}, process.env.JWTSECRET);
		// 	res.send(user);
      // res.redirect('/');
    // });
  // })(req, res, next);
};

/**
 * GET /logout
 */
exports.logout = function(req, res) {
  req.logout();
	res.send('{"msg": "You have succesfully logged out."}');
  // res.redirect('/');
};

/**
 * POST /signup
 */
exports.signupPost = function(req, res, next) {
  req.assert('username', 'Username cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
		info.error = "error";
		res.send(errors); // on error
		return;
  }

  new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  }).save()
    .then(function(user) {
        req.logIn(user, function(err) {
					user.attributes.jwtid = jwt.sign({'id': user.id}, process.env.JWTSECRET);
					res.send(user);
        });
    })
    .catch(function(err) {
      if (err.code === 'ER_DUP_ENTRY' || err.code === '23505') {
				info.error = "error";
				info.msg = '{ "msg": "The email address you have entered is already associated with another account." }';
				res.send(errors); // on error
				return;
      }
    });
};

/**
 * GET /getltscores
 */
exports.getLtScores = function(req, res) {

	new User()
		.orderBy('lifegamescore', 'desc')
		.query(function (users) {
    	users.limit(10);
  	}).fetchAll({columns:['username','lifegamescore']})
    .then(function(users) {
			res.send(users);
    }).catch(function(err) {
			err.error = "error";
			res.send(err);
			return;
    });
};

// /**
//  * GET /gethscores
//  */
// exports.getHScores = function(req, res) {
exports.getHScores = function(req, res) {

	new User()
		.orderBy('bestgamescore', 'desc')
		.query(function (users) {
    	users.limit(10);
  	}).fetchAll({columns:['username','bestgamescore']})
    .then(function(users) {
			res.send(users);
    }).catch(function(err) {
			err.error = "error";
			res.send(err);
			return;
    });
};

/**
 * PUT /updatescore
 * Update profile information OR change password.
 */
exports.scorePut = function(req, res, next) {
  var errors = req.validationErrors();

  if (errors) {
		errors.error = "error";
		res.send(errors); // on error
		return;
  }
	console.log("#### ID: ", req.user.id);
  var user = new User({ id: req.user.id });
	// console.log("ID:", req.user.id);
	// console.log("bestgamescore:", parseInt(req.body.bestgamescore));
	// console.log("highestlevel:", parseInt(req.body.highestlevel));
	// console.log("lifegamescore:", parseInt(req.body.lifegamescore));

  user.save({
      bestgamescore: parseInt(req.body.bestgamescore),
      highestlevel: parseInt(req.body.highestlevel),
      lifegamescore: parseInt(req.body.lifegamescore)
    }, { patch: true });

	user.fetch().then(function(user) {
    res.send(user);
  }).catch(function(err) {
		if (err) {
			err.error = "error";
			res.send(err);
		}
  });
};


// /**
//  * DELETE /account
//  */
// exports.accountDelete = function(req, res, next) {
//   new User({ id: req.user.id }).destroy().then(function(user) {
//     req.logout();
//     req.flash('info', { msg: 'Your account has been permanently deleted.' });
//     res.redirect('/');
//   });
// };

// /**
//  * GET /unlink/:provider
//  */
// exports.unlink = function(req, res, next) {
//   new User({ id: req.user.id })
//     .fetch()
//     .then(function(user) {
//       switch (req.params.provider) {
//         case 'facebook':
//           user.set('facebook', null);
//           break;
//         case 'google':
//           user.set('google', null);
//           break;
//         case 'twitter':
//           user.set('twitter', null);
//           break;
//         case 'vk':
//           user.set('vk', null);
//           break;
//         default:
//         req.flash('error', { msg: 'Invalid OAuth Provider' });
//         return res.redirect('/account');
//       }
//       user.save(user.changed, { patch: true }).then(function() {
//       req.flash('success', { msg: 'Your account has been unlinked.' });
//       res.redirect('/account');
//       });
//     });
// };

// /**
//  * GET /forgot
//  */
// exports.forgotGet = function(req, res) {
//   if (req.isAuthenticated()) {
//     return res.redirect('/');
//   }
//   res.render('account/forgot', {
//     title: 'Forgot Password'
//   });
// };

// /**
//  * POST /forgot
//  */
// exports.forgotPost = function(req, res, next) {
//   req.assert('email', 'Email is not valid').isEmail();
//   req.assert('email', 'Email cannot be blank').notEmpty();
//   req.sanitize('email').normalizeEmail({ remove_dots: false });
//
//   var errors = req.validationErrors();
//
//   if (errors) {
//     req.flash('error', errors);
//     return res.redirect('/forgot');
//   }
//
//   async.waterfall([
//     function(done) {
//       crypto.randomBytes(16, function(err, buf) {
//         var token = buf.toString('hex');
//         done(err, token);
//       });
//     },
//     function(token, done) {
//       new User({ email: req.body.email })
//         .fetch()
//         .then(function(user) {
//           if (!user) {
//         req.flash('error', { msg: 'The email address ' + req.body.email + ' is not associated with any account.' });
//         return res.redirect('/forgot');
//           }
//           user.set('passwordResetToken', token);
//           user.set('passwordResetExpires', new Date(Date.now() + 3600000)); // expire in 1 hour
//           user.save(user.changed, { patch: true }).then(function() {
//             done(null, token, user.toJSON());
//           });
//         });
//     },
//     function(token, user, done) {
//       var transporter = nodemailer.createTransport({
//         service: 'Mailgun',
//         auth: {
//           user: process.env.MAILGUN_USERNAME,
//           pass: process.env.MAILGUN_PASSWORD
//         }
//       });
//       var mailOptions = {
//         to: user.email,
//         from: 'support@yourdomain.com',
//         subject: '✔ Reset your password on Mega Boilerplate',
//         text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
//         'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//         'http://' + req.headers.host + '/reset/' + token + '\n\n' +
//         'If you did not request this, please ignore this email and your password will remain unchanged.\n'
//       };
//       transporter.sendMail(mailOptions, function(err) {
//         req.flash('info', { msg: 'An email has been sent to ' + user.email + ' with further instructions.' });
//         res.redirect('/forgot');
//       });
//     }
//   ]);
// };
//
// /**
//  * GET /reset
//  */
// exports.resetGet = function(req, res) {
//   if (req.isAuthenticated()) {
//     return res.redirect('/');
//   }
//   new User({ passwordResetToken: req.params.token })
//     .where('passwordResetExpires', '>', new Date())
//     .fetch()
//     .then(function(user) {
//       if (!user) {
//         req.flash('error', { msg: 'Password reset token is invalid or has expired.' });
//         return res.redirect('/forgot');
//       }
//       res.render('account/reset', {
//         title: 'Password Reset'
//       });
//     });
// };

// /**
//  * POST /reset
//  */
// exports.resetPost = function(req, res, next) {
//   req.assert('password', 'Password must be at least 4 characters long').len(4);
//   req.assert('confirm', 'Passwords must match').equals(req.body.password);
//
//   var errors = req.validationErrors();
//
//   if (errors) {
//     req.flash('error', errors);
//     return res.redirect('back');
//   }
//
//   async.waterfall([
//     function(done) {
//       new User({ passwordResetToken: req.params.token })
//         .where('passwordResetExpires', '>', new Date())
//         .fetch()
//         .then(function(user) {
//           if (!user) {
//           req.flash('error', { msg: 'Password reset token is invalid or has expired.' });
//           return res.redirect('back');
//           }
//           user.set('password', req.body.password);
//           user.set('passwordResetToken', null);
//           user.set('passwordResetExpires', null);
//           user.save(user.changed, { patch: true }).then(function() {
//           req.logIn(user, function(err) {
//             done(err, user.toJSON());
//           });
//           });
//         });
//     },
//     function(user, done) {
//       var transporter = nodemailer.createTransport({
//         service: 'Mailgun',
//         auth: {
//           user: process.env.MAILGUN_USERNAME,
//           pass: process.env.MAILGUN_PASSWORD
//         }
//       });
//       var mailOptions = {
//         from: 'support@yourdomain.com',
//         to: user.email,
//         subject: 'Your Mega Boilerplate password has been changed',
//         text: 'Hello,\n\n' +
//         'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
//       };
//       transporter.sendMail(mailOptions, function(err) {
//         req.flash('success', { msg: 'Your password has been changed successfully.' });
//         res.redirect('/account');
//       });
//     }
//   ]);
// };
