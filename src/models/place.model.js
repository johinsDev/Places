import mongoose, { Schema } from 'mongoose';

const PlaceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  acceptsCreditCard: {
    type: Boolean,
    default: false
  },
  coverImage: String,
  avatarImage: String,
  openHour: Number,
  closeHour: Number
});

let Place;

try {
  Place = mongoose.model('Place');
} catch (e) {
  Place = mongoose.model('Place', PlaceSchema);
}

export default Place;
