const EventEmitter = require('events');

class mysql_simplifier extends EventEmitter{
    constructor(con) {
        super();
        this.q = con;
    }

    select_one_from(table, fields, where, onerr, action) {

    }

    select_from(table, fields, where, onerr, action) {
        let fieldlist = '';
        if (typeof fields === typeof undefined) {
            fieldlist += '*';
        } else if (typeof fields === typeof []) {
            for (let field in fields) {
                if (fieldlist !== '') {
                    fieldlist += ', ';
                }
                fieldlist += fields[field];
            }
        }
        if (fieldlist === '') {
            throw new Error('No table given !');
        }

        let query = 'SELECT ' + fieldlist + ' FROM ' + table;
        let cond = '';
        if (typeof where === typeof {}) {
            for (let row in where) {
                if (cond !== '') {
                    cond += ' AND ';
                } else {
                    cond += 'WHERE '
                }
                cond += row + ' = ' + where[row];
            }
        }
        if (cond !== '') {
            query += ' ' + cond;
        }
        query += ';';
        this.q.query(query, function (err, results, fields) {
            if (err && typeof onerr !== typeof undefined) {
                onerr(err);
            } else if (typeof action !== typeof undefined) {
                action(results, fields);
            }
        })
    }

    insert_into(table, fields, values, onerr, action) {
        let query = 'INSERT INTO ' + table + '(';
        let fieldlist = '';
        for (let field in fields) {
            if (fieldlist !== '') {
                fieldlist += ', ';
            }
            fieldlist += fields[field];
        }
        query += fieldlist + ') VALUES (';
        let vallist = '';
        for (let val in values) {
            if (vallist !== '') {
                vallist += ', ';
            }
            if (is_numeric(values[val])) {
                vallist += values[val];
            } else {
                vallist += '"' + mysql_real_escape_string(values[val]) + '"'
            }
        }
        query += vallist + ');';
        this.q.query(query, function(err, result) {
            if (err && typeof onerr !== typeof undefined) {
                onerr(err)
            } else if (typeof action !== typeof undefined) {
                action(result, fields, values);
            }
        });
    }
}

module.exports = mysql_simplifier;

function mysql_real_escape_string(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}

function is_numeric(nb) {
    return !Number.isNaN(Number.parseFloat(nb)) && Number.isFinite(nb);
}