import { Field, ObjectType } from "type-graphql";

// ******* entity *******
import { User } from "./user.entity";

@ObjectType("loginResponse")
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
