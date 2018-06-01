/* eslint-disable import/no-mutable-exports */

import mongoose, { Schema } from 'mongoose';
import Favorite from './favorite.model';

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    commentableId: {
      type: Schema.Types.ObjectId,
    },
    commentableType: {
      type: String
    },
    comment: String,
  },
  { timestamps: true },
);

commentSchema.virtual('favorites').get(function() {
  return Favorite.find({ favoritableId: this._id });
});

commentSchema.methods = {
  toJSON() {
    return ({
      id: this._id,
      comment: this.comment,
      user: this.user
    });
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
  }
}

let comment;

try {
  comment = mongoose.model('Comment');
} catch (e) {
  comment = mongoose.model('Comment', commentSchema);
}

export default comment;
