import mongoose from 'mongoose';

const graveSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Deceased name is required'],
      trim: true,
      index: true,
    },
    ic_number: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    date_of_death: {
      type: String, // Stored in YYYY-MM-DD format
      required: [true, 'Date of death is required'],
      index: true,
    },
    plot_number: {
      type: String,
      required: [true, 'Plot number is required'],
      trim: true,
      index: true,
    },
    gps_lat: {
      type: String,
      required: [true, 'GPS Latitude is required'],
      trim: true,
    },
    gps_lng: {
      type: String,
      required: [true, 'GPS Longitude is required'],
      trim: true,
    },
    photo: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for broad keyword searching
graveSchema.index({
  name: 'text',
  ic_number: 'text',
  plot_number: 'text',
  date_of_death: 'text',
});

const Grave = mongoose.model('Grave', graveSchema);
export default Grave;
