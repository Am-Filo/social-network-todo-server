import { Min, Max } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

// ******* entity *******
import { Settings } from '../settings/settings.entity';

// ******* input *******
import {
  CreateSettingsInput,
  SettingsInput,
} from '../settings/settings.inputs';

@InputType('createProfileInput')
export class CreateProfileInput {
  @Field({ nullable: true, defaultValue: 'user_' + new Date().getTime() })
  name?: string;

  @Field({ nullable: true, defaultValue: 'placeholder.png' })
  picture?: string;

  @Field(() => CreateSettingsInput, { nullable: true })
  settings?: Settings;
}

@InputType('profileInput')
export class ProfileInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true, defaultValue: 'placeholder.png' })
  picture?: string;

  @Field(() => SettingsInput, { nullable: true })
  settings?: Settings;
}

@InputType('editProfileInput')
export class EditProfileInput {
  @Field({ nullable: true, defaultValue: 'user_' + new Date().getTime() })
  name?: string;

  @Field({ nullable: true, defaultValue: 'placeholder.png' })
  picture?: string;

  @Field(() => SettingsInput, { nullable: true })
  settings?: Settings;
}

@InputType('findProfileInput')
export class FindProfileInput {
  @Field(() => Int, { nullable: true })
  @Min(1)
  id?: number;
}

@InputType('getProfilesInput')
export class GetProfilesInput {
  @Field(() => Int, { defaultValue: 0 })
  @Min(0)
  skip: number;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take = 25;

  @Field({ nullable: true })
  onlineType?: boolean;

  get startIndex(): number {
    return this.skip;
  }
  get endIndex(): number {
    return this.skip + this.take;
  }
}
