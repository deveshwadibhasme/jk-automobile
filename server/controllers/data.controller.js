import pool from "../config/connect-db.js";
import imagekit from '../config/image-kit.js'


const dashBoardData = async (req, res) => {
    try {
        const [[totalCars]] = await pool.query("SELECT COUNT(*) AS total FROM car_list");
        const [[totalUsers]] = await pool.query("SELECT COUNT(*) AS total FROM user");
        const [[totalTransactions]] = await pool.query("SELECT COUNT(*) AS total FROM transaction WHERE order_id IS NOT NULL");
        const [[overallEarning]] = await pool.query("SELECT SUM(price) AS total FROM transaction WHERE order_id IS NOT NULL");

        res.status(200).json({
            totalCars: totalCars.total,
            totalUsers: totalUsers.total,
            totalTransactions: totalTransactions.total,
            overallEarning: overallEarning.total || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error });
    }

}

const postCarList = async (req, res) => {
    const { brand, model, year, module, memory, block_number, file_type, admin_id } = req.body
    const admin = req.user

    if (!brand || !model || !year) {
        return res.status(400).json({ message: "Some fields are required" });
    }

    try {
        const [adminRows] = await pool.query('select id from admin where email = ?', [admin.email])
        const adminId = adminRows[0].id

        await pool.query('insert into car_list (brand, model, year, module, memory, block_number, file_type, admin_id) values(?,?,?,?,?,?,?,?)', [brand.toLocaleLowerCase(), model.toLocaleLowerCase(), year, module.toLocaleLowerCase(), memory, block_number, file_type, adminId])

        res.status(201).json({ message: 'Car data posted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error });
    }
}

const editCarList = async (req, res) => {
    const { brand, model, year, module, memory, block_number, file_type, admin_id } = req.body
    const admin = req.user
    const { id } = req.params
    try {
        const [adminRows] = await pool.query('select id from admin where email = ?', [admin.email])
        const adminId = adminRows[0].id

        await pool.query('UPDATE car_list SET brand = ?, model = ?, year = ?, module = ?, memory = ?, block_number = ?, file_type = ?, admin_id = ? WHERE id = ?', [brand.toLocaleLowerCase(), model.toLocaleLowerCase(), year, module.toLocaleLowerCase(), memory, block_number, file_type, adminId, id])

        res.status(201).json({ message: 'Car data update successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error });
    }
}

const getCarList = async (req, res) => {
    const { id, page, limit } = req.params
    let data
    try {
        const offset = (parseInt(page) - 1) * parseInt(limit);
        if (id === 'id') {
            const [[{ total }]] = await pool.query(
                'SELECT COUNT(*) as total FROM car_list'
            );

            if (total < limit) {
                const [rows] = await pool.query('select * from car_list')
                data = rows
                return res.json({
                    message: 'Car Data Fetch Succesfully',
                    result: data,
                })
            }
            const [rows] = await pool.query(
                'SELECT * FROM car_list LIMIT ? OFFSET ?',
                [parseInt(limit), offset]
            );

            return res.json({
                message: 'Car Data Fetch Succesfully',
                result: rows,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / parseInt(limit)),
                }
            })
        } else {
            const [rows] = await pool.query('select * from car_list where id = ?', [id])
            data = rows
            return res.json({
                result: data,
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error });
    }
}

const postModuleData = async (req, res) => {
    const { module_type,
        module_photo,
        sticker_photo,
        km_miles,
        engine_type,
        transmission,
        module_number, note, price } = req.body
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [carList] = await connection.query('select id from car_list where id = ?', [module_number])
        const carId = carList[0].id
        const [carInfo] = await connection.query('select * from car_info where car_id = ?', [module_number])
        const [binFile] = await connection.query('select * from file_store where car_id = ?', [module_number])

        if (module_photo && sticker_photo && carInfo.length === 0) {
            await connection.query(
                `INSERT INTO car_info 
         (module_type, module_photo, sticker_photo, km_miles, engine_type, transmission, module_number, notes, price, car_id)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
                [module_type, module_photo, sticker_photo, km_miles, engine_type, transmission, module_number, note, price, carId]
            );
        }
        else if (module_photo && carInfo.length !== 0) {
            await connection.query(
                `UPDATE car_info 
         SET module_type = ?, module_photo = ?, km_miles = ?, engine_type = ?, transmission = ?, module_number = ? , notes  = ?, price =  ?
         WHERE car_id = ?`,
                [module_type, module_photo, km_miles, engine_type, transmission, module_number, note, price, carId]
            );
        } else if (sticker_photo && carInfo.length !== 0) {
            await connection.query(
                `UPDATE car_info 
         SET module_type = ?, sticker_photo = ?, km_miles = ?, engine_type = ?, transmission = ?, module_number = ?, notes = ?, price = ?
         WHERE car_id = ?`,
                [module_type, sticker_photo, km_miles, engine_type, transmission, module_number, note, price, carId]
            );
        }
        else if (carInfo.length !== 0) {
            await connection.query(
                `UPDATE car_info 
         SET module_type = ?, km_miles = ?, engine_type = ?, transmission = ?, module_number = ?, notes = ?, price = ?
         WHERE car_id = ?`,
                [module_type, km_miles, engine_type, transmission, module_number, note, price, carId]
            );
        }
        if (binFile.length !== 0) {
            await connection.query('update file_store set file_price = ?, file_number = ? where car_id = ?', [price, carId, carId])
        }

        await connection.commit();
        res.status(201).json({ message: 'Modules data posted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error });
    } finally {
        connection.release();
    }
}

const getModuleData = async (req, res) => {
    const { id } = req.params

    try {
        const [rows] = await pool.query('select * from car_info where car_id = ?', [id])

        res.status(201).json({ message: 'Module data fetched successfully', result: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error });
    }
}

const deleteCarData = async (req, res) => {
    const { id } = req.params
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [images] = await connection.query('select * from img_store where car_id = ?', [id])

        for (const image of images) {
            await imagekit.deleteFile(image.file_id)
        }

        await connection.query('delete from car_info where car_id = ?', [id])
        await connection.query('delete from img_store where car_id = ?', [id])
        await connection.query('delete from file_store where car_id = ?', [id])
        await connection.query('delete from car_list where id = ?', [id])

        await connection.commit();
        res.status(201).json({ message: 'Car data delete successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error });
    } finally {
        connection.release();
    }
}

export { postCarList, getCarList, editCarList, postModuleData, getModuleData, deleteCarData, dashBoardData }