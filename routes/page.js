const express = require('express');
const { isLoggedIn } = require('../middlewares');
const { renderLogin, renderJoin, renderIndex } = require('../controllers/page');

const router = express.Router();

router.get('/login', renderLogin);
router.get('/join', renderJoin);
router.get('/index', isLoggedIn, renderIndex);

module.exports = router;