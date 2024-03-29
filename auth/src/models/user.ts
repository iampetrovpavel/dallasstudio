import mongoose from 'mongoose';
import {Password} from "../services/password";

interface UserAttrs {
  name: string;
  email: string;
  password: string;
  admin?: boolean;
  groups?: string[];
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  admin?: boolean;
  groups: string[];
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
  },
  groups: {
    type: [String],
    default: []
  }
},{
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.password
      delete ret.__v
    }
  }
});
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.pre('save', async function (done){
  if(this.isModified('password')){
    const hashed = await Password.toHash(this.get('password'))
    this.set('password', hashed)
  }
  done()
})

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User, UserAttrs };
