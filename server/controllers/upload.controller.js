import pool from '../config/connect-db.js';
import imagekit from '../config/image-kit.js'

const uploadFile = async (req, res) => {
  const carId = req.body.car_id
  const uploads = []
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const allFiles = Object.values(req.files).flat();
    const [binFiles] = await pool.query('select * from file_store where car_id = ?', [carId]);

    for (const file of allFiles) {
      const fileType = file.mimetype.split("/")[0];

      const fileExt = file.originalname.split(".").pop();
      const fileName = file.originalname.split(".")[0] + '-' + Math.floor(Math.random() * 4000 + 1000) + "." + fileExt;

      const uploaded = await imagekit.upload({
        file: file.buffer,
        fileName: fileName,
        folder: `/jk-modules/${fileType === "image" ? 'images' : 'bins'}`
      });

      if (fileType === "image") {
        await pool.query('insert into img_store (car_id,file_id,file_url) values (?,?,?)', [carId, uploaded.fileId, uploaded.url])
      }
      else {
        if (binFiles.length !== 0) {
          await imagekit.deleteFile(binFiles.file_id);
          await pool.query('delete from file_store where car_id = ?', [carId]);
        }
        await pool.query('insert into file_store (file_id,car_id,file_url,file_name,archive_size) values (?,?,?,?,?)', [uploaded.fileId, carId, uploaded.url, fileName, uploaded.size])
      }
      uploads.push(uploaded)
    }

    return res.json({
      success: true,
      message: "File Uploaded",
      result: uploads
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
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