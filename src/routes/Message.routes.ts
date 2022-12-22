import { Router } from 'express';
import MessageController from '../controllers/MessageController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.route('/').post(protect, MessageController.sendMessage);
router.route('/:chatId').get(protect, MessageController.allMessages);

export = router;
