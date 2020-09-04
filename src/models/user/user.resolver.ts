import { Service } from "typedi";
import {
  Int,
  Arg,
  Ctx,
  Root,
  Query,
  PubSub,
  Resolver,
  Mutation,
  Subscription,
  PubSubEngine,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { hash, compare } from "bcryptjs";

import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../../helpers/context";
import { sendRefreshToken } from "../../helpers/sendRefreshToken";
import { createAccessToken, createRefreshToken } from "../../helpers/auth";

// ******* entities *******
import { User } from "./user.entity";
import { Profile } from "../profile/profile.entity";
import { Settings } from "../settings/settings.entity";

// ******* types *******
import { LoginResponse } from "./user.types";

// ******* services *******
import { UserService } from './user.service';

// ******* inputs *******
import { CreateUserInput, EditUserInput, FindUserInput, GetUsersInput } from "./user.inputs";

@Service()
@Resolver(User)
export class UserResolver {
  constructor(
    private readonly userService: UserService
  ){}

  /**
   * subscribers
   *
   * @see https://github.com/MichalLytek/type-graphql/blob/master/examples/simple-subscriptions/resolver.ts
   * @see https://typegraphql.com/docs/subscriptions.html
   */

  // ******* subscription *******

  @Subscription({ topics: "USERADDED" })
  newUserAdded(@Root() user: User): User {
    return user;
  }

  // ******* querys *******

  // Get all users
  @Query(() => [User])
  users(@Arg("filter", () => GetUsersInput) data: GetUsersInput) {
    return this.userService.getAll(data);
  }

  // Get user by id or email
  @Query(() => User)
  findUser(
    @Arg("filter", () => FindUserInput) data: FindUserInput
  ) {
    return this.userService.findBy(data);
  }

  // Get authorize user information
  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  me(@Ctx() { payload }: MyContext) {
    return this.userService.getById(payload!.userId);
  }

  // ******* mutations *******

  // Register
  @Mutation(() => Boolean)
  async register(
    @PubSub() pubSub: PubSubEngine,
    @Arg("data", () => CreateUserInput) registerData: CreateUserInput
  ) {
    const isExist = await User.findOne({ where: { email: registerData.email } });
    if (isExist) throw new Error("this e-mail address has already use");

    const hashedPassword = await hash(registerData.password, 12);

    const userSettings = Settings.create(registerData.profile.settings);
    await userSettings.save();
    registerData.profile.settings = userSettings;

    const userProfile = Profile.create(registerData.profile);
    await userProfile.save();

    const user = User.create({
      email: registerData.email,
      password: hashedPassword,
      profile: userProfile,
    });

    try {
      await user.save();
      await pubSub.publish("USERADDED", user);
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }

  // Login
  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("could not find user");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("bad password");
    }

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }

  // Logout
  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "");

    return true;
  }

  // Edit user
  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async editUser(@Ctx() { payload }: MyContext, @Arg("user") _user: EditUserInput) {
    let user = await User.findOne(payload!.userId);

    if (!user) throw new Error(`could not find user by ${payload!.userId}`);

    User.merge(user, _user);

    try {
      await User.save(user);
    } catch (err) {
      console.log(err);
      return false;
    }

    user = await User.findOne(payload!.userId);

    return user;
  }

  // Delete user
  @Mutation(() => Boolean)
  async deleteUser(@Arg("id") id?: number, @Arg("email") email?: string) {
    const findBy = id === 0 ? { email } : { id };

    console.log(findBy);

    const isExist = await User.findOne({ where: findBy });
    if (!isExist)
      throw new Error(`could not find user by ${findBy.id || findBy.email}`);

    console.log(isExist);

    try {
      await User.delete(findBy);
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }

  // Revorkere fresh tokens for user
  @Mutation(() => Boolean)
  async revorkerefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);

    return true;
  }
}
