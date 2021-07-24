const express = require('express');
const router = express.Router();

const CheckAuth = require('../auth.js');
const profiles = require('../database/models/profile.js');

router.get('/', CheckAuth, async (req, res) => {
    const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);
    const perfil = await profiles.findOne({ ID: req.user.id });

    res.render('perfiles/perfil', {
        title: "Piña Bot",
        user,
        perfil
    });
});

module.exports = router;