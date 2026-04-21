const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    price:       { type: Number, required: true, min: 0 },
    image:       { type: String, required: true },
    images:      { type: [String], default: [] },
    gender:      { type: String, enum: ["men", "women", "kids"], required: true },
    type:        { type: String, enum: ["shoes", "clothing", "accessories"], required: true },
    category:    { type: String, default: "" },
    tag:         { type: String, default: null },
    season:      { type: String, enum: ["summer", "winter", "all-season"], default: "all-season" },
    sizes:       { type: [mongoose.Schema.Types.Mixed], default: [] },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
