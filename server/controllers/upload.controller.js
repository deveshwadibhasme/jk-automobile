import pool from '../config/connect-db.js';
import imagekit from '../config/image-kit.js'

const uploadFile = async (req, res) => {
  const carId = req.body.car_id
  const connection = await pool.getConnection();
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    await connection.beginTransaction();
    const [images] = await pool.query('select * from img_store where car_id = ?', [carId])
    const [binFile] = await pool.query('select * from file_store where car_id = ?', [carId])

    if (images.length !== 0) {
      for (const image of images) {
        if (image && image.file_id) {
          await imagekit.deleteFile(image.file_id)
        }
      }
      await connection.query('delete from img_store where car_id = ?', [carId])
    }
    if (binFile.length !== 0) {
      for (const bin of binFile) {
        if (bin && bin.file_id) {
          await imagekit.deleteFile(bin.file_id)
        }
      }
      await connection.query('delete from file_store where car_id = ?', [carId])
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const fileExt = file.originalname.split(".").pop();
      const fileName = file.originalname.split(".")[0] + '-' + Math.floor(Math.random() * 4000 + 1000) + "." + fileExt;
      const fileType = file.mimetype.split("/")[0]

      const uploaded = await imagekit.upload({
        file: file.buffer,
        fileName: fileName,
        folder: `/jk-modules/${fileType === "image" ? 'images' : 'bins'}`
      });

      if (fileType === "image") {
        await connection.query('insert into img_store (car_id,file_id,file_url) values (?,?,?)', [carId, uploaded.fileId, uploaded.url])
      }
      else {
        await connection.query('insert into file_store (file_id,car_id,file_url,file_name,archive_size) values (?,?,?,?,?)', [uploaded.fileId, carId, uploaded.url, fileName, uploaded.size])
      }

      uploadedFiles.push({ file: uploaded.fileId, url: uploaded.url });
    }
    await connection.commit();

    return res.json({
      success: true,
      message: "File Uploaded",
      files: uploadedFiles
    });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  } finally {
    connection.release();
  }
}

const updateFile = async (req, res) => {
  try {
    const oldFileId = req.params.fileId;

    await imagekit.deleteFile(oldFileId);

    const uploaded = await imagekit.upload({
      file: req.file.buffer,          // buffer from multer
      fileName: req.file.originalname,
      folder: "/jk-modules"
    });

    res.json({
      success: true,
      message: "File updated",
      newUrl: uploaded.url,
      fileId: uploaded.fileId
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Update failed" });
  }
}


export { uploadFile, updateFile }