import { Field, InputType } from "type-graphql";

// ******* entity *******
import { Settings } from "../entity/Settings";

// ******* input *******
import { SettingsInput } from "./Settings";

@InputType("profile")
export class ProfileInput {
  @Field({ nullable: true, defaultValue: "usernname" })
  name: string;

  @Field({ nullable: true, defaultValue: "picture" })
  picture: string;

  @Field(() => SettingsInput)
  settings: Settings;
}
