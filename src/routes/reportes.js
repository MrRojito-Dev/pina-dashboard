const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const auth = require('../utils/auth');

const { nanoid } = require("nanoid");
const { humanize } = require("../utils/utils");
 
const Discord = require('discord.js');
const ReportWebhook = new Discord.WebhookClient(process.env.BUGS_WEBHOOK_ID, process.env.BUGS_WEBHOOK_TOKEN)

router.get('/', auth, async (req, res) => {
    const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

    return res.render('reportes/reportbug', {
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
    const reportm = req.client.models.reports;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const values = req.body;
        const validations = errors.array();

        res.render('reportes/reportbug', {
            title: 'Piña Bot',
            user,
            validations,
            values,
            sucess: false
        });
    } else {
        try {
            let reportID = nanoid(7);
            const embedReport = new Discord.MessageEmbed()
            .setAuthor(`${user.tag} (${user.id})`, user.displayAvatarURL({dynamic: true}))
            .setColor("BLUE")
            .setThumbnail(user.displayAvatarURL({dynamic: true}))
            .setDescription(`> **[Reporte](${process.env.URL}/report/${reportID}) hecho desde la WEB**:`)
            .addField(`${req.body.bugTitle}`, `${req.body.bugDescription}`)
            .setFooter(`ID del reporte: ${reportID}`)
            .setTimestamp()

            let newReport = new reportm({
                report_id: reportID,
                user_id: user.id,
                reportTitle: `${req.body.bugTitle}`,
                reportDescription: `${req.body.bugDescription}`,
                date: Date.now()
            });
    
            ReportWebhook.send(embedReport);
    
            res.render('reportes/reportbug', {
                title: 'Piña Bot',
                user,
                sucess: true
            });

            newReport.save().then(() => console.log("Reporte guardado en la base de datos"))
        } catch (error) {
            console.log(error);

            res.status(500).send(`Ocurrió un error inesperado... Pide ayuda en el <a href="/soporte">servidor de soporte</a> Intenta de nuevo más tarde<br><a href="/">Ir al inicio</a>`)
        }
    }
});

router.use("/:reportID", async (req, res) => {
    const soportes = [
        "648654138929840164", // Rojito
        "749785464923488348", // Norean
        "480176818297503744", // Johan
        "764571098334494772", // EsteName_
        "648844291703308298" // Calixto
    ];
    const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);
    const reportm = req.client.models.reports;

    let message = "";

    const report = reportm.findOne({ report_id: req.params.reportID });

    if (!report) {
        message = "¡Este reporte no existe!";
    }
    if (report.user_id !== user.id && !soportes.includes(user.id)) {
        message = "¡No puedes ver este reporte! ¡No es tuyo!";
    };

    res.render("reportes/report", {
        title: "Piña Bot",
        user,
        message,
        report,
        humanize
    });
});

module.exports = router;