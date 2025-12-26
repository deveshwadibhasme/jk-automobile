import pool from "../config/connect-db.js";
import imagekit from '../config/image-kit.js'


const downloadBin = async (req, res) => {
    try {
        const { id, order } = req.params;

        const [carFile] = await pool.query('select car_id from car_file where user_id = ?', [id])
        const [file] = await pool.query('select file_url from file_store where car_id = ?', [carFile[0].car_id])

        const [transaction] = await pool.query('select id from transaction where order_id = ?', [order])
        // const [isDownload] = await pool.query('select file_status from car_file where user_id = ?', [id])

        if (transaction.length === 0) {
            return res.status(500).json({ message: 'Payment Has Not Done Yet' });
        }

        // await pool.query('update car_file set file_status = ? where car_id = ?', [true, carFile[0].car_id])

        // if (isDownload[0].file_status) {
        //     return res.status(500).json({ message: 'Payment Expired' });
        // }

        let filePath = '/' + file[0].file_url.split("/").slice(4, 7).join('/')

        const signedUrl = imagekit.url({
            path: filePath,
            signed: true,
            expireSeconds: 600,
        });

        res.json({ url: signedUrl });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Download Error', error: error });
    }
}

const getFileData = async (req, res) => {
    const { id } = req.params

    try {
        const [rows] = await pool.query('select * from file_store where car_id = ?', [id])

        res.status(201).json({ message: 'File data fetched successfully', result: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error });
    }
}

const postFileData = async (req, res) => {

}

export { downloadBin, getFileData, postFileData }