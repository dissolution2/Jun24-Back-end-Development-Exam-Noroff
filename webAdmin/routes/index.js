var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  let value = 0;
  let resultQ;
  

  res.render('index', { resultQ: resultQ, popup: { value } });

  //res.render('index', { title: 'Express' });
  //res.status(200).json({test: "message"}).end();
});

module.exports = router;
