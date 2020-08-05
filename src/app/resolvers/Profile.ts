import {
  Arg,
  Ctx,
  Query,
  Resolver,
  Mutation,
  UseMiddleware,
} from "type-graphql";

import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../context";

// ******* entity *******
import { User } from "../entity/User";
import { Profile } from "../entity/Profile";
import { ProfileInput } from "../inputs/Profile";

@Resolver(Profile)
export class ProfileResolver {
  // ******* querys *******

  // Fetch all Profiles
  @Query(() => [Profile])
  profiles() {
    return Profile.find({
      relations: ["user"],
    });
  }

  // Get Profile by id
  @Query(() => Profile)
  async findProfile(@Arg("id") id: number) {
    const profile = await Profile.find({
      where: { id },
      relations: ["profile.user"],
    });

    console.log(profile);

    if (!profile || profile.length === 0) {
      throw new Error(`could not find user by ${id}`);
    }

    return profile;
  }

  // Get user Profile
  @UseMiddleware(isAuth)
  @Query(() => Profile)
  async findUserProfile(@Ctx() { payload }: MyContext) {
    const user = await User.findOne(payload!.userId);

    if (!user)
      throw new Error(`can't find user profile by userId ${payload!.userId}`);

    return user?.profile ? user?.profile : null;
  }

  // ******* mutations *******

  // Edit user profile
  @Mutation(() => Profile)
  @UseMiddleware(isAuth)
  async editUserProfile(
    @Ctx() { payload }: MyContext,
    @Arg("profile") _profile: ProfileInput
  ) {
    const user = await User.findOne(payload!.userId);

    if (!user) throw new Error(`can't find user by ${payload!.userId}`);

    let profile = await Profile.findOne(user.profile.id);

    if (!profile) throw new Error(`can't find profile by ${user.profile.id}`);

    Profile.merge(profile, _profile);

    try {
      await Profile.save(profile);
    } catch (err) {
      console.log(
        `can't update user profile (userId: ${payload!.userId}, profileId: ${
          user.profile.id
        })`,
        err
      );
      throw new Error(
        `can't update user profile (userId: ${payload!.userId}, profileId: ${
          user.profile.id
        })`
      );
    }

    profile = await Profile.findOne(user.profile.id, { relations: ["user"] });

    return profile;
  }
}
