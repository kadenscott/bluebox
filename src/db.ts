import sqlite3 from 'sqlite3'
import {DATA_DIR} from "./util";

sqlite3.verbose()

let db = new sqlite3.Database(DATA_DIR + "/images.db", (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE image (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            imagename text, 
            filename text,
            creationdate text, 
            CONSTRAINT filename_unique UNIQUE (filename),
            CONSTRAINT imagename_unique UNIQUE (imagename)
            )`,
            (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created, creating some rows
                    const insert = `INSERT INTO image (filename, imagename, creationdate) VALUES (?,?,?)`
                    db.run(insert, ["poop", "poop", new Date().toString()])
                }
            });
    }
});

export default db