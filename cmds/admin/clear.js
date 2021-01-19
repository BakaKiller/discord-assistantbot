const { Command } = require('discord.js-commando');

module.exports = class ClearCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            group: 'admin',
            memberName: 'clear',
            description: 'Removes x messages from current chan',
            guildOnly: true,
            clientPermissions: ['ADMINISTRATOR'],
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'nb',
                    prompt: 'How many messages should be erased ?',
                    type: 'int'
                }
            ]
        })
    }

    run(message, {nb}) {
        chan = message.channel;
        chan.fetchMessages({limit: nb}).then(messages => messages.forEach(msg => msg.delete()))
    }
}