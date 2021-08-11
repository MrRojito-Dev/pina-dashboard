const express = require('express');
const router = express.Router();

const passport = require('passport');
const CheckAuth = require('../utils/auth');
const utils = require('../utils/utils');

router.get('/', CheckAuth, async (req, res) => {
  const user = await req.client.users.fetch(req.user.id);

  const userGuilds = req.user.guilds;
  const botGuilds = await utils.getBotGuilds();
  const toShow = utils.getGuilds(botGuilds, userGuilds);

  req.user.toShowGuilds = toShow;

  console.log(toShow);

  res.render('dashboard/dashboard', {
    user: user,
    guilds: toShow,
    title: "Piña Bot"
  });

});

router.get('/admin', CheckAuth, async (req, res) => {
  if (req.user.id !== "648654138929840164") {
    return res.status(403).send(`¡No puedes estar aquí!<br><a href="/">Ir al inicio </a>`)
  }

  const user = await req.client.users.fetch(req.user.id).catch(() => false);

  if (user) {
    res.json({
      user: user,
      guilds: req.user.guilds
    });

  } else {
    return res.send(`No se pudo obtener tus datos...<br><a href="/">Ir al inicio </a>`);
  }

});

module.exports = router;
