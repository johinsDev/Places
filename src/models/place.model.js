import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

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
}, { timestamps: true });

mongoosePaginate.paginate.options = {
  limit: 2,
  sort: { createdAt: '-1'},
  page: 1
};
// agregarla prev, y next parametros que se basen en la url
PlaceSchema.plugin(mongoosePaginate);

PlaceSchema.query.list = function({ sort = { createdAt: '-1' }, limit = 10, page = 1 } = {}) {
  return this.model.paginate(this._conditions, { sort, limit, page });
}

PlaceSchema.statics.list = function({ sort = { createdAt: '-1' }, limit = 5, page = 1 } = {}) {
  return this.paginate({}, { sort, limit, page });
}

PlaceSchema.methods = {
 toJSON() {
    return {
      title: this.title
    };
  }
}

let Place;

try {
  Place = mongoose.model('Place');
} catch (e) {
  Place = mongoose.model('Place', PlaceSchema);
}

export default Place;
