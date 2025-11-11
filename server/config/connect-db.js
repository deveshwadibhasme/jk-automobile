import mysql from 'mysql2/promise'

const pool =  mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '120305',
    database: 'jk_automobile'
})

export default pool
