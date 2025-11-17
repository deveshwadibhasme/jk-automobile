import fs from 'fs'

export async function runQueries(connection) {
    // const sql = fs.readFileSync(`./model/user.model.sql`, 'utf8');

    // const queries = sql.split(';').filter(query => query.trim() !== '');
    // for (const query of queries) {
    //     await connection.query(query);
    // }

    const models = ['admin', 'car_file', 'car_info', 'car_list', 'user', 'otp_store'];

    for (const modelName of models) {
        const sql = fs.readFileSync(`./model/${modelName}.model.sql`, 'utf8');
        const queries = sql.split(';').filter(query => query.trim() !== '');
        for (const query of queries) {
            await connection.query(query);
        }
    }

}