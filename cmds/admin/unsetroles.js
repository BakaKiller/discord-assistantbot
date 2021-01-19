const { Command } = require('discord.js-commando');

module.exports = class UnsetrolesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unsetroles',
            group: 'admin',
            memberName: 'unsetroles',
            description: 'Reset roles !!! Be carefull !!!',
            guildOnly: true,
            clientPermissions: ['ADMINISTRATOR'],
            userPermissions: ['ADMINISTRATOR']
        })
    }

    run(message) {
        guild.settings.set('roles', {});
        message.reply('Roles are unset, please send `' + message.guild.settings.get('prefix') + 'initroles` !');
    }
}