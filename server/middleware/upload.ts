import multer from 'multer'
import path from 'path'

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (_req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase()
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("Only JPG, JPEG and PNG files are allowed"))
      return
    }
    cb(null, true)
  },
  limits: {
    fileSize: 5 * 1024 * 1024, 
  }
})

export default upload