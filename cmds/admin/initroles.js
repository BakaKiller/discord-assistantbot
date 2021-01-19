const { Command } = require('discord.js-commando');

module.exports = class InitrolesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'initroles',
            group: 'admin',
            memberName: 'initroles',
            description: 'Set which roles is admin, member, warned or moderator !',
            guildOnly: true,
            clientPermissions: ['ADMINISTRATOR'],
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'adminrole',
                    prompt: 'Enter the ***ADMIN*** role id (or 0)',
                    type: 'string'
                },
                {
                    key: 'memberrole',
                    prompt: 'Enter the ***MEMBER*** role id (or 0)',
                    type: 'string'
                },
                {
                    key: 'warnedrole',
                    prompt: 'Enter the ***WARNED*** role id (or 0)',
                    type: 'string'
                },
                {
                    key: 'modorole',
                    prompt: 'Enter the ***MODERATOR*** role id (or 0)',
                    type: 'string'
                },
            ]
        })
    }

    run(message, {adminrole, memberrole, warnedrole, modorole}) {
        console.log(adminrole + memberrole + warnedrole + modorole);
        let roles = {
            "Admin": adminrole,
            "Member": memberrole,
            "Warned": warnedrole,
            "Modo": modorole
        };
        for (let role in roles) {
            if (roles[role] === null || roles[role] === '' || roles[role] === '0') {
                delete roles[role];
            }
        }
        let guild = message.guild;
        if (guild.settings.get('roles') === null) {
            guild.settings.set('roles', {});
        }
        let finalroles = {...guild.settings.get('roles'), ...roles};
        let rolelist = '';
        for (let role in roles) {
            if (rolelist !== '') {
                rolelist += ', ';
            }
            rolelist += role;
        }
        console.log('ok');
        guild.settings.set('roles', finalroles);
        console.log('ok2');
        message.reply('Updated roles ' + rolelist);
    }
}