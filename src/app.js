require('dotenv').config();

const path = require('path');
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const { Strategy } = require('passport-discord');
const session = require('express-session');

const app = express();
const server = require('http').createServer(app);

let scopes = ['identify', 'guilds'];

const Discord = require('discord.js');
const client = new Discord.Client({
  ws: {
    intents: Discord.Intents.PRIVILEGED
  },
  allowedMentions: { parse: [] }
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

let models = {
  reports: require('./database/models/reports.js'),
};

client.models = models;

passport.use(new Strategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: `${process.env.URL}/login`,
  scope: scopes,
}, (accessToken, refreshToken, profile, done) => {
  process.nextTick(async () => {
    const webLogs = await client.channels.fetch("868564301810659358");
    webLogs.send(`**${profile.username}#${profile.discriminator} (${profile.id})** ha iniciado sesión`);

    return done(null, profile);
  });
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'name',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  req.client = client;
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let routers = {
  index: require('./routes/index'),
  dashboard: require('./routes/dashboard'),
  team: require('./routes/equipo'),
  reportes: require('./routes/reportes'),
};

app.use('/', routers.index);
app.use('/dashboard', routers.dashboard);
app.use('/equipo', routers.team);
app.use('/report', routers.reportes)

app.get('*', (req, res) => {
  res.status(404).render('partials/404', {
    title: "Piña Bot"
  });
});

const port = process.env.PORT || 3000;

process.on('uncaughtException', (err) => {
  console.log(err);
}); 

server.listen(port, () => {
  console.log(`Server listen on port ${port}`)

  client.login()
  .then(() => {
    console.log(`sesión iniciada en Discord como ${client.user.tag}`)
    require('./database/connect.js').then(() => console.log(`Connected to the database`));
  })
  .catch((err) => console.error(err))
});