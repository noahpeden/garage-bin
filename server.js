const express = require('express');
const app = express();
const md5 = require('md5')
const bodyParser = require('body-parser')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.set('port', process.env.PORT || 3001);
app.locals.title = 'Garage Bin'


app.get('/', (request, response) => {
  response.sendFile( __dirname + "/" + "index.html" )
})

app.get('/api/v1/items', (request, response) => {
  database('items').select()
  .then((items)=> {
    if (items.length < 1) {
      response.status(404).send({ error: 'item does not exist1' })
    }
    response.status(200).json(items)
  })
  .catch(function(error) {
    console.error('something is wrong with displaying all items');
    console.log(error);
    response.status(404)
  });
})

app.get('/api/v1/items/:id', (request, response) => {
  database('items').where('id', request.params.id).select()
  .then(function(items) {
          if (items.length < 1) {
            res.status(404).send({ error: 'items does not exist' })
          }
            response.status(200).json(items);
          })
          .catch(function(error) {
            console.error(error)
            response.status(404)
          });
})

app.post('/api/v1/items', (request, response) => {
  const { name, reason, cleanliness } = request.body
  const created_at = new Date
  const items = {name, reason, cleanliness, created_at}
  database('items').insert(items)
        .then(() => {
          database('items').select()
          .then((items) => {
            response.status(200).json(items)
          })
        })
      .catch((error) => {
        response.status(404).send(error)
      })
});

app.patch('/api/v1/items/:id', (request, response) => {
  const { id } = request.params
  const { name, reason, cleanliness } = request.body
  const created_at = new Date
  const items = {name, reason, cleanliness, created_at}
  database('items').where('id', id).select().update(items)
        .then(() => {
          database('items').select()
          .then((items) => {
            response.status(200).json(items)
          })
        })
      .catch((error) => {
        response.status(404).send(error)
      })
});

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}

module.exports = app;
