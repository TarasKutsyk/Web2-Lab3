const path = require('path')
const morgan = require('morgan');

const express = require('express')
const app = express()

const mongoose = require('mongoose');

const config = require('./config');
const mainRouter = require('./routes/main.router');

_connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

app.use(express.static(__dirname));

app.set('views', path.join(__dirname, '/static/views'))
app.set('view engine', 'pug')

app.use('/', mainRouter);

function _connectDB() {
  mongoose.connect(config.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

  const { connection } = mongoose;

  connection.on('error', err => {
    console.log(err);
  });
}

app.listen(config.PORT, () => {
  console.log(`App listen ${config.PORT}`);
});
