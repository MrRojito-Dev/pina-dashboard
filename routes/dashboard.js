const express = require('express');
const router = express.Router();

const passport = require('passport');
const CheckAuth = require('../auth.js');

router.get('/', CheckAuth, async (req, res) => {
  const user = await req.client.users.fetch(req.user.id);

  res.render('dashboard', {
    user: user
  });
  
});

module.exports = router;
