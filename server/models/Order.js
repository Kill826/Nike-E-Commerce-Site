const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: mongoose.Schema.Types.Mixed,
        name:      String,
        price:     Number,
        image:     String,
        size:      mongoose.Schema.Types.Mixed,
        _id:       false,
      },
    ],
    total:           { type: Number, required: true },
    delivery: {
      name:    { type: String, required: true },
      address: { type: String, required: true },
      city:    { type: String, required: true },
      pincode: { type: String, required: true },
      phone:   { type: String, required: true },
    },
    paymentIntentId: { type: String, default: "" },
    paymentMethod:   { type: String, enum: ["online", "cod"], default: "online" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type:    String,
      enum:    ["confirmed", "processing", "shipped", "delivered", "cancelled", "return_requested", "returned"],
      default: "confirmed",
    },
    returnRequest: {
      requestedAt: { type: Date, default: null },
      reason:      { type: String, default: "" },
      approved:    { type: Boolean, default: null }, // null = pending, true = approved, false = rejected
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
