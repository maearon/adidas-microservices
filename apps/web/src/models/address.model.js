export const runtime = "nodejs";
import mongoose from "mongoose";

const { Schema } = mongoose;

const AddressSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    street: {
      type: String,
      required: true,
      trim: true,
    },
    apartment: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      default: "US",
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["delivery", "billing", "both"],
      default: "delivery",
    },
    latitude: Number,
    longitude: Number,
    formattedAddress: String,
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup by userId
AddressSchema.index({ userId: 1, isDefault: 1 });
AddressSchema.index({ userId: 1, type: 1 });

// Virtual for full name
AddressSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure only one default address per user
AddressSchema.pre("save", async function (next) {
  if (this.isDefault && this.isModified("isDefault")) {
    await mongoose.model("Address").updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

// Generate formatted address before saving
AddressSchema.pre("save", function (next) {
  const parts = [
    this.street,
    this.apartment,
    this.city,
    this.state,
    this.zipCode,
    this.country,
  ].filter(Boolean);
  this.formattedAddress = parts.join(", ");
  next();
});

const Address = mongoose.models.Address || mongoose.model("Address", AddressSchema);
export default Address;
