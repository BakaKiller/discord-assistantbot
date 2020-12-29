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
        this.Askchan = '';
        this.Askadminchan = '';
        this.Dbhost = '';
        this.Dbname = '';
        this.Dbuser = '';
        this.Dbpwd = '';
        this.Lang = '';
        this.Timezone = '';
        this.make_config(self);
    }

    make_config(self) {
        jsonfile.readFile('config.json', function (err, obj) {
            if (err) {
                console.log(err.message);
            } else {
                self.Roles = process.env.ENV_ROLES || obj.roles;
                self.Prefix = process.env.ENV_PREFIX || obj.prefix;
                self.Token = process.env.ENV_TOKEN || obj.token;
                self.Helpintro = process.env.ENV_HELPINTRO || obj.helpintro;
                self.Helpoutro = process.env.ENV_HELPOUTRO || obj.helpoutro;
                self.Debugchan = process.env.ENV_DEBUGCHAN || obj.debugchan;
                self.Askchan = process.env.ENV_ASKCHAN || obj.askchan;
                self.Askadminchan = process.env.ENV_ASKADMINCHAN || obj.askadminchan;
                self.Lang = process.env.ENV_LANG || obj.lang;
                self.Dbhost = process.env.ENV_DBHOST || obj.dbhost;
                self.Dbname = process.env.ENV_DBNAME || obj.dbname;
                self.Dbuser = process.env.ENV_DBUSER || obj.dbuser;
                self.Dbpwd = process.env.ENV_DBPWD || obj.dbpwd;
                self.Timezone = process.env.ENV_TIMEZONE || obj.timezone;
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
            "askchan": this.Askchan,
            "askadminchan": this.Askadminchan,
            "lang": this.Lang,
            "dbhost": this.Dbhost,
            "dbname": this.Dbname,
            "dbuser": this.Dbuser,
            "dbpwd": this.Dbpwd,
            "timezone": this.Timezone
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

    set askchan(value) {
        this.Askchan = value;
        this.save();
    }

    get askchan() {
        return this.Askchan;
    }

    set askadminchan(value) {
        this.Askadminchan = value;
        this.save();
    }

    get askadminchan() {
        return this.Askadminchan;
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

    set timezone(value) {
        this.Timezone = value;
        this.save();
    }

    get timezone() {
        return this.Timezone;
    }
}

let config = new Settings();

module.exports = config;