const { Command } = require('discord.js-commando');

module.exports = class InitrolesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'init',
            group: 'admin',
            memberName: 'init',
            description: 'Accept the rules and be part of the community !',
            guildOnly: true,
            clientPermissions: ['ADMINISTRATOR'],
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'adminrole',
                    prompt: 'Enter the admin role id (or 0)',
                    type: 'string'
                },
                {
                    key: 'memberrole',
                    prompt: 'Enter the member role id (or 0)',
                    type: 'string'
                },
                {
                    key: 'warnedrole',
                    prompt: 'Enter the warned role id (or 0)',
                    type: 'string'
                },
                {
                    key: 'modorole',
                    prompt: 'Enter the modo role id (or 0)',
                    type: 'string'
                },
            ]
        })
    }

    run(message, adminrole, memberrole, warnedrole, modorole) {
        let roles = {
            Admin: adminrole,
            Member: memberrole,
            Warned: warnedrole,
            Modo: modorole
        };
        for (let role in roles) {
            if (roles[role] === null || roles[role] === '' || roles[role] === '0') {
                delete roles[role];
            }
        }
        let guild = message.guild;
        if (guild.settings.get('roles') === null) {
            let rolesset = {};
            guild.settings.set('roles', rolesset);
        }
        let finalroles = guild.settings.get('roles');
        let rolelist = '';
        for (let role in roles) {
            finalroles[role] = roles[role];
            if (rolelist !== '') {
                rolelist += ', ';
            }
            rolelist += role;
        }
        guild.settings.set('roles', finalroles);

        message.reply('Updated roles ' + rolelist);
    }
}