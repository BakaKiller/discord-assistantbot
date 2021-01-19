const { Command } = require('discord.js-commando');

module.exports = class SignCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'sign',
            group: 'member',
            memberName: 'sign',
            description: 'Accept the rules and be part of the community !',
            guildOnly: true,
            clientPermissions: ['ADMINISTRATOR']
        })
    }

    run(message) {
        let guild = message.guild;
        let user = message.guildmember.user;
        if (!user instanceof Discord.User) {
            guild.channels.cache.get(guild.settings.get('chans').debugchan).send('User is not a User (function \'sign\')');
            return;
        }
        let memberrole = guild.roles.cache.get(guild.settings.get('roles').Member);
        if (!message.guildmember.roles.cache.has(memberrole)) {
            message.guildmember.roles.add(memberrole);
        }
        message.delete()
    }
}