import multer from "multer";

// -------------> Handle Upcoming multipart/for-data <------------------

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 },
});

export default upload.single("file");
