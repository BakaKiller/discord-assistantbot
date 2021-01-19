#!/usr/bin/env node

console.log('Requiring modules...');
const { CommandoClient, SQLiteProvider } = require('discord.js-commando');
const path = require('path');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const config = require('./config.json');

console.log('Opening client...');
const client = new CommandoClient({
    owner: '139512885679357953',
    commandPrefix: '?'
});

console.log('Setting provider');
client.setProvider(
    sqlite.open({
        filename: path.join(__dirname, 'settings.sqlite3'),
        driver: sqlite3.Database
    }).then(db => new SQLiteProvider(db))
).catch(console.error);

console.log('Creating registry...');
client.registry
    // Registers your custom command groups
    .registerGroups([
        ['admin', 'Administration commands'],
        ['member', 'Members commands']
    ])

    // Registers all built-in groups, commands, and argument types
    .registerDefaults()

    // Registers all of your commands in the ./commands/ directory
    .registerCommandsIn(path.join(__dirname, 'cmds'));

client.login(config.token);

client.on('ready', () => {
    console.log("Logged as " + client.user.tag);
    client.on('error', console.error);
    /*client.on('message', (msg) => {
        if (msg.content.substr(0, prefix.length) === prefix) {
            message = (msg.content.substr(prefix.length)).toLowerCase();
            messageparts = message.split(' ');
            switch (messageparts[0]) {
                 case "clean":
                    if (msg.member !== null && is_mod_or_admin(msg.member)) {
                        clean(msg.channel, messageparts[1]);
                    } else {
                        msg.reply(lang.getstring('cantclean'));
                        debugchan.send('<@&' + config.roles.Admin + '> ' + msg.author.tag + lang.getstring('triedtoclean') + ' <#' + msg.channel.id + '>');
                    }
                    break;
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
                    } else {
                        senddebug({msg:"No guild"});
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
                    slow_mo(msg.author, 30, msg.channel);
                    break;
                case "debug_userdata":
                    senddebug({msg: JSON.stringify(msg.guild.members)});
                    break;
                    //msg.guild.members.fetch().then(() => senddebug({msg: JSON.stringify(msg.guild.members)})).catch(err => senddebug(err));
                case "unslowmo":
                    if (msg.member !== null && is_mod_or_admin(msg.member)) {
                        slow_mo(msg.author, 0, msg.channel);
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
    })*/
});
/**
 * @param {Discord.GuildMember} guildmember
 */
function sign(guildmember) {
    let guild = guildmember.guild;
    let user = guildmember.user;
    if (!user instanceof Discord.User) {
        debugchan.send('User is not a User (function \'sign\')');
        return;
    }
    let memberrole = guild.roles.cache.get(config.roles.Member);
    if (!guildmember.roles.cache.has(memberrole)) {
        guildmember.roles.add(memberrole);
        logs.add('signed', user.tag, "");
    }
}
/**
 * @param  {int} memberid
 * @param  {Discord.GuildMember} banner
 * @param  {string} reason=null
 */
function ban(memberid, banner, reason = null) {
    if (is_mod_or_admin(banner)) {
        let guildmember = banner.guild.members.cache.get(memberid);
        guildmember.ban(reason);
        logs.add('banned', banner.tag, guildmember.tag);
    }
}
/**
 * @param  {Discord.Guild} guild
 * @param  {Discord.GuildMember} warner
 * @param  {int} memberid
 * @param  {string} message
 */
function warn(guild, warner, memberid, message) {
    let role = guild.roles.cache.get(config.roles.Warned);
    let member = guild.members.cache.get(memberid);
    if (!member.roles.cache.has(role.id)) {
        member.roles.add(role);
    } else {
        debugchan.send(member.user.tag + ' : ' + lang.getstring('alreadywarned'));
    }
}
/**
 * @param  {Discord.TextChannel} chan
 * @param  {int} nb
 */
function clean(chan, nb) {
    chan.fetchMessages({limit: nb}).then(messages => messages.forEach(msg => msg.delete()))
}
/**
 * @param  {string} msg
 * @param  {string} authortag
 * @param  {int} userid
 */
function ask(msg, authortag, userid) {
    msg.splice(0, 1);
    msg = msg.join(' ');
    let fields = ['user', 'question', 'validation'];
    let values = [authortag, msg, 0];
    sql.insert_into('questions', fields, values, senddebug, insertquestionaction);
}
/**
 * @param  {*} result
 * @param  {*} fields
 * @param  {*} values
 */
function insertquestionaction(result, fields, values) {
    logs.add('asked', values[0], 'questionid: ' + result.insertId);
    sendquestion(askadminchan, result.insertId, values[0], values[1]);
}
/**
 * @param  {Discord.TextChannel} chan
 * @param  {int} id
 * @param  {string} authortag
 * @param  {string} msg
 */
function sendquestion(chan, id, authortag, msg) {
    chan.send(id + ' - ' + authortag + ' : ' + msg);
}
/**
 * @param  {object} err
 */
function senddebug(err) {
    console.log(err);
    debugchan.send(err.msg);
}
/**
 * @param  {Array} results
 * @param  {*} fields
 */
function validquestion(results, fields) {
    askchan.send(results[0].question);
}

/**
 * @param {int} id
 * @param {Discord.User} author 
 */
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

/**
 * 
 * @param {Discord.User} user 
 * @param {int} time 
 * @param {Discord.TextChannel} channel 
 */
function slow_mo(user, time, channel) {
    channel.setRateLimitPerUser(time);
    if (time !== 0) {
	debugchan.send("Member <@" + user.id + "> started slow-mo mode on channel <#" + channel.id + ">");
	channel.send("Slow motion activated ! You may need help from <@&" + config.roles.Admin + "> or <@&" + config.roles.Modo + "> to disable it !");
    }
}

/**
 * @param {Discord.GuildMember} guildmember 
 * @returns {boolean}
 */
function is_admin(guildmember) {
    return guildmember.roles.cache.has(config.roles.Admin);
}

/**
 * @param {Discord.GuildMember} guildmember 
 * @returns {boolean}
 */
function is_mod(guildmember) {
    return guildmember.roles.cache.has(config.roles.Modo);
}

/**
 * @param {Discord.GuildMember} guildmember 
 * @returns {boolean}
 */
function is_mod_or_admin(guildmember) {
    return (is_admin(guildmember) || is_mod(guildmember));
}
