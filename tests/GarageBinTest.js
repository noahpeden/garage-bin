process.env.NODE_ENV = 'test';

const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../server.js');

chai.use(chaiHttp);

describe('Server', () => {
  beforeEach(function(done) {
  database.migrate.rollback()
  .then(function() {
    database.migrate.latest()
    .then(function() {
      return database.seed.run()
      .then(function() {
        done();
      });
    });
  });
});
  it('should exist', () => {
    expect(app).to.exist;
  });

  describe('GET /', function() {
    it('should return a 200 and html', function(done) {
      chai.request(app)
      .get('/')
      .end(function(err, res) {
        if (err) { done(err); }
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        done();
      });
    });
  });

    describe('GET /api/folders', function() {
      it('should return all folders', function(done) {
        chai.request(app)
        .get('/api/folders')
        .end(function(err, res) {
          if (err) { done(err); }
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.equal(2);
          expect(res.body[0]).to.have.property('name');
          done();
        });
      });
    });

    describe('GET /api/folders/:id', function() {
      context('if folder is found', function(){
        it('should return a specific folder', function(done) {
          chai.request(app)
          .get('/api/folders/2')
          .end(function(err, res) {
            if (err) { done(err); }
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.property('name');
            expect(res.body.type).to.equal('Bob Barker');
            done();
          });
        });
      });

      context('if no folder is found', function(){
        it('should return a 404', function(done) {
          chai.request(app)
          .get('/api/v1/pizza/3')
          .end(function(err, res) {
            expect(res).to.have.status(404);
            expect(res.body).to.be.a('object');
            done();
          });
        });
      });
    });
  });
