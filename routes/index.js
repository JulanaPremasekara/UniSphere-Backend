var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({ success: true, message: 'Welcome to the UniSphere API' });
});

module.exports = router;
