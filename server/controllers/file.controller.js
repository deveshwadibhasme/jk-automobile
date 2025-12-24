import pool from "../config/connect-db.js";


const downloadBin = async (req,res) => {
    
}

const getFileData = async (req,res) => {
    const { id } = req.params

    try {
        const [rows] = await pool.query('select * from file_store where car_id = ?', [id])

        res.status(201).json({ message: 'File data fetched successfully', result: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error });
    }
}

const postFileData = async (req,res) => {

}

export { downloadBin, getFileData, postFileData }