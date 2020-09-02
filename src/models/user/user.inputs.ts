import { Field, InputType } from "type-graphql";

// ******* entity *******
import { Profile } from "../profile/profile.entity";

// ******* input *******
import { ProfileInput } from "../profile/profile.inputs";

@InputType("CreateUser")
export class CreateUserInput {
  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  password: string;

  @Field(() => ProfileInput, { nullable: true })
  profile: Profile;
}

@InputType("EditUser")
export class EditUserInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;
}
