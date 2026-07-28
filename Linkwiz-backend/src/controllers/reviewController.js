import Review from "../models/Review.js";

export const addReview = async (req, res) => {
  const { rating, comment, service } = req.body;

  try {
    const review = await Review.create({
      reviewer: req.user,
      rating,
      comment,
      service
    });

    res.json(review);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getReviewsForService = async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate("reviewer");

    res.json(reviews);
  } catch (err) {
    res.status(500).json(err);
  }
};