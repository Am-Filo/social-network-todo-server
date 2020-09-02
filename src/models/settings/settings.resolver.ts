import {
  Arg,
  Ctx,
  Query,
  Resolver,
  Mutation,
  UseMiddleware,
} from "type-graphql";

import { isAuth } from "../../middleware/isAuth";
import { MyContext } from "../../helpers/context";

// ******* entity *******
import { User } from "../user/user.entity";
import { Settings } from "../settings/settings.entity";

// ******* inputs *******
import { SettingsInput } from "./settings.inputs";

@Resolver(Settings)
export class SettingsResolver {
  // ******* querys *******

  // Fetch all settings
  @Query(() => [Settings])
  settings() {
    return Settings.find({
      relations: ["profile", "profile.user"],
    });
  }

  // Get settings by id
  @Query(() => Settings)
  async findSettings(@Arg("id") id: number) {
    const settings = await Settings.find({
      where: { id },
    });

    console.log(settings);

    if (!settings || settings.length === 0) {
      throw new Error(`could not find user setting by settingsId ${id}`);
    }

    return settings;
  }

  // Get user settings
  @UseMiddleware(isAuth)
  @Query(() => Settings, { nullable: true })
  async findUserSettings(@Ctx() { payload }: MyContext) {
    const user = await User.findOne(payload!.userId);

    if (!user)
      throw new Error(`can't find user settings by userId: ${payload!.userId}`);

    return user?.profile.settings ? user?.profile.settings : null;
  }

  // ******* mutations *******

  // Edit user profile
  @Mutation(() => Settings, { nullable: true })
  @UseMiddleware(isAuth)
  async editUserSettings(
    @Ctx() { payload }: MyContext,
    @Arg("settings") _settings: SettingsInput
  ) {
    const user = await User.findOne(payload!.userId);

    if (!user) throw new Error(`can't find user by userId: ${payload!.userId}`);

    if (!user?.profile.settings.id)
      throw new Error(`can't find user settings by userId: ${payload!.userId}`);

    const settingsId = user?.profile.settings.id;
    let settings = await Settings.findOne(settingsId);

    if (!settings)
      throw new Error(`can't find user settings by settingsId ${settingsId}`);

    Settings.merge(settings, _settings);

    try {
      await Settings.save(settings);
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

    settings = await Settings.findOne(user.profile.id, {
      relations: ["profile.user"],
    });

    return settings;
  }
}
