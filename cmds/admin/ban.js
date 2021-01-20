const { Command } = require('discord.js-commando');

module.exports = class BanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            group: 'admin',
            memberName: 'ban',
            description: 'Ban a user',
            guildOnly: true,
            clientPermissions: ['ADMINISTRATOR'],
            userPermissions: ['BAN_MEMBERS'],
            args: [
                {
                    key: 'user',
                    prompt: 'Who should be ban ?',
                    type: 'member'
                },
                {
                    key: 'reason',
                    prompt: 'Why is this person banned ?',
                    type: 'member',
                    default: '(who cares I am the boss here lmao)'
                },
            ]
        })
    }

    run(message, {user, reason}) {
        user.ban(reason);
    }
}