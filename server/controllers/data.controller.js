import pool from "../config/connect-db.js";


const postCarList = async (req, res) => {
    const { brand, model, year, module, memory, block_number, file_type, admin_id } = req.body
    const admin = req.user

    if (!brand || !model || !year) {
        return res.status(400).json({ message: "Some fields are required" });
    }

    try {
        const [adminRows] = await pool.query('select id from admin where email = ?', [admin.email])
        const adminId = adminRows[0].id

        await pool.query('insert into car_list (brand, model, year, module, memory, block_number, file_type, admin_id) values(?,?,?,?,?,?,?,?)', [brand, model, year, module, memory, block_number, file_type, adminId])

        res.status(201).json({ message: 'Car data posted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error });
    }
}

const getCarList = async (req, res) => {

    try {
        const [rows] = await pool.query('select * from car_list')

        res.status(201).json({ message: 'Car data fetched successfully', result: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error });
    }
}

export { postCarList,getCarList }