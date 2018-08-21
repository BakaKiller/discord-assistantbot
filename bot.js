#!/usr/bin/env node

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.js');

let debugchan;
let prefix;
let message;
let messageparts;
let text;


config.on('ready', () => {
    prefix = config.prefix;
    client.login(config.token);
});

client.on('ready', () => {
    debugchan = client.channels.get(config.debugchan);

    console.log(`Logged in as ${client.user.tag}!`);
    client.on('message', (msg) => {
        if (msg.content.substr(0, prefix.length) === prefix) {
            message = (msg.content.substr(prefix.length)).toLowerCase();
            messageparts = message.split(' ');
            switch (messageparts[0]) {
                case "ping":
                    if (msg.member === null || is_admin(msg.member)) {
                        msg.reply('Pong ! (`' + (new Date().getTime() - msg.createdTimestamp) + 'ms`)');
                    } else {
                        debugchan.send('Not an admin ? :r');
                    }
                    break;
                case "sign":
                    if (msg.member !== null) {
                        sign(msg.member);
                    }
                    msg.delete();
            }
        }
    })
});

function sign(guildmember) {
    let guild = guildmember.guild;
    let user = guildmember.user;
    if (!user instanceof Discord.User) {
        debugchan.send('User is not a User (function \'sign\')');
        return;
    }
    let memberrole = guild.roles.get(config.roles.Member);
    if (!guildmember.roles.has(memberrole)) {
        guildmember.addRole(memberrole);
    }
}

function is_admin(guildmember) {
    return guildmember.roles.has(config.roles.Admin);
}