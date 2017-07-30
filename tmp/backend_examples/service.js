/* @flow */
import User, { getUserByUrl } from '../models/User.thinky';
import ClientError from '../common/error/ClientError';
import { AuthorizationError } from '../common/error/DataAccessError';
import bcrypt from 'bcryptjs';
import accessControl from '../common/accessControl';
import Post from '../models/Post.thinky';
import thinky from '../common/thinky';
import sliceFromThinkySequence from '../common/sliceFromThinkySequence';
import type { Slice, SliceInfo } from '../common/sliceFromThinkySequence';
import uploadImageToCloud from '../utils/uploadImageToCloud';
import Service from './Service';

type UserFilter = {
  firstName: ?string,
  lastName: ?string,
  email: ?string,
};

export default class UserService extends Service {
  async getUser(id: string): Promise<User> {
    return await User.get(id);
  }

  getUserByUrl(url: string): Promise<User> {
    return getUserByUrl(url);
  }

  async getUsers(
    filter: UserFilter,
    sliceInfo: SliceInfo
  ): Promise<Slice<User>> {
    if (! await accessControl.canUserViewUserList(this.userId)) {
      throw new AuthorizationError();
    }

    const users = ['firstName', 'lastName', 'email'].reduce(
      (seq, fieldName) => filter[fieldName]
        ? seq.filter(thinky.r.row(fieldName).match(`(?i)${filter[fieldName]}`))
        : seq,
      User
    );

    return sliceFromThinkySequence(users, sliceInfo);
  }

  getUserPosts(
    userId: string,
    sliceInfo: SliceInfo
  ): Promise<Slice<Post>> {
    const seq = Post.filter(
      thinky.r.row('ownerId').eq(userId).or(thinky.r.row('adminIds').contains(userId))
    );
    return sliceFromThinkySequence(seq, sliceInfo);
  }

  async editUser(userData: User): Promise<User> {
    const { id } = userData;

    if (! await accessControl.canUserEditUser(this.userId, id)) {
      throw new ClientError('Access denied.');
    }

    const user = await User.get(id).catch(() => null);
    if (!user) {
      throw new ClientError(`User with id "${id}" is not found.`);
    }

    const password = userData.password && bcrypt.hashSync(userData.password);

    return await user.merge({ ...userData, password }).save();
  }

  async uploadUserImage(
    userId: string,
    image: Buffer,
    path: string
  ): Promise<User> {
    if (! await accessControl.canUserEditUser(this.userId, userId)) {
      throw new ClientError('Access denied.');
    }

    const user = await User.get(userId).catch(() => null);
    if (!user) {
      throw new ClientError(`User with id "${userId}" is not found.`);
    }

    user.profilePhotoUrl = await uploadImageToCloud(path, image);
    return await user.save();
  }
}
