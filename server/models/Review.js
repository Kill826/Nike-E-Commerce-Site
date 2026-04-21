const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName:  { type: String, required: true },
    rating:    { type: Number, required: true, min: 1, max: 5 },
    message:   { type: String, required: true, trim: true },
    image:     { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
