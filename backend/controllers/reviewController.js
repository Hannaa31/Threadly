import reviewModel from '../models/reviewModel.js';
import mongoose from 'mongoose'

export const addOrUpdateReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;
    const userId = req.userId;

    if (!rating || !comment || !productId) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const existing = await reviewModel.findOne({ userId, productId });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.status(200).json({ success: true, message: 'Review updated' });
    }

    await reviewModel.create({ userId, productId, rating, comment });
    res.status(201).json({ success: true, message: 'Review added' });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid productId format' });
    }

    const reviews = await reviewModel.find({ productId }).populate({path: 'userId',
        select: 'name',
        strictPopulate: false}).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err)
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};
