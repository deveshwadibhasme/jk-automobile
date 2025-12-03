import imagekit from '../config/image-kit.js'

const uploadFile = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const uploadedFiles = [];

        for (const file of req.files) {
            const fileExt = file.originalname.split(".").pop();
            const fileName = file.originalname.split(".")[0] + '-' + Math.floor(Math.random() * 4000 + 1000) + "." + fileExt;

            const uploaded = await imagekit.upload({
                file: file.buffer,
                fileName: fileName,
                folder: "/jk-modules"
            });
            uploadedFiles.push({ file:uploaded, url:uploaded.url });
        }

        return res.json({
            success: true,
            message:"File Uploaded",
            files: uploadedFiles
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


export { uploadFile , updateFile }