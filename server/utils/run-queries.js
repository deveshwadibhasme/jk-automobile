import fs from 'fs'

export async function runQueries(connection) {
    // const sql = fs.readFileSync(`./model/user.model.sql`, 'utf8');

    // const queries = sql.split(';').filter(query => query.trim() !== '');
    // for (const query of queries) {
    // const run = await connection.query('select id from file_store where car_id = 7');
    // console.log(run);
    // }

    const models = ['admin', 'user', 'car_list', 'car_info', 'car_file', 'otp_store', 'img_store', 'transaction'];

    for (const modelName of models) {
        const sql = fs.readFileSync(`./model/${modelName}.model.sql`, 'utf8');
        const queries = sql.split(';').filter(query => query.trim() !== '');
        for (const query of queries) {
            await connection.query(query);
        }
    }

}