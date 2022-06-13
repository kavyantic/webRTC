var express = require('express');
var router = express.Router();

/* GET home page. */
router.use(require('./users'))
router.use('/login',require('./login'))
router.use('/register',require('./register'))

module.exports = router;
