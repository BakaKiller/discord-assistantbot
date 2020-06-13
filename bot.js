#!/usr/bin/env node

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.js');
const Lang = require('./lang.js');
const lang = new Lang();
const mysql = require('mysql');
const mysql_simplifier = require('./mysql_simplifier');
const Log = require('./logs.js');
const assert = require('assert').strict

let debugchan;
let askchan;
let askadminchan;
let prefix;
let message;
let messageparts;
let con;
let sql;
let logs;
let text;

config.on('ready', () => {
    process.env.TZ=config.timezone;
    prefix = config.prefix;
    lang.init(config.lang);
});

lang.on('ready', () => {
    client.login(config.token);
});

client.on('ready', () => {
    debugchan = client.channels.get(config.debugchan);
    askchan = client.channels.get(config.askchan);
    askadminchan = client.channels.get(config.askadminchan);

    con = mysql.createConnection({
        host: config.dbhost,
        user: config.dbuser,
        password: config.dbpwd,
        database: config.dbname
    });
    con.connect(function (err) {
        if (err) {
            debugchan.send(err.message);
            throw err;
        } else {
            sql = new mysql_simplifier(con);
            logs = new Log(sql);
        }
    });
    console.log(lang.getstring('loggedas', `${client.user.tag}`));
    client.on('message', (msg) => {
        if (msg.content.substr(0, prefix.length) === prefix) {
            message = (msg.content.substr(prefix.length)).toLowerCase();
            messageparts = message.split(' ');
            switch (messageparts[0]) {
                case "ping":
                    if (msg.member === null || is_admin(msg.member)) {
                        msg.reply('Pong !');
                    } else {
                        debugchan.send(msg.author.tag);
                    }
                    break;
                case "sign":
                    if (msg.member !== null) {
                        sign(msg.member);
                    }
                    msg.delete();
                    break;
                case "ban":
                case "pshit":
                    if (msg.member !== null && is_mod_or_admin(msg.member)) {
                        ban(messageparts[1].match(/\d*\d/)[0], msg.member, message.substr(0, (messageparts[0].length + messageparts[1].length)));
                    } else {
                        msg.reply(lang.getstring('cantban'));
                        debugchan.send('<@&' + config.roles.Admin + '> ' + msg.author.tag + lang.getstring('triedtoban') + messageparts[1] + '.');
                    }
                // case "warn":
                //     if (msg.member !== null) {
                //         warn(msg.guild, msg.author, messageparts[1].match(/\d*\d/)[0], message.substr(0, (messageparts[0].length + messageparts[1].length)));
                //     }
                    break;
                case "ask":
                    ask(messageparts, msg.author.tag);
                    break;
                case "slowmo":
                    slow_mo(msg.author, 30, msg.channel)
                    break;
                case "clean":
                    if (msg.member !== null && is_mod_or_admin(msg.member)) {
                        clean(msg.channel, messageparts[1]);
                    } else {
                        msg.reply(lang.getstring('cantclean'));
                        debugchan.send('<@&' + config.roles.Admin + '> ' + msg.author.tag + lang.getstring('triedtoclean') + ' <#' + msg.channel.id + '>');
                    }
                    break;
                case "validquestion":
                    if (msg.member !== null && is_admin(msg.member)) {
                        tryvalidquestion(messageparts[1], msg.author);
                    } else {
                        msg.reply(lang.getstring('cantvalid'));
                        debugchan.send('<@&' + config.roles.Admin + '> ' + msg.author.tag + lang.getstring('triedtovalid') + messageparts[1] + '.');
                    }
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
        logs.add('signed', user.tag, "");
    }
}

function ban(memberid, banner, reason = null) {
    if (is_mod_or_admin(banner)) {
        let guildmember = banner.guild.members.get(memberid);
        guildmember.ban(reason);
        logs.add('banned', banner.tag, guildmember.tag);
    }
}

function warn(guild, warner, memberid, message) {
    let role = guild.roles.get(config.roles.Warned);
    let member = guild.members.get(memberid);
    if (!member.roles.has(role.id)) {
        member.addRole(role);
    } else {
        debugchan.send(member.user.tag + ' : ' + lang.getstring('alreadywarned'));
    }
}

function clean(chan, nb) {
    chan.fetchMessages({limit: nb}).then(messages => messages.forEach(msg => msg.delete()))
}

function ask(msg, authortag, userid) {
    msg.splice(0, 1);
    msg = msg.join(' ');
    let fields = ['user', 'question', 'validation'];
    let values = [authortag, msg, 0];
    sql.insert_into('questions', fields, values, senddebug, insertquestionaction);
}

function insertquestionaction(result, fields, values) {
    logs.add('asked', values[0], 'questionid: ' + result.insertId);
    sendquestion(askadminchan, result.insertId, values[0], values[1]);
}

function sendquestion(chan, id, authortag, msg) {
    chan.send(id + ' - ' + authortag + ' : ' + msg);
}

function senddebug(err) {
    console.log(err);
    debugchan.send(err.msg);
}

function validquestion(results, fields) {
    askchan.send(results[0].question);
}

function tryvalidquestion(id, author) {
    sql.select_from('questions', ['question', 'validation'], {id: id}, senddebug, function(results, fields) {
        if (results[0].validation !== 0) {
            debugchan.send(lang.getstring('alreadyvalid', id));
        } else {
            sql.update('questions', id, ['validation'], [1], senddebug);
            logs.add('validquestion', author.tag, 'questionid: ' + id);
            validquestion(results, fields);
        }
    });
}

function slow_mo(guildmember, time, channel) {
    assert(channel instanceof Discord.TextChannel);
    assert(guildmember instanceof Discord.User);
    assert(Number.isInteger(time));

    channel.setRateLimitPerUser(time);
    debugchan.send("Member <@" + guildmember.id + "> started slow-mo mode on channel <#" + channel.id + ">");
    channel.send("Slow motion activated ! You may need help from <@&" + config.roles.Admin+ "> to change disable it !");
}

function is_admin(guildmember) {
    return guildmember.roles.has(config.roles.Admin);
}

function is_mod(guildmember) {
    return guildmember.roles.has(config.roles.Modo);
}

function is_mod_or_admin(guildmember) {
    return (is_admin(guildmember) || is_mod(guildmember));
}
