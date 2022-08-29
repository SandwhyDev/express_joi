import multer from "multer";
import path from "path";

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadPhoto = multer({ storage: uploadStorage });

export default uploadPhoto;
