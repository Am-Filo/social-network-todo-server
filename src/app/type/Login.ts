import { Field, ObjectType } from "type-graphql";

// ******* entity *******
import { User } from "../entity/User";

@ObjectType("loginResponse")
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
