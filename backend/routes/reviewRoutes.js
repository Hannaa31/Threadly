import express from 'express';
import { addOrUpdateReview, getReviewsByProduct } from '../controllers/reviewController.js';
import authUser from '../middleware/auth.js';


const router = express.Router();

router.post('/add', authUser, addOrUpdateReview);
router.get('/:productId', getReviewsByProduct);

export default router;
