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
import { Profile } from './profile.entity';
import {
  EditProfileInput,
  GetProfilesInput,
  FinProfileInput,
} from './profile.inputs';

// ****** service *****
import { ProfileService } from './profile.service';

@Resolver(Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  // ******* querys *******

  // Fetch all Profiles
  @Query(() => [Profile])
  async profiles(
    @Arg('filter', () => GetProfilesInput) data: GetProfilesInput
  ) {
    return this.profileService.getAll(data);
  }

  // Get Profile by id
  @Query(() => Profile)
  async findProfile(
    @Arg('filter', () => FinProfileInput) data: FinProfileInput
  ) {
    return await this.profileService.findBy(data);
  }

  // Get user Profile
  @UseMiddleware(isAuth)
  @Query(() => Profile)
  async findUserProfile(@Ctx() { payload }: MyContext) {
    return await this.profileService.findUserPofile(payload!.userId);
  }

  // ******* mutations *******

  // Edit user profile
  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async editUserProfile(
    @Ctx() { payload }: MyContext,
    @Arg('data', () => EditProfileInput) data: EditProfileInput
  ) {
    try {
      return await this.profileService.editUserProfile(data, payload!.userId);
    } catch (err) {
      throw err;
    }
  }
}
