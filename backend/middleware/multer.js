import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

/*
-----------------------------------------
 TEMP UPLOAD DIRECTORY
-----------------------------------------
We store uploaded files temporarily before
sending them to Cloudinary.

Example folder:
Server/public/temp
*/

// Resolve __dirname in ESM so uploads are anchored to this file.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.resolve(__dirname, "../public/temp");

/*
-----------------------------------------
 ENSURE DIRECTORY EXISTS
-----------------------------------------
If the folder does not exist, create it.
This prevents ENOENT errors during upload.
*/

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

/*
-----------------------------------------
 MULTER STORAGE CONFIGURATION
-----------------------------------------
destination:
  where files will be stored temporarily

filename:
  unique file name to avoid collisions
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

/*
-----------------------------------------
 MULTER INSTANCE
-----------------------------------------
Handles multipart/form-data uploads
*/

const upload = multer({ storage });

export default upload;
export { upload };