const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

    res.render('equipo', {
        title: "Piña Bot",
        user
    });
});

router.get('/miembros', async (req, res) => {
    const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

    res.render('team-members', {
        title: "Piña Bot",
        user
    });
});

module.exports = router;