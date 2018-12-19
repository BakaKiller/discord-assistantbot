const EventEmitter = require('events');

class Lang extends EventEmitter {
    constructor() {
        super();
        this.Langs = ['en', 'fr'];
        this.CurrentLang = null;
        this.Translations = {
            'en': {
                'loggedas': 'Logged in as [#0]!',
                'alreadywarned': 'This user has already been warned. You may consider being rougher ?',
                'cantvalid': 'You are not allowed to valid a question ! This will be reported.',
                'triedtovalid': 'You are not allowed to valid a question ! This will be reported.',
                'alreadyvalid': 'Question [#0] is already valid !'
            },
            'fr': {
                'loggedas': 'Connecté en tant que [#0]!',
                'alreadywarned': 'Cet·te utilisateurice a déjà été averti·e. Vous devriez penser à être plus violent·e ?',
                'cantvalid': 'Vous ne pouvez pas valider une question ! Ceci sera signalé.',
                'triedtovalid': 'Vous ne pouvez pas valider une question ! Ceci sera signalé.',
                'alreadyvalid': 'Question [#0] déjà validée !'
            }
        };
    }

    get langs() {
        return this.Langs;
    }

    get currentlang() {
        return this.CurrentLang;
    }

    set currentlang(newlang) {
        return this.changelang(newlang);
    }

    get translations() {
        return this.Translations;
    }

    changelang(newlang) {
        if (this.CurrentLang === null) {
            this.CurrentLang = 'en';
        }

        if (this.Langs.includes(newlang)) {
            this.CurrentLang = newlang;
        }
    }

    getstring(key, bonus = null) {
        let text;
        if (!this.Translations[this.CurrentLang].hasOwnProperty(key)) {
            if (!this.Translations.en.hasOwnProperty(key)) {
                return '[[' + key + ']]';
            } else {
                text = this.Translations.en[key];
            }
        } else {
            text = this.Translations[this.CurrentLang][key];
        }
        if (bonus !== null) {
            if (Array.isArray(bonus)) {
                for (let i = 0; i < bonus.length; i++) {
                    text = text.replace('[#' + i + ']', bonus[i]);
                }
            } else if (typeof bonus === 'object') {
                for (let index in bonus) {
                    if (bonus.hasOwnProperty(index)) {
                        text = text.replace('[#' + index + ']', bonus[index]);
                    }
                }
            } else if (typeof bonus === "string") {
                text = text.replace('[#0]', bonus);
            }
        }
        return text;
    }

    init(lang = 'en') {
        this.changelang(lang);
        this.emit('ready');
    }
}

module.exports = Lang;