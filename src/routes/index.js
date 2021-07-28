const express = require('express');
const router = express.Router();

const passport = require('passport');
const CheckAuth = require('../utils/auth.js');

// Home page
router.get('/', async (req, res) => {
  const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

  res.render('index', {
    title: 'Piña Bot',
    user
  });
});

// Premium
router.get('/premium', async (req, res) => {
  const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

  res.render('premium', {
    title: "Piña Bot",
    user
  })
});

// Soporte
router.get('/soporte', async (req, res) => {
  const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

  res.render('soporte', {
    title: 'Piña Bot',
    user
  });
});

// Mis reportes
router.get('/mis-reportes', CheckAuth, async (req, res) => {
  const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

  const reportsModel = req.client.models.reports;
  const userReports = await reportsModel.find({ user_id: user.id });

  const { humanize } = require("../utils/utils.js");

  res.render("reportes/mis-reportes", {
    title: "Piña Bot",
    user,
    userReports,
    humanize
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
