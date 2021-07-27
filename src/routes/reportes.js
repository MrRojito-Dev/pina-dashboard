const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const auth = require('../utils/auth');

const Discord = require('discord.js');
const ReportWebhook = new Discord.WebhookClient(process.env.BUGS_WEBHOOK_ID, process.env.BUGS_WEBHOOK_TOKEN)

router.get('/', auth, async (req, res) => {
    const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

    return res.render('reportbug', {
        title: 'Piña Bot',
        user,
        sucess: false,
        validations: undefined,
        values: undefined
    });
});

router.post('/', auth, [
    body("bugTitle", "El titulo del reporte debe tener 5 caracteres como minimo.")
    .exists()
    .isLength({ min: 5 }),

    body("bugDescription", "El reporte debe tener 10 caracteres como minimo")
    .exists()
    .isLength({ min: 10 })

], async (req, res) => {
    const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(req.body);
        const values = req.body;
        const validations = errors.array();

        res.render('reportbug', {
            title: 'Piña Bot',
            user,
            validations,
            values,
            sucess: false
        });
    } else {
        try {
            const embedReport = new Discord.MessageEmbed()
            .setAuthor(`${user.tag}`, user.displayAvatarURL({dynamic: true}))
            .setColor("BLUE")
            .setThumbnail(user.displayAvatarURL({dynamic: true}))
            .setTitle("Reporte hecho desde la WEB:")
            .setDescription(`> __**Título**__: **${req.body.bugTitle}** \n> __**Detalles**__: **${req.body.bugDescription}**`)
            .setTimestamp()
    
            ReportWebhook.send(embedReport);
    
            res.render('reportbug', {
                title: 'Piña Bot',
                user,
                sucess: true
            });
        } catch (error) {
            console.log(error);

            res.status(500).send(`Ocurrió un error inesperado... Pide ayuda en el <a href="/soporte">servidor de soporte</a> Intenta de nuevo más tarde<br><a href="/">Ir al inicio</a>`)
        }
    }
});

module.exports = router;