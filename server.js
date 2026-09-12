'use strict';
const express = require('express')
const bodyParser = require('body-parser')

const PORT = 3000;
const HOSTNAME = 'localhost';

const app = express();
app.use(bodyParser.json());

require('./server/routes.js')(app);
app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});