import { Field, InputType } from "type-graphql";

// ******* entity *******
import { Settings } from "../settings/settings.entity";

// ******* input *******
import { SettingsInput } from "../settings/settings.inputs";

@InputType("profile")
export class ProfileInput {
  @Field({ nullable: true, defaultValue: "usernname" })
  name?: string;

  @Field({ nullable: true, defaultValue: "picture" })
  picture?: string;

  @Field(() => SettingsInput, { nullable: true })
  settings?: Settings;
}
