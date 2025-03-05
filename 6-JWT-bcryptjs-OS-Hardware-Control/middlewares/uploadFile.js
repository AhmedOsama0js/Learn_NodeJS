const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("Only images allowed", 400));
    }
  };
  return multer({ storage: multerStorage, fileFilter: multerFilter });
};

exports.uploadSignalImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadALotOfImages = (fieldsArray) =>
  multerOptions().fields(fieldsArray);

exports.resizeImg = (moduleName) =>
  catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    const fileName = `${moduleName}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.webp`;

    const uploadPath = `uploads/${moduleName}`;
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("webp")
      .webp({ quality: 80 })
      .toFile(`${uploadPath}/${fileName}`);

    req.body.image = fileName;
    next();
  });
