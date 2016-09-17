var User = require('../models/User');

/**
 * GET /
 */
exports.homelifetime = function(req, res) {
	new User()
		.orderBy('lifegamescore', 'desc')
		.fetchAll({columns:['username','lifegamescore']})
		.then(function(users) {
			res.render('homelifetime', {
		    title: 'Leaderboard - Arena Battle: Space',
				players: users.models
		  });
		}).catch(function(err) {
			res.render('homelifetime', {
		    title: 'Leaderboard - Arena Battle: Space',
				error: 'Sorry, unable to access highscores. Please try again later.'
		  });
		});
};

exports.homehighscores = function(req, res) {

	new User()
		.orderBy('bestgamescore', 'desc')
		.fetchAll({columns:['username','bestgamescore']})
		.then(function(users) {
			res.render('homehighscores', {
		    title: 'Leaderboard - Arena Battle: Space',
				players: users.models
		  });
		}).catch(function(err) {
			res.render('homehighscores', {
		    title: 'Leaderboard - Arena Battle: Space',
				error: 'Sorry, unable to access highscores. Please try again later.'
		  });
		});
};

exports.homehighlevels = function(req, res) {

	new User()
		.orderBy('highestlevel', 'desc')
		.fetchAll({columns:['username','highestlevel']})
		.then(function(users) {
			res.render('homehighlevels', {
		    title: 'Leaderboard - Arena Battle: Space',
				players: users.models
		  });
		}).catch(function(err) {
			res.render('homehighlevels', {
		    title: 'Leaderboard - Arena Battle: Space',
				error: 'Sorry, unable to access highscores. Please try again later.'
		  });
		});
};

exports.game = function(req, res) {
  res.render('game', {
    title: 'Arena Battle: Space'
  });
};


// exports.websocketschat = function(req, res) {
//   res.render('websocketschat', {
//     title: 'Websockets Chat Demo'
//   });
// };
//
// exports.currentgamebuild = function(req, res) {
//   res.redirect('build/index.html');
// };
//
// exports.currentgamebuild1 = function(req, res) {
//   res.redirect('build1/index.html');
// };
