const EventEmitter = require('events');
const jsonfile = require('jsonfile');

class Settings extends EventEmitter{
    constructor() {
        super();
        this.Roles = {};
        this.Prefix = '/';
        this.Token = '';
        this.Helpintro = '';
        this.Helpoutro = '';
        this.Debugchan = '';
        this.Dbhost = '';
        this.Dbname = '';
        this.Dbuser = '';
        this.Dbpwd = '';
        this.Lang = '';
        let self = this;
        jsonfile.readFile('config.json', function (err, obj) {
            if (err) {
                console.log(err.message);
            } else {
                self.Roles = obj.roles;
                self.Prefix = obj.prefix;
                self.Token = obj.token;
                self.Helpintro = obj.helpintro;
                self.Helpoutro = obj.helpoutro;
                self.Debugchan = obj.debugchan;
                self.Lang = obj.lang;
                self.Dbhost = obj.dbhost;
                self.Dbname = obj.dbname;
                self.Dbuser = obj.dbuser;
                self.Dbpwd = obj.dbpwd;
                self.emit('ready');
            }
        });
    }

    save() {
        let settings = {
            "roles": this.Roles,
            "prefix": this.Prefix,
            "token": this.Token,
            "helpintro": this.Helpintro,
            "helpoutro": this.Helpoutro,
            "debugchan": this.Debugchan,
            "lang": this.Lang,
            "dbhost": this.Dbhost,
            "dbname": this.Dbname,
            "dbuser": this.Dbuser,
            "dbpwd": this.Dbpwd
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

    set lang(value) {
        this.Lang = value;
        this.save();
    }

    get lang() {
        return this.Lang;
    }

    set dbhost(value) {
        this.Dbhost = value;
        this.save();
    }

    get dbhost() {
        return this.Dbhost;
    }

    set dbname(value) {
        this.Dbname = value;
        this.save();
    }

    get dbname() {
        return this.Dbname;
    }

    set dbuser(value) {
        this.Dbuser = value;
        this.save();
    }

    get dbuser() {
        return this.Dbuser;
    }

    set dbpwd(value) {
        this.Dbpwd = value;
        this.save();
    }

    get dbpwd() {
        return this.Dbpwd;
    }
}

let config = new Settings();

module.exports = config;