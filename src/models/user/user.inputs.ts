import { Min, Max } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';

// ******* entity *******
import { Profile } from '../profile/profile.entity';

// ******* input *******
import { CreateProfileInput } from '../profile/profile.inputs';

@InputType('CreateUser')
export class CreateUserInput {
  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  password: string;

  @Field(() => CreateProfileInput, { nullable: true })
  profile: Profile;
}

@InputType('DeleteUser')
export class DeleteUserInput {
  @Field(() => Int, { nullable: false })
  id: number;

  @Field(() => String, { nullable: false })
  email: string;
}

@InputType('EditUser')
export class EditUserInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;
}

@InputType('findUserInput')
export class FindUserInput {
  @Field(() => Int, { nullable: true })
  @Min(1)
  id?: number;

  @Field(() => String, { nullable: true })
  email?: string;
}

@InputType('loginUserInput')
export class LoginUserInput {
  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  password: string;
}

@InputType('getUsersInput')
export class GetUsersInput {
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
