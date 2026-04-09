import pg from 'pg';
const { Client } = pg;

export async function DB<T = any>(q: string | pg.QueryConfig): Promise<pg.QueryResult> {
    const config: pg.ClientConfig = {
        user: process.env.PGUSER ?? "postgres",
        password: process.env.PGPASSWORD ?? "root",
        host: process.env.PGHOST ?? "127.0.0.1",
        port: 5432,
        database: process.env.PGDATABASE || 'system_promo'
    };
    const client = new Client(config);

    return new Promise(async (resolve, reject) => {
        try {
            await client.connect();
            const result = await client.query(q);
            // console.log(result);
            await client.end();
            resolve(result);
        } catch (err) {
            console.log(err);
            if('log' in global){
                log.error(err);
            }
            await client.end();
            reject(err);
        }
    });
}