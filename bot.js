#!/usr/bin/env node

const Discord = require('discord.js');
const jsonfile = require('jsonfile');
const client = new Discord.Client();
const config = require('./config.js');

config.on('ready', () => {
    let prefix = config.prefix;
    client.login(config.token);
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    sign(client.guilds.get('479266358304178177'), client.users.get("139512885679357953"));
});

// LIB ============================================================================

let sign = (guild, user) => {
    let chan = client.channels.get(config.debugchan);
    if (!user instanceof Discord.User) {
        chan.send('User is not a User (function \'sign\')');
        return;
    }
    let memberrole = guild.roles.get(config.roles.Members);
    console.log(config.roles);
};
