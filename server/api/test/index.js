'use strict';
const express = require('express');
const router = express.Router();
const controller = require('./test.controller');

router.get('/', controller.test);

module.exports = router;