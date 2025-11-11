import pg from "pg"
import dns from 'dns';
import dotenv from "dotenv";
dotenv.config();
dns.setDefaultResultOrder('ipv4first');


const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URI,
    ssl: {
        rejectUnauthorized: false
    }

});


pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});




