import fs from 'fs'

export async function runQueries(connection) {
    // const sql = fs.readFileSync(`./model/user.model.sql`, 'utf8');

    // const queries = sql.split(';').filter(query => query.trim() !== '');
    // for (const query of queries) {
    //     await connection.query(query);
    // }

    const models = ['admin', 'user', 'car_list', 'car_info', 'car_file'];

    for (const modelName of models) {
        const sql = fs.readFileSync(`./model/${modelName}.model.sql`, 'utf8');
        const queries = sql.split(';').filter(query => query.trim() !== '');
        for (const query of queries) {
            await connection.query(query);
        }
    }

}