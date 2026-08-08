import express from 'express';
import multer from 'multer';
import path from 'path';
import { createPrescription, getPrescriptions, uploadLabReport, getLabReports } from './records.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Multer config for file uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

function checkFileType(file, cb) {
  const filetypes = /pdf|jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images and PDFs only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// Prescription routes
router.route('/prescriptions')
  .post(protect, createPrescription)
  .get(protect, getPrescriptions);

// Lab Report routes
router.route('/reports')
  .post(protect, upload.single('report'), uploadLabReport)
  .get(protect, getLabReports);

export default router;
