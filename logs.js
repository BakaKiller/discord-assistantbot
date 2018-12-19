class Log {
    constructor(db) {
        this.db = db;
    }
    add(action, senderid, parameters) {
        let fields = ['action', 'senderid', 'parameters', 'time'];
        let values = [action, senderid, parameters, new Date().getTime() / 1000 | 0];
        this.db.insert_into('bot_logs', fields, values, adderror, addok);
    }
}

function adderror(err) {
    console.log(err);
}

function addok(result, fields, values) {
    console.log('Log ' + result.insertId + ' has been successfully added');
}

module.exports = Log;