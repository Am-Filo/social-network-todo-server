import { InputType, Field } from "type-graphql";
// import { Settings } from "../entity";

@InputType()
export class ProfileInput {
  @Field({ nullable: true, defaultValue: "usernname" })
  name: string;

  @Field({ nullable: true, defaultValue: "english" })
  picture: string;
}
