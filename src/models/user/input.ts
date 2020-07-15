import { InputType, Field } from "type-graphql";

@InputType("user")
export class UserInput {
  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  password: string;
}
