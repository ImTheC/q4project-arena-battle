var expect = require('chai').expect;
var app = require('../server')
var request = require('supertest')(app);

describe("Connection Test", function () {
  it("should show res.body length = 3", function (done) {
    request.get('/api/getltscores')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        expect(res.body.length).to.eq(3)
        done();
      })
  })
})

describe("loginPost", function () {

	it("shoud connect to log in", function (done) {
		request.post('/api/login')
			.expect(200)
			.end(function (err, res) {
				if (err) return done(err)
				console.log(res);
				// expect(res.body.length).to.eq(3)
				done();
			})
	})
});
