const { Command } = require('discord.js-commando');

module.exports = class UnslowmoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unslowmo',
            group: 'member',
            memberName: 'unslowmo',
            description: 'Get back to normal speed',
            guildOnly: true,
            clientPermissions: ['ADMINISTRATOR'],
            userPermissions: ['MANAGE_CHANNELS']
        })
    }

    run(message) {
        message.channel.setRateLimitPerUser(0);
    }
}