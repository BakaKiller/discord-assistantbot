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
                    type: 'integer'
                }
            ]
        })
    }

    run(message, {nb}) {
        let chan = message.channel;
        if (nb = 0) {
            chan.messages.fetch().then(messages => messages.forEach(msg => msg.delete()))
        } else {
            chan.messages.fetch({limit: nb}).then(messages => messages.forEach(msg => msg.delete()))
        }
    }
}