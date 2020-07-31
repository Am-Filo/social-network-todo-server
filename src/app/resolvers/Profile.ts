import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";

import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../context";

// ******* entity *******
import { Profile } from "../entity/Profile";

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
    const profile = await Profile.find({
      where: { id: payload!.userId },
      relations: ["profile.user"],
    });

    console.log(profile);

    if (!profile || profile.length === 0) {
      throw new Error(`could not find user by ${payload!.userId}`);
    }

    return profile;
  }

  // ******* mutations *******
}
