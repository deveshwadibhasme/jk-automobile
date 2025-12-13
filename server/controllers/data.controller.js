import pool from "../config/connect-db.js";
import imagekit from '../config/image-kit.js'

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
    const { id } = req.params
    let data

    try {
        if (id === 'id') {
            const [rows] = await pool.query('select * from car_list')
            data = rows
        } else {
            const [rows] = await pool.query('select * from car_list where id = ?', [id])
            data = rows
        }

        res.status(201).json({ message: 'Car data fetched successfully', result: data });
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
        module_number } = req.body

    try {
        const [carList] = await pool.query('select id from car_list where id = ?', [module_number])
        const carId = carList[0].id
        const [images] = await pool.query('select * from img_store where car_id = ?', [module_number])

        if (!module_photo,
            !sticker_photo) {
            for (const image of images) {
                await imagekit.deleteFile(image.fileId)
            }
        }

        await pool.query('insert into car_info (module_type,module_photo,sticker_photo,km_miles,engine_type,transmission,module_number, car_id) values(?,?,?,?,?,?,?,?)', [module_type, module_photo, sticker_photo, km_miles, engine_type, transmission, module_number, carId])

        res.status(201).json({ message: 'Modules data posted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error });
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
    try {
        const [images] = await pool.query('select * from img_store where car_id = ?', [id])

        for (const image of images) {
            await imagekit.deleteFile(image.file_id)
        }

        await pool.query('delete from car_info where car_id = ?', [id])
        await pool.query('delete from img_store where car_id = ?', [id])
        await pool.query('delete from car_list where id = ?', [id])

        res.status(201).json({ message: 'Car data delete successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error });
    }
}

export { postCarList, getCarList, editCarList, postModuleData, getModuleData, deleteCarData }