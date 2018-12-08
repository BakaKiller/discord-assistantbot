#!/usr/bin/env node

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.js');
const Lang = require('./lang.js');
const lang = new Lang();
const mysql = require('mysql');
const mysql_simplifier = require('./mysql_simplifier');

let debugchan;
let askchan;
let askadminchan;
let prefix;
let message;
let messageparts;
let con;
let sql;
let text;

config.on('ready', () => {
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
                        msg.reply('Pong ! (`' + (new Date().getTime() - msg.createdTimestamp) + 'ms`)');
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
                // case "warn":
                //     if (msg.member !== null) {
                //         warn(msg.guild, msg.author, messageparts[1].match(/\d*\d/)[0], message.substr(0, (messageparts[0].length + messageparts[1].length)));
                //     }
                case "ask":
                    ask(messageparts, msg.author.tag);
                    break;
                case "validquestion":
                    if (msg.member !== null && is_admin(msg.member)) {
                        tryvalidquestion(messageparts[1]);
                    } else {
                        msg.reply('You are not allowed to try and valid a question ! This will be reported.');
                        debugchan.send('<@' + config.roles.Admin + '>' + msg.author.tag + ' has tried to valid question ' + messageparts[1] + '.');
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

function ask(msg, authortag) {
    msg.splice(0, 1);
    msg = msg.join(' ');
    // msg = mysql_real_escape_string(msg.join(' '));
    // authortag = mysql_real_escape_string(authortag);
    // let query = 'INSERT INTO questions (user, question, validation) VALUES ("' + authortag + '", "' + msg + '", 0);';
    // con.query(query, function(err, result) {
    //     if (err) {
    //         debugchan.send(err.message);
    //     } else {
    //         askadminchan.send(result.insertId + ' - ' + authortag + ' : ' + msg);
    //     }
    // });
    let fields = ['user', 'question', 'validation'];
    let values = [authortag, msg, 0];
    sql.insert_into('questions', fields, values, senddebug, insertquestionaction);
}

function insertquestionaction(result, fields, values) {
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

function tryvalidquestion(id) {
    sql.select_from('questions', ['question', 'validation'], {id: id}, senddebug, function(results, fields) {
        if (results[0].validation !== 0) {
            debugchan.send('Question ' + id + ' is already valid !');
        } else {
            sql.update('questions', id, ['validation'], [1], senddebug);
            validquestion(results, fields);
        }
    });
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