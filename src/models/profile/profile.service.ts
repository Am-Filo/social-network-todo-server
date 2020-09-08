import { Service, Inject } from 'typedi';

// ******* entities *******
import { Profile } from './profile.entity';

// ******* inputs *******
import {
  GetProfilesInput,
  FindProfileInput,
  EditProfileInput,
} from './profile.inputs';

import { UserService } from '../user/user.service';
@Service()
@Inject('Profile_Service')
export class ProfileService {
  private userService: UserService = new UserService();

  public getAll = async (data: GetProfilesInput) =>
    await Profile.find({ skip: data.startIndex, take: data.endIndex });
  public getById = async (id: string) => await Profile.findOne(id);

  public async findBy(data: FindProfileInput) {
    const prodile = await Profile.findOne(data);
    if (!prodile) throw new Error(`profile not found: ${data.id}`);
    return prodile;
  }

  public async findUserPofile(id: string) {
    const user = await this.userService.getById(id);
    if (!user) throw new Error(`user not found: ${id}`);
    return user.profile ? user.profile : null;
  }

  public create(data?: any) {
    return data ? Profile.create(data.profile) : Profile.create();
  }

  public async editUserProfile(data: EditProfileInput, id: string) {
    const user = await this.userService.getById(id);

    if (!user) throw new Error(`can't find user by ${id}`);

    let profile = await this.getById(user.profile.id.toString());

    if (!profile) throw new Error(`can't find profile by ${user.profile.id}`);

    Profile.merge(profile, data);

    try {
      profile = await Profile.save(profile);
    } catch (err) {
      throw err;
    }
    return profile;
  }
}
