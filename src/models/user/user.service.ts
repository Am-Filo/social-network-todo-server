import { Service, Inject } from "typedi";
// ? https://github.com/MichalLytek/type-graphql/blob/master/examples/graphql-modules/user/user.service.ts

import { User } from "./user.entity";
import { GetUsersInput, FindUserInput, CreateUserInput, LoginUserInput } from './user.inputs';
import { hash, compare } from "bcryptjs";
import { Settings } from "../settings/settings.entity";
import { Profile } from "../profile/profile.entity";
import { sendRefreshToken } from "../../helpers/sendRefreshToken";
import { createRefreshToken, createAccessToken } from "../../helpers/auth";

@Service()
@Inject("User_Service")
export class UserService {
   public getAll(data: GetUsersInput) {
      return User.find({ skip: data.startIndex, take: data.endIndex });
   }

   public async getById(id: string) {
      return await User.findOne(id);
   }

   public getByEmail(email: string) {
      return User.findOne({ email });
   }

   public async findBy(data: FindUserInput) {
      if (!data) throw new Error(`please provide user email or id`);

      const user = await User.find(data);
      if (!user || user.length === 0) throw new Error(`user not found: ${data}`);

      return user;
   }

   public async isExist(data: FindUserInput) {
      if (!data) throw new Error(`please provide user email or id`);

      const isExist = await User.findOne(data);

      return !!isExist;
   }

   public async createUser(data: CreateUserInput) {
      if (!data) throw new Error(`please provide all user inputs: email and password`);

      const userExist = await this.isExist({ email: data.email });

      if (userExist) throw new Error("this e-mail address has already use");

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

   public async login(
      data: LoginUserInput,
      res: any
   ) {
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