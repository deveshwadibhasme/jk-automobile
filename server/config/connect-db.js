import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()



const pool = mysql.createPool({
    host: process.env.SQL_HOST,
    port: 3306,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    // ssl: {
    //     minVersion: "TLSv1.2"
    // }
})

export default pool
