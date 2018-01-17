var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  console.log('call textRPG');
  res.render('textRPG.html');
});

module.exports = router;
