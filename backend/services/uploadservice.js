const multer = require('multer');

//feature 4: file upload system*

//multer memory storage*
const storage = multer.memoryStorage();

//file filter to allow only images*
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files allowed!'), false);
  }
};

//multer configuration*
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 //5MB limit*
  }
});

module.exports = {
  upload
};
