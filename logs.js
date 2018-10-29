const mysql = require('mysql');
const config = require('./config.js');
config.on('ready', () => {

    let db = mysql.createConnection({
        host: config.dbhost,
        user: config.dbuser,
        password: config.dbpwd,
        database: config.dbname
    });

    db.connect((err) => {
        if (err) {
            console.log(err.message);
        }
    });

    class Log {
        constructor(id = null) {
            if (id !== null) {
                let self = this;
                db.query('SELECT * FROM bot_logs WHERE id = ' + id, (error, results) => {
                    if (error) {
                        console.log(error.message);
                    } else if (results) {
                        self.Id = results[0].id;
                        self.Action = results[0].id;
                        self.Senderid = results[0].id;
                        self.Parameters = results[0].id;
                        self.Time = results[0].id;
                    }
                })
            } else {
                this.Id = null;
                this.Action = null;
                this.Senderid = null;
                this.Parameters = null;
                this.Time = new Date().getTime();
            }
        }

        get id() {
            return this.Id;
        }

        set id(value) {
            this.Id = value;
        }

        get action() {
            return this.Action;
        }

        set action(value) {
            this.Action = value;
        }

        get senderid() {
            return this.Senderid;
        }

        set senderid(value) {
            this.Senderid = value;
        }

        get parameters() {
            return this.Parameters;
        }

        set parameters(value) {
            this.Parameters = value;
        }

        get time() {
            return this.Time;
        }

        set time(value) {
            this.Time= value;
        }

        save() {
            if (this.id !== null) {
                let query = 'UPDATE bot_logs ';
                query += 'SET action = \'' + this.Action + '\', ';
                query += 'senderid = ' + this.Senderid + ', ';
                query += 'parameters = \'' + this.Parameters + '\', ';
                query += 'time = ' + (new Date().getTime());
                db.query(query);
            } else {
                let query = 'INSERT INTO bot_logs (action, senderid, parameters, time) ';
                query += 'VALUES ( \'' + this.Action + '\', ';
                query += 'senderid = ' + this.Senderid + ', ';
                query += 'parameters = \'' + this.Parameters + '\', ';
                query += 'time = ' + (new Date().getTime()) + ')';
                db.query(query);
            }
        }
    }

    module.exports = Logs;
});