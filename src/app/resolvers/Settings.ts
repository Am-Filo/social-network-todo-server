import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";

import { isAuth } from "../../middleware/isAuth";

// entity
import { Settings } from "../entity/Settings";

@Resolver(Settings)
export class SettingsResolver {
  /**
   * Queries
   */

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
      throw new Error(`could not find user by ${id}`);
    }

    return settings;
  }

  // Get user settings
  @UseMiddleware(isAuth)
  @Query(() => Settings)
  async findUserSettings(@Arg("id") id: number) {
    const settings = await Settings.find({
      where: { id },
    });

    console.log(settings);

    if (!settings || settings.length === 0) {
      throw new Error(`could not find user by ${id}`);
    }

    return settings;
  }

  /**
   * Mutations
   */
}
