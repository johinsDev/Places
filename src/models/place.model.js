import mongoose, { Schema, Types } from 'mongoose';
import uploader from '../services/cloudinary';
import mongoosePaginate from 'mongoose-paginate';
import Favorite from './favorite.model';
import Comment from './comment.model';
import { filteredBody } from '../utils/filteredBody';
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
  closeHour: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required!'] 
  }
}, { timestamps: true });

const filleable = [ 'description', 'title', 'avatarImage', 'coverImage', 'openHour' ];

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

PlaceSchema.virtual('comments').get(function() {
  return Comment.find({ commentableId: this._id });
});

PlaceSchema.virtual('favorites').get(function() {
  return Favorite.find({ favoritableId: this._id });
});

PlaceSchema.statics = {
  createPlace(params, user) {
    return this.create({
     ...filteredBody(params, filleable),
      user
    });
  },
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
      user: this.user,
      description: this.description,
      avatarUrl: this.avatarImage,
      coverUrl: this.coverImage,
      openHour: this.openHour,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  },
  addComment(user, comment) {
    return Comment.create({ user, comment, commentableId: this._id, commentableType: this.constructor.modelName });
  },
  commentBy(user) {
    return this.comments.populate('user');
  },
  myFavorite(user) {
    return this.favorites.where({ user });
  },
  addFavorite(user) {
    return Favorite.create({ user, favoritableId: this._id, favoritableType: this.constructor.modelName });
  },
  async isFavorited(user) {
    return await this.myFavorite(user).count() > 0;
  },
  removeFavorite(user) {
    return this.myFavorite(user).remove(); 
  },
  async toggleFavorite(user) {
    return (await this.isFavorited(user) ? this.removeFavorite(user) : this.addFavorite(user));
  },
  favoriteBy(user) {
    return this.favorites.populate('user');
  },
  likes() {
    return this.favorites.count();
  },
  async uploadImage(path, type) {
    const url = await uploader(path);
    if (url) this.update({ [`${type}Image`]: url });
  },
  update(params) { 
    const place = Object.assign(this, filteredBody(params, filleable));
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
