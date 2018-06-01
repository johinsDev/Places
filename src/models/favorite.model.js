/* eslint-disable import/no-mutable-exports */

import mongoose, { Schema } from 'mongoose';
import User from './user.model';

const FavoriteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    favoritableId: {
      type: Schema.Types.ObjectId
    },
    favoritableType: {
      type: String
    }
  },
  { timestamps: true },
);

FavoriteSchema.methods = {
  toJSON() {
    return ({
      id: this._id,
      user: this.user
    });
  }
}

// @TODO: create alternative for poliformic relation

let Favorite;

try {
  Favorite = mongoose.model('Favorite');
} catch (e) {
  Favorite = mongoose.model('Favorite', FavoriteSchema);
}

export default Favorite;
