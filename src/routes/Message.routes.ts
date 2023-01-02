import { Router } from 'express';
import MessageController from '../controllers/MessageController';
import { protect } from '../middlewares/authMiddleware';
import multer from 'multer';
import { multerError } from '../middlewares/multerErrorMiddleware';

const router = Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const { originalname } = file;
//     cb(null, `${uuidv4()}-${originalname}`);
//   },
// });

const storage = multer.memoryStorage();

//? File size limit = 5mb
const upload = multer({ storage, limits: { fileSize: 5000000 } });

router.route('/').post(protect, MessageController.sendMessage);
router.route('/:chatId').get(protect, MessageController.allMessages);
router
  .route('/upload')
  .post(
    protect,
    upload.array('file'),
    multerError,
    MessageController.uploadFiles
  );
router
  .route('/check')
  .post(protect, upload.single('file'), MessageController.checkBucket);

export = router;
