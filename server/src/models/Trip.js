import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    source: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    adults: {
      type: Number,
      default: 1,
    },

    children: {
      type: Number,
      default: 0,
    },

    budget: {
      type: String,
      required: true,
    },

    interests: [
      {
        type: String,
      },
    ],

    itinerary: {
      type: Object,
      required: true,
    },

    weather: {
      type: Object,
      required: true,
    },

    hotels: {
      type: [Object],
      default: [],
    },
     
    flights: {
      type: [Object],
      default: [],
    },

    images: {
      type: [Object],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Trip", tripSchema);
