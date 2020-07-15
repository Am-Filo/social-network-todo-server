import { InputType, Field } from "type-graphql";
import { SettingsInput } from "../inputs";
import { Settings } from "../entity";

@InputType()
export class ProfileInput {
  @Field({ nullable: true, defaultValue: "usernname" })
  name: string;

  @Field({ nullable: true, defaultValue: "picture" })
  picture: string;

  @Field(() => SettingsInput)
  settings: Settings;
}
