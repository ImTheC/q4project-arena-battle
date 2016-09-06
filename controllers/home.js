/**
 * GET /
 */
exports.index = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};


exports.websocketschat = function(req, res) {
  res.render('websocketschat', {
    title: 'Websockets Chat Demo'
  });
};
