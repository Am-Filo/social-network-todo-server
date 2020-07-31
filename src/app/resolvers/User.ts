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
import { verify } from "jsonwebtoken";
import { getConnection } from "typeorm";
import { hash, compare } from "bcryptjs";

import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../context";
import { LoginResponse } from "../type/Login";
import { sendRefreshToken } from "../../utils/sendRefreshToken";
import { createAccessToken, createRefreshToken } from "../../utils/auth";

// ******* entity *******
import { User } from "../entity/User";
import { Profile } from "../entity/Profile";
import { Settings } from "../entity/Settings";

// ******* input *******
import { UserInput } from "../inputs/User";
import { ProfileInput } from "../inputs/Profile";

@Resolver(User)
export class UserResolver {
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

  // Remove test
  @Query(() => String)
  hello() {
    return "hi!";
  }

  // Remove protected route by middleware isAuth
  @Query(() => String)
  @UseMiddleware(isAuth)
  secure(@Ctx() { payload }: MyContext) {
    return `your user id is:${payload!.userId}`;
  }

  // Fetch all users
  @Query(() => [User])
  users() {
    return User.find();
  }

  // Get user by id
  @Query(() => [User])
  async findUser(@Arg("id") id?: number, @Arg("email") email?: string) {
    const findBy = id === 0 ? { email } : { id };
    const user = await User.find(findBy);

    if (!user || user.length === 0) {
      throw new Error(`could not find user by ${findBy.id || findBy.email}`);
    }

    return user;
  }

  // Fetch authorize user information
  @Query(() => User, { nullable: true })
  me(@Ctx() context: MyContext) {
    const authorization = context.req.headers.authorization;

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      return User.findOne(payload!.userId);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // ******* mutations *******

  // Register

  @Mutation(() => Boolean)
  async register(
    @PubSub() pubSub: PubSubEngine,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("profile") profile: ProfileInput
  ) {
    const isExist = await User.findOne({ where: { email } });
    if (isExist) throw new Error("this e-mail address has already use");

    const hashedPassword = await hash(password, 12);

    if (profile.settings) {
      const userSettings = Settings.create(profile.settings);
      await userSettings.save();
      profile.settings = userSettings;
    }

    const userProfile = Profile.create(profile);
    await userProfile.save();

    const user = User.create({
      email,
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

  // Edit user

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async editUser(@Ctx() { payload }: MyContext, @Arg("user") _user: UserInput) {
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

  // Login

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

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

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "");

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
