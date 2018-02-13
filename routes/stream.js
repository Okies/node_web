var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

router.get('/', function(req, res) {
  console.log('call stream');

  process.chdir('D:\\root');
  console.log(process.cwd());

  res.send('stream');
});

module.exports = router;
