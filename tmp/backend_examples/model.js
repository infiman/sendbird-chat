/* @flow */
import thinky from '../common/thinky';
import ClientError from '../common/error/ClientError';
import ValidationError from '../common/error/ValidationError';

const { type, r } = thinky;

const User = thinky.createModel('Users', {
  id: type.string(),
  email: type.string().required().email(),
  url: type.string(),
  firstName: type.string().required(),
  lastName: type.string().required(),
  password: type.string().required(),
  roles: type.array(),
  createdAt: type.date().default(r.now()),
  updatedAt: type.date(),
  profilePhotoUrl: type.string(),
  resolveType: type.virtual().default(() => User),
}, {
  /* eslint camelcase: 0 */
  enforce_extra: 'remove',
});

User.pre('save', function setUpdateDate() {
  this.updatedAt = r.now();
});

export async function getUserByEmail(email: string): User {
  const users = await User.filter({ email }).limit(1);

  if (!users.length) {
    throw new ClientError('Can\'t find user');
  }

  return users[0];
}

export async function getUserByUrl(url: string): User {
  const users = await User.filter({ url }).limit(1);

  if (!users.length) {
    throw new ClientError('Can\'t find user');
  }

  return users[0];
}

User.pre('validate', async function validate() {
  const foundEmailCount = await r.table(User.getTableName())
    .filter(r.row('email').eq(this.email))
    .filter(r.row('id').ne(this.id || ''))
    .count()
    .run();

  const foundUrlCount = this.url
    ? await r.table(User.getTableName())
    .filter(r.row('url').eq(this.url))
    .filter(r.row('id').ne(this.id || ''))
    .count()
    : 0;

  if (foundEmailCount) {
    throw new ValidationError({
      email: 'Not unique email',
    });
  }

  if (foundUrlCount) {
    throw new ValidationError({
      url: 'Not unique url',
    });
  }
});

export default User;
