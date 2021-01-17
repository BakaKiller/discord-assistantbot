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
        message.delete()
    }
}