import { Service, Inject } from 'typedi';

// ******* entities *******
import { Settings } from './settings.entity';

// ******* inputs *******
import {
  GetSettingsInput,
  FindSettingsInput,
  EditSettingsInput,
} from './settings.inputs';

import { UserService } from '../user/user.service';
import { ProfileService } from '../profile/profile.service';
@Service()
@Inject('Settings_Service')
export class SettingsService {
  private userService: UserService = new UserService();
  private profileService: ProfileService = new ProfileService();

  public getAll = async (data: GetSettingsInput) =>
    await Settings.find({ skip: data.startIndex, take: data.endIndex });
  public getById = async (id: string) => await Settings.findOne(id);

  public async findBy(data: FindSettingsInput) {
    const settings = await Settings.findOne(data.id);
    if (!settings) throw new Error(`profile not found: ${data.id}`);
    return settings;
  }

  public async findUserSettings(id: string) {
    const user = await this.userService.getById(id);
    if (!user) throw new Error(`user not found: ${id}`);
    return user.profile.settings ? user.profile.settings : null;
  }

  public create(data?: any) {
    return data ? Settings.create(data.settings) : Settings.create();
  }

  public async editUserSettings(data: EditSettingsInput, id: string) {
    const user = await this.userService.getById(id);

    if (!user) throw new Error(`can't find user by ${id}`);

    const profile = await this.profileService.getById(
      user.profile.id.toString()
    );

    if (!profile)
      throw new Error(`can't find profile by id: ${user.profile.id}`);

    if (!profile.settings.id) throw new Error(`can't grab settings id`);

    let settings = await Settings.findOne(profile.settings.id);

    if (!settings)
      throw new Error(
        `can't find user settings by settingsId ${profile.settings.id}`
      );

    Settings.merge(settings, data);

    try {
      settings = await Settings.save(settings);
    } catch (err) {
      throw err;
    }
    return settings;
  }
}
