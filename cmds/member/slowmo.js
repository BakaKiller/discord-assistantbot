const { Command } = require('discord.js-commando');

module.exports = class SlowmoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'slowmo',
            group: 'member',
            memberName: 'slowmo',
            description: 'Slow doooooown',
            guildOnly: true,
            clientPermissions: ['ADMINISTRATOR'],
        })
    }

    run(message) {
        message.channel.setRateLimitPerUser(30);
        let chans = message.guild.settings.get('chans');
        let roles = message.guild.settings.get('roles');
        message.guild.channel.cache.get(chans.debug).send(
            "Member <@" + message.user.id + "> started slow-mo mode on channel <#" + message.channel.id + ">"
        );
	    message.channel.send("Slow motion activated ! You may need help from <@&" + roles.Admin + "> or <@&" + roles.Modo + "> to disable it !");
    }
}