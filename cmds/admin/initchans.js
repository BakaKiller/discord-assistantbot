const { Command } = require('discord.js-commando');

module.exports = class InitchansCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'initchans',
            group: 'admin',
            memberName: 'initchans',
            description: 'Init the important chans of your discord',
            guildOnly: true,
            clientPermissions: ['ADMINISTRATOR'],
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'debugchan',
                    prompt: 'Enter the debug chan id (or 0)',
                    type: 'string'
                },
                {
                    key: 'askchan',
                    prompt: 'Enter the ask chan id (or 0)',
                    type: 'string'
                },
                {
                    key: 'askadminchan',
                    prompt: 'Enter the admin side ask chan id (or 0)',
                    type: 'string'
                }
            ]
        })
    }

    run(message, debugchan, askchan, askadminchan) {
        let chans = {
            "debug": debugchan,
            "ask": askchan,
            "askadmin": askadminchan
        };
        for (let chan in chans) {
            if (chans[chan] === null || chans[chan] === '' || chans[chan] === '0') {
                delete chans[chan];
            }
        }
        let guild = message.guild;
        if (guild.settings.get('chans') === null) {
            guild.settings.set('chans', {});
        }
        let finalchans = {...guild.settings.get('chans'), ...chans};
        let chanlist = '';
        for (let chan in chans) {
            if (chanlist !== '') {
                chanlist += ', ';
            }
            chanlist += chan;
        }
        console.log('ok');
        guild.settings.set('chans', finalchans);
        console.log('ok2');
        message.reply('Updated chans ' + chanlist);
    }
}