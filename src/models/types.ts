import { ObjectType, Field } from "type-graphql";

import { User } from "./entity";

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
