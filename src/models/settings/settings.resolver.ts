import {
  Arg,
  Ctx,
  Query,
  Resolver,
  Mutation,
  UseMiddleware,
} from 'type-graphql';

import { isAuth } from '../../middleware/isAuth';
import { MyContext } from '../../helpers/context';

// ******* entity *******
import { User } from '../user/user.entity';
import { Settings } from '../settings/settings.entity';

// ******* inputs *******
import {
  EditSettingsInput,
  GetSettingsInput,
  FindSettingsInput,
} from './settings.inputs';

// ***** services ******
import { SettingsService } from './settings.service';

@Resolver(Settings)
export class SettingsResolver {
  constructor(private readonly settingsService: SettingsService) {}

  // Fetch all settings
  @Query(() => [Settings])
  async settings(
    @Arg('filter', () => GetSettingsInput) data: GetSettingsInput
  ) {
    return this.settingsService.getAll(data);
  }

  // Get settings by id
  @Query(() => Settings)
  async findSettings(
    @Arg('filter', () => FindSettingsInput) data: FindSettingsInput
  ) {
    return await this.settingsService.findBy(data);
  }

  // Get user settings
  @UseMiddleware(isAuth)
  @Query(() => Settings)
  async findUserSettings(@Ctx() { payload }: MyContext) {
    return await this.settingsService.findUserSettings(payload!.userId);
  }

  // ******* mutations *******

  // Edit user settings
  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async editUserSettings(
    @Ctx() { payload }: MyContext,
    @Arg('data', () => EditSettingsInput) data: EditSettingsInput
  ) {
    try {
      return await this.settingsService.editUserSettings(data, payload!.userId);
    } catch (err) {
      throw err;
    }
  }
}
