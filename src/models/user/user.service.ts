// ? https://github.com/MichalLytek/type-graphql/blob/master/examples/graphql-modules/user/user.service.ts
import { Service, Inject } from 'typedi';
import { hash, compare } from 'bcryptjs';

import { sendRefreshToken } from '../../helpers/sendRefreshToken';
import { createRefreshToken, createAccessToken } from '../../helpers/auth';

// ******* entities *******
import { User } from './user.entity';
import { Settings } from '../settings/settings.entity';
import { Profile } from '../profile/profile.entity';

// ******* inputs *******
import {
  GetUsersInput,
  FindUserInput,
  CreateUserInput,
  LoginUserInput,
  DeleteUserInput,
  EditUserInput,
} from './user.inputs';

@Service()
@Inject('User_Service')
export class UserService {
  public getAll = async (data: GetUsersInput) =>
    await User.find({ skip: data.startIndex, take: data.endIndex });
  public getById = async (id: string) => await User.findOne(id);
  public getByEmail = async (email: string) => await User.findOne({ email });
  public isExist = async (data: FindUserInput) => !!(await User.findOne(data));

  public async findBy(data: FindUserInput) {
    const user = await User.findOne(data);
    if (!user) throw new Error(`user not found: ${data.id || data.email}`);

    return user;
  }

  public async createUser(data: CreateUserInput) {
    if (!data)
      throw new Error(`please provide all user inputs: email and password`);

    const userExist = await this.isExist({ email: data.email });

    if (userExist) throw new Error('this e-mail address has already use');

    const hashedPassword = await hash(data.password, 12);

    const userSettings = Settings.create(data.profile.settings);
    await userSettings.save();
    data.profile.settings = userSettings;

    const userProfile = Profile.create(data.profile);
    await userProfile.save();

    const user = User.create({
      email: data.email,
      password: hashedPassword,
      profile: userProfile,
    });

    try {
      await user.save();
    } catch (err) {
      throw err;
    }

    return user;
  }

  public async editUser(data: EditUserInput, id: string) {
    if (!data)
      throw new Error(`please provide all users fields: email and password`);

    let user = await this.getById(id);

    if (!user) throw new Error(`can't find user with id: ${id}`);

    const dataEdit: EditUserInput = {};

    if (data.email) {
      const userFind = await this.findBy({ email: data.email });
      if (userFind) throw new Error(`this e-mail address already use`);
      dataEdit.email = data.email;
    }
    if (data.password) {
      const valid = await compare(data.password, user.password);
      if (valid) throw new Error(`don't use the same passwords`);

      dataEdit.password = await hash(data.password, 12);
    }

    User.merge(user, dataEdit);

    try {
      user = await User.save(user);
    } catch (err) {
      throw err;
    }

    return user;
  }

  public async deleteUser(data: DeleteUserInput) {
    if (!data) throw new Error(`please provide all user inputs: id and email`);

    const userExist = await this.isExist({ id: data.id });

    if (!userExist)
      throw new Error(
        `can't find user with id: ${data.id} & email ${data.email}`
      );

    try {
      await User.delete(data.id);
    } catch (err) {
      throw err;
    }

    return true;
  }

  public async login(data: LoginUserInput, res: any) {
    const user = await this.getByEmail(data.email);

    if (!user) throw new Error(`could not find user by email: ${data.email}`);

    const valid = await compare(data.password, user.password);

    if (!valid) throw new Error(`bad password`);

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }
}
