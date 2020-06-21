import {
  Int,
  Arg,
  Ctx,
  Query,
  Resolver,
  Mutation,
  UseMiddleware,
} from "type-graphql";
import { verify } from "jsonwebtoken";
import { getConnection } from "typeorm";
import { hash, compare } from "bcryptjs";

import { User } from "../entity";
import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../../context";
import { LoginResponse } from "../types";
import { sendRefreshToken } from "../../utils/sendRefreshToken";
import { Profile, Settings } from "../entity";
import { ProfileInput, SettingsInput } from "../inputs";
import { createAccessToken, createRefreshToken } from "../../utils/auth";

@Resolver(User)
export class UserResolver {
  /**
   * Queries
   */

  // Remove test
  @Query(() => String)
  hello() {
    return "hi!";
  }

  // Remove protected route by middleware isAuth
  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    return `your user id is:${payload!.userId}`;
  }

  // Fetch all users
  @Query(() => [User])
  users() {
    return User.find({ relations: ["profile", "profile.settings"] });
  }

  // Get user by id
  @Query(() => [User])
  async findUser(@Arg("id") id: number, @Arg("email") email: string) {
    const findBy = id === 0 ? { email } : { id };
    console.log(findBy);

    const user = await User.find({
      where: findBy,
      relations: ["profile", "profile.settings"],
    });

    if (!user || user.length === 0) {
      throw new Error(`could not find user by ${findBy.id || findBy.email}`);
    }

    console.log(user);
    return user;
  }

  // Fetch authorize user information
  @Query(() => User, { nullable: true })
  me(@Ctx() context: MyContext) {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      return User.findOne(payload.userId, { relations: ["settings"] });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  /**
   * Mutations
   */

  // Register

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("profile") profile: ProfileInput,
    @Arg("settings") settings: SettingsInput
  ) {
    const isExist = await User.findOne({ where: { email } });
    if (isExist) throw new Error("this e-mail address has already taken");

    const hashedPassword = await hash(password, 12);
    const profileUse: any = profile;

    const userSettings = Settings.create(settings);
    await userSettings.save();

    profileUse.settings = userSettings;

    const userProfile = Profile.create(profile);
    await userProfile.save();

    const user = User.create({
      email,
      password: hashedPassword,
      profile: userProfile,
    });

    try {
      await user.save();
    } catch (err) {
      console.log(err);
      return false;
    }

    console.log(user);

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
