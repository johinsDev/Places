import mongoose, { Schema, Types } from 'mongoose';
import uploader from '../services/cloudinary';
import mongoosePaginate from 'mongoose-paginate';
import slug from 'slug';

function getAvatar(avatar) {
  if (!avatar) return 'https://www.loottis.com/wp-content/uploads/2014/10/default-img.gif';
  return avatar;
}

function getCover(cover) {
  if (!cover) return 'https://www.loottis.com/wp-content/uploads/2014/10/default-img.gif';
  return cover;
}

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
  slug: {
    type: String
  },
  coverImage: {
    type: String,
    get: getCover
  },
  avatarImage: {
    type: String,
    get: getAvatar
  },
  openHour: Number,
  closeHour: Number
}, { timestamps: true });

const fillable = [ 'description', 'title', 'avatarImage', 'coverImage' ];

PlaceSchema.pre('save', async function(next){
  try{
    if(this.isModified('title')){ 
      this.slug = slug(this.title)

      const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`,'i')

      const docsWithSlug = await this.constructor.find({ slug: slugRegEx });

      if(docsWithSlug.length){
        this.slug = `${this.slug}-${docsWithSlug.length + 1}`
      }
      return next(); 
    }
      return next();
    } catch(error) {
        throw error
    }
});

mongoosePaginate.paginate.options = {
  limit: 2,
  sort: { createdAt: '-1'},
  page: 1
};

PlaceSchema.plugin(mongoosePaginate);

PlaceSchema.query.list = function({ sort = { createdAt: '-1' }, limit = 10, page = 1 } = {}) {
  return this.model.paginate(this._conditions, { sort, limit, page });
}

PlaceSchema.statics = {
  list({ sort = { createdAt: '-1' }, limit = 5, page = 1 } = {}) {
    return this.paginate({}, { sort, limit, page });
  },
  findBySlug(slug) {
    return this.findOne({ slug });
  },
  findByIdOrSlug(param) {
    const promise = Types.ObjectId.isValid(param) ? this.findById(param) : this.findBySlug(param);
    return promise;
  }
}

PlaceSchema.methods = {
 toJSON() {
    return {
      id: this._id,
      title: this.title,
      slug: this.slug,
      description: this.description,
      avatarUrl: this.avatarImage,
      coverUrl: this.coverImage
    };
  },
  async uploadImage(path, type) {
    const url = await uploader(path);
    if (url) this.update({ [`${type}Image`]: url });
  },
  update(params) {
    const newParams = {};
    fillable.forEach(attr => {
      if (Object.prototype.hasOwnProperty.call(params, attr)) {
        newParams[attr] = params[attr];
      }
    });

    const place = Object.assign(this, newParams);
    
    return place.save();
  }
}

let Place;

try {
  Place = mongoose.model('Place');
} catch (e) {
  Place = mongoose.model('Place', PlaceSchema);
}

export default Place;
