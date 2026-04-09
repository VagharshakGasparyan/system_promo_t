import { DB } from "../components/pg_db.js";

class AllMigration {
    constructor() {
        //
    }

    async up() {
        try{
            //---------create users table------------------------------------
            let q = `CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL
            );`;
            await DB(q);
            //---------create promo table------------------------------------
            q = `CREATE TABLE IF NOT EXISTS promo (
                id SERIAL PRIMARY KEY,
                active BOOLEAN DEFAULT true,
                code VARCHAR(50) UNIQUE NOT NULL,
                p_limit INT NOT NULL CHECK (p_limit > 1),
                expiration_date TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
                );`;
            await DB(q);
            //---------create relation table------------------------------------
            q = `CREATE TABLE IF NOT EXISTS promo_email (
                promo_id INTEGER NOT NULL,
                user_email VARCHAR(255) NOT NULL,
                
                CONSTRAINT fk_promo
                FOREIGN KEY (promo_id)
                REFERENCES promo(id)
                ON DELETE CASCADE,
        
                CONSTRAINT fk_user 
                FOREIGN KEY (user_email) 
                REFERENCES users(email) 
                ON DELETE CASCADE,
                UNIQUE(promo_id, user_email)
            );`;
            await DB(q);


        }catch(err){
            console.log(err);
        }

    }

    async down() {

    }
}

export default AllMigration;