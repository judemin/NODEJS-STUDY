const express = require('express');
const passport = require('passport');
const { isNotLoggedIn, isLoggedIn } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth');
const router = express.Router();

router.post('/join', isNotLoggedIn, join);
router.post('/login', isNotLoggedIn, login);
router.post('/logout', isLoggedIn, logout);

module.exports = router;