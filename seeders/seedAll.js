const {DB} = require("../components/pg_db");

class AllSeed {
    constructor() {
        //
    }

    async up() {
        try{
            //---------add users------------------------------------
            let q = `INSERT INTO users (username, email)
                     VALUES
                         ('Ivan', 'ivan@example.com'),
                         ('Maria', 'maria@example.com'),
                         ('Alex', 'alex@example.com'),
                         ('Valya', 'valya@example.com'),
                         ('Katya', 'katya@example.com'),
                         ('Petya', 'petya@example.com'),
                         ('Grisha', 'grisha@example.com'),
                         ('Yura', 'yura@example.com'),
                         ('John', 'john@example.com'),
                         ('Alla', 'alla@example.com')
                         ON CONFLICT (email) DO NOTHING;`;
            await DB(q);

        }catch(err){
            console.log(err);
        }

    }

    async down() {

    }
}module.exports = AllSeed;