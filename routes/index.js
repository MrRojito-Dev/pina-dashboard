const express = require('express');
const router = express.Router();

const passport = require('passport');
const CheckAuth = require('../auth.js');

// Home page
router.get('/', async (req, res) => {
  const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

  if (user) {
    let channelLogs = await req.client.channels.fetch("848045465383469096").catch(() => false);
    if (channelLogs) {
      channelLogs.send(`**${user.tag}** se ha logeado en la página...`);
    }
  }

  res.render('index', {
    title: 'Piña Bot',
    user: user
  });
});

// Soporte
router.get('/soporte', async (req, res) => {
  const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

  res.render('soporte', {
    title: 'Piña Bot',
    user: user
  });
});

// Login
router.get('/login', (req, res, next) => {
  if (req.query.error === 'access_denied') {
    return res.status(401).send(`¡Debes iniciar sesión en Discord!<br> <a href="/">Ir al inicio</a>`);
  } else {
    passport.authenticate('discord', {
      failureMessage: true,
    })(req, res, next);
  }
}, (req, res) => {
  res.redirect('/');
});

// Logout
router.get('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    res.redirect('/');
  } else {
    res.redirect('/')
  }
});

module.exports = router;
