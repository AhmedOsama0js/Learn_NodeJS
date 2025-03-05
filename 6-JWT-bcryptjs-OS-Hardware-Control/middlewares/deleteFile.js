const fs = require("fs");
const path = require("path");

exports.deleteFile = (filePath) => {
  const normalizedPath = path.join(__dirname, "..", filePath);

  fs.access(normalizedPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File not found ❌", normalizedPath);
      return;
    }

    fs.unlink(normalizedPath, (err) => {
      if (err) console.error("Error deleting file ❌", err);
      else console.log("File deleted successfully ✅");
    });
  });
};
