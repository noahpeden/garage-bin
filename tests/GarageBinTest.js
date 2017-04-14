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
  describe('GET /', () => {
    it('should send back an html file', (done) => {
      chai.request(app)
      .get('/')
      .end((err, res) => {
        if(err) { done(err); }
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        done();
      });
    });
  });
  describe('GET /', () => {
    it('should respond back with a 404 error', (done) => {
      chai.request(app)
      .get('/ /')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
    });
  });
  describe('GET /api/v1/items', () => {
  it('should return all items', (done) => {
    chai.request(app)
    .get('/api/v1/items')
    .end((err, res) => {
      if (err) { done(err); }
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
      expect(res.body.length).to.equal(5);
      expect(res.body[0]).to.have.property('name');
      done();
    });
  });
  it('should return a 404 if region does not exist', (done) => {
    chai.request(app)
    .get('/api/v1/itemsss/')
    .end((err, res) => {
      expect(res).to.have.status(404);
      expect(res.body).to.be.a('object');
      done()
    })
  })
});
});
describe('GET /api/items/:id', () => {
  context('if item is found', () => {
    it('should return a specific item', (done) => {
      chai.request(app)
      .get('/api/v1/items/1')
      .end((err, res) => {
        if (err) { done(err); }
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body[0].name).to.equal('baseball bat');
        done();
      });
    });
    it('should return a 404 if item id does not exist', () => {
      chai.request(app)
      .get('/api/v1/itemsss/12')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.a('object');
        done()
      })
    });
  });
});
describe('PATCH /api/items/:id', () => {
  it('should edit a items name', (done)=> {
    chai.request(app)
    .patch('/api/v1/items/5')
    .send({
      name: 'Nova Roma',
      id: 5
    })
    .end((error, res)=> {
      expect(res).to.have.status(200)
      expect(res.body).to.be.a('array')
      done()
    })
  })
})
describe('PATCH /api/v1/items/:id', ()=> {
  it('should return 404 if incorrect path is entered', (done)=> {
    chai.request(app)
    .post('/api/v1/items/800')
    .end((error, res)=> {
      expect(res).to.have.status(404)
      done()
    })
  })
})
