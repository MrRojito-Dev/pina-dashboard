const express = require('express');
const router = express.Router();
const Discord = require('discord.js');

router.get('/', async (req, res) => {
    const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

    res.render('equipo/equipo', {
        title: "Piña Bot",
        user
    });
});

router.get('/miembros', async (req, res) => {
    let teamMembers = [
        /* Admins */
        {
            id: "648654138929840164", // Rojito
            cargo: "Dueño, Desarrollador, Administrador"
        },
        {
            id: "749785464923488348", // Norean
            cargo: "Desarrollador, Administrador"
        },
        {
            id: "480176818297503744", // Johan
            cargo: "Administrador"
        },
        /* Soportes */
        {
            id: "648844291703308298", // Calixto
            cargo: "Soporte"
        },
        {
            id: "764571098334494772", // EsteName_
            cargo: "Soporte"
        },
        /* Gestores */
        {
            id: "718444076248072256", // Iván
            cargo: "Gestor de logros"
        },
        {
            id: "607925114176143361", // Joshua
            cargo: "Gestor de logros"
        }
    ];

    let team = [];

    teamMembers.forEach(async (member) => {
        let dUser = await req.client.users.fetch(member.id).catch(() => false);
        if (dUser) {
            team.push({
                user: dUser,
                cargos: member.cargo.split(", ")
            });
        }
    });

    const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

    setTimeout(() => {
        res.render('equipo/team-members', {
            title: "Piña Bot",
            user,
            team
        });
    }, 1000);
});

module.exports = router;