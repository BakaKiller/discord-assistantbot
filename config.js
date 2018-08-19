const EventEmitter = require('events');
const jsonfile = require('jsonfile');

class Settings extends EventEmitter{
    constructor() {
        super();
        this.Roles = {};
        this.Prefix = '/';
        this.Token = '';
        this.Welcomechan = '';
        this.Helpintro = '';
        this.Helpoutro = '';
        this.Debugchan = '';
        this.Welcome = '';
        this.Goodbye = '';
        let self = this;
        jsonfile.readFile('config.json', function (err, obj) {
            if (err) {
                console.log(err.message);
            } else {
                self.Roles = obj.roles;
                self.Prefix = obj.prefix;
                self.Token = obj.token;
                self.Welcomechan = obj.welcomechan;
                self.Helpintro = obj.helpintro;
                self.Helpoutro = obj.helpoutro;
                self.Debugchan = obj.debugchan;
                self.Welcome = obj.welcomemessage;
                self.Goodbye = obj.goodbyemessage;
                self.emit('ready');
            }
        });
    }

    save() {
        let settings = {
            "prefix": this.Prefix,
            "roles": this.Roles,
            "token": this.Token,
            "welcomechan": this.Welcomechan,
            "helpintro": this.Helpintro,
            "helpoutro": this.Helpoutro,
            "jsonaddress": this.Debugchan,
            "welcomemessage": this.Welcome,
            "goodbyemessage": this.Goodbye
        };
        jsonfile.writeFile('settings.json', settings, function (err) {
            if (err) {
                console.log(err.message);
            }
        });
    }

    set prefix(value) {
        this.Prefix = value;
        this.save();
    }

    get prefix() {
        return this.Prefix;
    }

    set roles(value) {
        this.Roles = value;
        this.save();
    }

    get roles() {
        return this.Roles;
    }

    set token(value) {
        this.Token = value;
        this.save();
    }

    get token() {
        return this.Token;
    }

    set welcomechan(value) {
        this.Welcomechan = value;
        this.save();
    }

    get welcomechan() {
        return this.Welcomechan;
    }

    set helpintro(value) {
        this.Helpintro = value;
        this.save();
    }

    get helpintro() {
        return this.Helpintro;
    }

    set helpoutro(value) {
        this.Helpoutro = value;
        this.save();
    }

    get helpoutro() {
        return this.Helpoutro;
    }

    set debugchan(value) {
        this.Debugchan = value;
        this.save();
    }

    get debugchan() {
        return this.Debugchan;
    }

    set welcome(value) {
        this.Welcome = value;
        this.save();
    }

    get welcome() {
        return this.Welcome;
    }

    set goodbye(value) {
        this.Goodbye = value;
        this.save();
    }

    get goodbye() {
        return this.Goodbye;
    }
}

let config = new Settings();

module.exports = config;