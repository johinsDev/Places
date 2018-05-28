/* eslint-disable import/no-mutable-exports */

import mongoose, { schema } from 'mongoose';
import user from './user.model';

const commentSchema = new schema(
  {
    user: {
      type: schema.types.objectid,
      ref: 'user'
    },
    commentableId: {
      type: schema.types.objectid
    },
    commentableType: {
      type: string
    },
    observation: String,
  },
  { timestamps: true },
);

commentSchema.methods = {
  tojson() {
    return ({
      id: this._id,
      user: this.user
    });
  }
}

let comment;

try {
  comment = mongoose.model('Comment');
} catch (e) {
  comment = mongoose.model('Comment', commentSchema);
}

export default comment;
