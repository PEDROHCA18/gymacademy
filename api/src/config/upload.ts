import multer, { FileFilterCallback } from 'multer';

const upload = multer({
  dest: 'gym-prime/',
  fileFilter: (req, file, cb: FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          'Tipo de arquivo inválido. Aceitamos apenas JPEG, PNG, WEBP, JPG e GIF.'
        )
      );
    }
    cb(null, true);
  },
});

export const uploadMultiple = upload.array('images', 10); 

export default upload;

