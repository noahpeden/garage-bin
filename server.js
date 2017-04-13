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

app.set('port', process.env.PORT || 3000);
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


if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}

module.exports = app;
