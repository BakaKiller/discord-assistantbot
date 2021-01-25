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
            userPermissions: ['BAN_MEMBERS']
        })
    }

    run(message) {
        const target = message.mentions.users.first();
        if (!target) {
            message.reply("you need to have at least one users mentioned");
            return;
        
        }
        const {guild, content} = message; 
        const member = guild.members.cache.get(target.id);
        if (member.bannable) {
            member.ban({reason: content});
            message.react('✅')
        } else {
            message.react('❌');
        }
    }
}