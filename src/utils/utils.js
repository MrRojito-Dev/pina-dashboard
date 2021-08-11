const permissions = require("./permissions");
const fetch = require("node-fetch");
const humanizeDuration = require("humanize-duration");
const api = "https://discord.com/api/v6";

const cache = new Map();
setInterval(() => {
    cache.clear();
}, 240000);


// Functions
const humanize = (time) => {
    let time_elapsed = humanizeDuration(Date.now() - time, {
        language: 'es',
        maxDecimalPoints: 0,
        largest: 2,
        conjunction: ' y ',
        serialComma: false,
        round: true
      });
    return time_elapsed;
};

const getUser = async (userID) => {
    const userCache = cache.get(`user-${userID}`);
    if (userCache) return userCache;

    const res = await fetch(`${api}/users/${userID}`, {
        method: "GET",
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`
        }
    });

    if (res.status === 429) {
        const json = await res.json();
        await new Promise((s) => setTimeout(s, (Math.floor(parseInt(json.retry_after)))));
        return this.getUser(userID);
    }

    const retrys = res.headers.get("X-RateLimit-Remaining");
    const retryAfter = res.headers.get("X-RateLimit-Reset-After");
    if (!isNaN(retrys) && !isNaN(retryAfter)) {
        if (parseInt(retrys) < 1) await new Promise(s => setTimeout(s, (Math.floor(parseInt(retryAfter) * 1000) + 0.5)));
    }

    const final = await res.json();
    if (res.ok) cache.set(`user-${userID}`, final);

    return final;
};

const getPermissions = (perm) => {
    const permissionMap = new Map();
    for (const [key, value] of Object.entries(permissions)) {
        if ((perm & value) == value) permissionMap.set(key, value);
    }

    return permissionMap;
};

const getGuilds = (botGuilds, userGuilds) => {
    if (!Array.isArray(botGuilds)) {
        console.error(botGuilds)
        throw new Error('"botGuilds" no es un Array');
    }
    if (!Array.isArray(userGuilds)) {
        console.error(userGuilds)
        throw new Error('"userGuilds" no es un Array');
    }

    const guildMemberPermissions = new Map();
    userGuilds.forEach((guild) => {
        const perm = getPermissions(guild.permissions);
        guildMemberPermissions.set(guild.id, perm);
    });

    const toShow = userGuilds.filter((e) => {
        if (!botGuilds.includes(e.id)) return;
        const p = guildMemberPermissions.get(e.id);
        if (p && p.get("ADMINISTRATOR")) {
            return true;
        } else {
            return false;
        }
    });

    return toShow;
};

const getBotGuilds = async () => {
    const res = await fetch(`${process.env.FETCH}/guilds`, {
        method: 'GET',
        headers: {
            "pass": `${process.env.ACCESS}`
        }
    });

    if (res.ok) {
        return await res.json();
    } else {
        throw new Error(`Status code returned ${res.status} (${res.statusText})`);
    }
};

module.exports = {
    getUser,
    getGuilds,
    getPermissions,
    getBotGuilds,
    humanize
};